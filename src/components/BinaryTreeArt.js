import { useState } from 'react';
import BinaryTreeArtPixel from './BinaryTreeArtPixel.js';

function BinaryTreeArt({
  orientation
}) {
  const [ split, setSplit ] = useState(false);
  let classNames = ['btap', 'base'];
  return (
    <div>
      {!split ?
        <p className={classNames.join(' ')}
          onClick={() => setSplit(true)}
          data-depth={0}
        />
      :
        <p className={classNames.join(' ')}
          data-depth={0}
        >
            <BinaryTreeArtPixel
              depth={1}
              orientation={orientation === 'h' ? 'v' : 'h'}
            />
            <BinaryTreeArtPixel
              depth={1}
              orientation={orientation === 'h' ? 'v' : 'h'}
            />
        </p>
      }
    </div>
  );
}

export default BinaryTreeArt;
