import { useState } from 'react';
import { useConfigContext, SETTINGS } from '../contexts/ConfigContext';
import PALETTES from '../palettes';

function BinaryTreeArtPixel({
  depth,
  orientation
}) {
  const { config } = useConfigContext();
  const [ split, setSplit ] = useState(false);
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
        />
        <BinaryTreeArtPixel
          depth={depth+1}
          orientation={orientation === 'h' ? 'v' : 'h'}
        />
    </div>
  );
}

export default BinaryTreeArtPixel;
