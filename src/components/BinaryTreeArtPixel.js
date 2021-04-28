import { useState, useEffect, useRef } from 'react';
import { useConfigContext, SETTINGS } from '../contexts/ConfigContext';
import PALETTES from '../palettes';

function BinaryTreeArtPixel({
  onUpdate,
  depth,
  orientation
}) {
  const { config } = useConfigContext();
  const [ split, setSplit ] = useState(false);

  const dfsp = useRef([0]);
  const c1 = useRef([]);
  const c2 = useRef([]);
  function updateDfsp() {
    if (split) {
      dfsp.current = [1].concat(c1.current, c2.current);
    } else {
      dfsp.current = [0];
    }
    onUpdate(dfsp.current);
  }
  useEffect(() => {
    updateDfsp();
  }, [split, c1, c2, onUpdate]);
  function updateC1(bitstream) {
    c1.current = bitstream;
    updateDfsp();
  }
  function updateC2(bitstream) {
    c2.current = bitstream;
    updateDfsp();
  }

  const classNames=['btap', orientation];
  if (depth === 0) classNames.push('base');

  let bg=null;
  const curPaletteName = config[SETTINGS.PALETTE_NAME];
  if (curPaletteName && Object.keys(PALETTES).includes(curPaletteName)) {
    const curPalette = PALETTES[curPaletteName];
    const palIdx = depth % curPalette.length;
    bg=curPalette[palIdx];
  }

  return (!split ?
    <div className={classNames.join(' ')}
      onClick={() => setSplit(true)}
      data-depth={depth}
      style={bg ? {backgroundColor: bg} : null}
    />
  :
    <div className={classNames.join(' ')}
      data-depth={depth}
      style={bg ? {backgroundColor: bg} : null}
    >
        <BinaryTreeArtPixel
          depth={depth+1}
          orientation={orientation === 'h' ? 'v' : 'h'}
          onUpdate={updateC1}
        />
        <BinaryTreeArtPixel
          depth={depth+1}
          orientation={orientation === 'h' ? 'v' : 'h'}
          onUpdate={updateC2}
        />
    </div>
  );
}

export default BinaryTreeArtPixel;
