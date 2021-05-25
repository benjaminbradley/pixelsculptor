import { SETTINGS, PALETTE_TYPES } from '../contexts/ConfigContext';

export const PALETTES = {
  custom: [],
  a: ['#b2b2b2', '#50394c', '#f4e1d2', '#ffef96'],
  b: ['#80ced6', '#d5f4e6', '#fefbd8', '#618685'],
  c: ['#034f84', '#92a8d1', '#f7cac9', '#f7786b'],
  d: ['#4040a1', '#36486b', '#618685', '#fefbd8'],
  e: ['#6b5b95', '#878f99', '#a2b9bc', '#b2ad7f'],
  f: ['#622569', '#b8a9c9', '#d6d4e0', '#5b9aa0'],
  g: ['#c83349', '#e06377', '#eeac99', '#f9d5e5'],
  h: ['#ff7b25', '#d64161', '#6b5b95', '#feb236'],
  i: ['#d96459', '#f2ae72', '#588c7e', '#f2e394'],
  j: ['#b2ad7f', '#878f99', '#a2b9bc', '#6b5b95'],
  bw: ['#fff', '#000']
};

export const GRADIENTS = {
  custom: {},
  a: {
    0: '#fefbd8',
    15: '#4040a1'
  },
  b: {
    0: '#f9d5e5',
    15: '#c83349'
  },
  c: {
    0: '#80ced6',
    6: '#622569',
    15: '#000'
  },
  d: {
    0: '#f00',
    5: '#0f0',
    10: '#00f',
    15: '#f00'
  },
  e: {
    0: '#0f0',
    5: '#00f',
    10: '#f00',
    15: '#0f0'
  },
  f: {
    0: '#00f',
    5: '#f00',
    10: '#0f0',
    15: '#00f'
  },
  gs: {
    0: '#fff',
    15: '#000'
  }
}

// serialize a colorSet to string
export function encodeCustomPalette(colorSet, type) {
  if (type === PALETTE_TYPES.CYCLE) {
    return colorSet.map(e => e.colorCode).join(',')
  } else if (type === PALETTE_TYPES.GRADIENT) {
    const gradientDef = colorSetToGradientDef(colorSet);
    return Object.entries(gradientDef).map(([k,v]) => `${k}:${v}`).join(',')
  }
  console.log(`ERROR: Unknown CustomPalette type: '${type}'`);
  return null;
}

// deserialize a string to colorSet structure
export function decodeCustomPalette(customPaletteString, type) {
  if (type === PALETTE_TYPES.CYCLE) {
    return customPaletteString.split(',').map(cc => ({colorCode: cc}));
  } else if (type === PALETTE_TYPES.GRADIENT) {
    const colorSet = [];
    customPaletteString.split(',').forEach(gradEntry => {
      const [ index, color ] = gradEntry.split(':');
      colorSet[index] = {colorCode: color};
    });
    // fill empty entries
    for (let i=0; i<colorSet.length; i++) {
      if (!colorSet[i]) colorSet[i] = {colorCode:''};
    }
    return colorSet;
  }
  console.log(`ERROR: Unknown CustomPalette type: '${type}'`);
  return null;
}

export function colorSetToGradientDef(colorSet) {
  // convert colorSet (array of objects w/ colorCode attribute) to gradientDef (object w/ depth indices/colorCode values)
  const gradientDef = {};
  for (let i=0; i<colorSet.length; i++) {
    if (colorSet[i] && 'colorCode' in colorSet[i] && colorSet[i].colorCode) {
      gradientDef[i] = colorSet[i].colorCode;
    }
  }
  return gradientDef;
}

