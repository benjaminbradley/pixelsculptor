import { useState } from 'react';

function BinaryTreeArtPixel({
  depth,
  orientation
}) {
  const [ split, setSplit ] = useState(false);
  const classNames=['btap', orientation];
  if (depth === 0) classNames.push('base');
  return (!split ?
    <div className={classNames.join(' ')}
      onClick={() => setSplit(true)}
      data-depth={depth}
    />
  :
    <div className={classNames.join(' ')}
      data-depth={depth}
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
