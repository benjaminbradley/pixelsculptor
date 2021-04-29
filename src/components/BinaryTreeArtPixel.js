import { useState, useEffect, useRef } from 'react';
import { useConfigContext } from '../contexts/ConfigContext';
import { getColor } from '../lib/paletteTools';

function BinaryTreeArtPixel({
  loadSculptPath,
  onUpdate,
  depth,
  orientation
}) {
  const { config } = useConfigContext();
  const [ split, setSplit ] = useState(false);
  const [c1LoadSculptPath, setC1LoadSculptPath] = useState(null);
  const [c2LoadSculptPath, setC2LoadSculptPath] = useState(null);
  const LOADSTATE = {NA:0, LOADING:1, DONE:2};
  const loadState = useRef(LOADSTATE.NA);

  useEffect(() => {
    if (loadSculptPath === -1 && split) {
      // propagate reset action
      setC1LoadSculptPath(-1);
      setC2LoadSculptPath(-1);
      setSplit(false);
    }
    if (Object.prototype.toString.call( loadSculptPath ) === '[object Array]' && loadState.current === LOADSTATE.NA) {
      // propagate load action
      loadState.current = LOADSTATE.LOADING;
      setSplit(true);
      if (loadSculptPath.length > 0) {
        setC1LoadSculptPath(loadSculptPath[0]);
        if (loadSculptPath.length > 1)
          setC2LoadSculptPath(loadSculptPath[1]);
      }
      loadState.current = LOADSTATE.DONE;
    }
  }, [loadSculptPath]);
  const dfsp = useRef([0]);
  const c1 = useRef([]);
  const c2 = useRef([]);
  function updateDfsp() {
    if (split) {
      dfsp.current = [1].concat(c1.current, c2.current);
    } else {
      dfsp.current = [0];
    }
    // if loading, don't propagate upwards
    if (Object.prototype.toString.call( loadSculptPath ) === '[object Array]' && loadState.current === LOADSTATE.LOADING) return;
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

  const bg = getColor(config, depth);

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
          loadSculptPath={c1LoadSculptPath}
        />
        <BinaryTreeArtPixel
          depth={depth+1}
          orientation={orientation === 'h' ? 'v' : 'h'}
          onUpdate={updateC2}
          loadSculptPath={c2LoadSculptPath}
        />
    </div>
  );
}

export default BinaryTreeArtPixel;
