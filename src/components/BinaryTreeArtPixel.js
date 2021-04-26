import { useState } from 'react';

function BinaryTreeArtPixel({
  depth,
  orientation
}) {
  const [ split, setSplit ] = useState(false);
  const classNames=['btap', orientation];
  return (!split ?
    <p className={classNames.join(' ')}
      onClick={() => setSplit(true)}
      data-depth={depth}
    />
  :
    <p className={classNames.join(' ')}
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
    </p>
  );
}

export default BinaryTreeArtPixel;
