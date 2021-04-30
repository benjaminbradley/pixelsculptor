import { SETTINGS, PALETTE_TYPES } from '../contexts/ConfigContext';

export const PALETTES = {
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

export function getColor(config, depth) {
  switch (config[SETTINGS.PALETTE_TYPE]) {
    case PALETTE_TYPES.MONOCHROME:
      return config[SETTINGS.DEFAULT_COLOR];
    case PALETTE_TYPES.CYCLE:
      const curPaletteName = config[SETTINGS.PALETTE_NAME];
      if (curPaletteName && Object.keys(PALETTES).includes(curPaletteName)) {
        const curPalette = PALETTES[curPaletteName];
        const palIdx = depth % curPalette.length;
        return curPalette[palIdx];
      } else {
        console.log(`ERROR: Unknown Cycle Palette name '${curPaletteName}'`)
        return null;
      }
      // eslint-disable-next-line no-fallthrough
    case PALETTE_TYPES.GRADIENT:
      const gradPaletteName = config[SETTINGS.PALETTE_NAME];
      if (gradPaletteName && Object.keys(GRADIENTS).includes(gradPaletteName)) {
        const curGradient = GRADIENTS[gradPaletteName];
        const gradColors = getGradientEntries(curGradient);
        if (Object.keys(gradColors).map(i=>parseInt(i)).includes(depth)) return gradColors[depth];
        return config[SETTINGS.DEFAULT_COLOR];
      } else {
        console.log(`ERROR: Unknown Gradient Palette name '${gradPaletteName}'`)
        return null;
      }
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
    const initialColor = colorToRGBA(gradient_points[minDepth]);
    const finalColor = colorToRGBA(gradient_points[maxDepth]);
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