//TODO: memoize
export function getColor(config, depth) {
  switch (config[SETTINGS.PALETTE_TYPE]) {
    case PALETTE_TYPES.MONOCHROME:
      return config[SETTINGS.DEFAULT_COLOR];
    case PALETTE_TYPES.CYCLE:
      const curPaletteName = config[SETTINGS.PALETTE_NAME];
      let curPalette;
      if (curPaletteName === 'custom') {
        const customPalette = decodeCustomPalette(config[SETTINGS.CUSTOM_PALETTE], PALETTE_TYPES.CYCLE);
        curPalette = customPalette.map(e => e.colorCode);
      } else if (curPaletteName && Object.keys(PALETTES).includes(curPaletteName)) {
        curPalette = PALETTES[curPaletteName];
      } else {
        console.log(`ERROR: Unknown Cycle Palette name '${curPaletteName}'`)
        return null;
      }
      const palIdx = depth % curPalette.length;
      return curPalette[palIdx];
      // eslint-disable-next-line no-fallthrough
    case PALETTE_TYPES.GRADIENT:
      const gradPaletteName = config[SETTINGS.PALETTE_NAME];
      let curGradient;
      if (gradPaletteName === 'custom') {
        const colorSet = decodeCustomPalette(config[SETTINGS.CUSTOM_PALETTE], PALETTE_TYPES.GRADIENT);
        curGradient = colorSetToGradientDef(colorSet);
      } else if (gradPaletteName && Object.keys(GRADIENTS).includes(gradPaletteName)) {
        curGradient = GRADIENTS[gradPaletteName];
      } else {
        console.log(`ERROR: Unknown Gradient Palette name '${gradPaletteName}'`)
        return null;
      }
      const gradColors = getGradientEntries(curGradient);
      if (Object.keys(gradColors).map(i=>parseInt(i)).includes(depth)) return gradColors[depth];
      return config[SETTINGS.DEFAULT_COLOR];
      // eslint-disable-next-line no-fallthrough
    default:
      return null;
  }
}


// Thanks, Alnitak! https://stackoverflow.com/questions/11068240/what-is-the-most-efficient-way-to-parse-a-css-color-in-javascript
const memo_cache={};
function memoize(factory, ctx) {
  return function(key) {
    if (!(key in memo_cache)) {
      memo_cache[key] = factory.call(ctx, key);
    }
    return memo_cache[key];
  };
};

const colorToRGBA = (function() {
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  var ctx = canvas.getContext('2d');

  return memoize(function(col) {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillStyle = col;
      var computed = ctx.fillStyle;
      ctx.fillStyle = '#fff';
      ctx.fillStyle = col;
      if (computed !== ctx.fillStyle) {
          return null; // invalid color
      }
      ctx.fillRect(0, 0, 1, 1);
      return [ ...ctx.getImageData(0, 0, 1, 1).data ];
  });
})();

function getBetween(init, final, percent) {
  if (init < final) {
    return (final-init) * percent + init;
  } else {
    return init - (init-final) * percent;
  }
}

//TODO: memoize
export function getGradientEntries(gradient_points) {
  const sortedDepthPoints = Object.keys(gradient_points).map(i=>parseInt(i))
  .sort((a,b) => { return (a < b ? -1 : (a === b ? 0 : 1))});
  let minIdx = 0;
  let maxIdx = 1;
  const gradColors = {};
  while (maxIdx < sortedDepthPoints.length) {
    let minDepth = sortedDepthPoints[minIdx];
    let maxDepth = sortedDepthPoints[maxIdx];
    let initialColor = colorToRGBA(gradient_points[minDepth]);
    if (!initialColor) initialColor = [0,0,0];  // use a default for invalid values
    let finalColor = colorToRGBA(gradient_points[maxDepth]);
    if (!finalColor) finalColor = [0,0,0];  // use a default for invalid values
    for (let i=minDepth; i<=maxDepth; i++) {
      const percent = (i-minDepth)/(maxDepth-minDepth);
      const colorPoint = [];
      for (let j=0; j<3; j++) {
        colorPoint[j] = Math.round(getBetween(initialColor[j], finalColor[j], percent));
      }
      const c = '#'.concat(
        colorPoint[0].toString(16).padStart(2, '0'),
        colorPoint[1].toString(16).padStart(2, '0'),
        colorPoint[2].toString(16).padStart(2, '0')
      );
      gradColors[i] = c;
    }
    minIdx++;
    maxIdx++;
  }
  return gradColors;
}
