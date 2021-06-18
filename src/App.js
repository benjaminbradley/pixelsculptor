import { useState, useEffect } from 'react';
import './App.css';
import BinaryTreeArtPixel from './components/BinaryTreeArtPixel.js';
import { useConfigContext, updateConfig, SETTINGS, parseUrl, updateUrl } from './contexts/ConfigContext';
import Config from './components/Config.js';
import { bitArrayToBase64, base64toBitArray, parseBitStream } from './lib/binaryTools.js';

function App() {
  const { config, dispatch: configDispatch } = useConfigContext();
  const VIEWS={
    CONFIG:3,
    SCULPT:1
  };
  const [currentView, setCurrentView] = useState(VIEWS.CONFIG);
  const [loadedSculptPath, setLoadedSculptPath] = useState(null);
  useEffect(() => {
    const params = parseUrl();
    // load config
    Object.entries(params).forEach( ([key,value]) => {
      if (Object.values(SETTINGS).includes(key)) {
        configDispatch(updateConfig(key, value));
      }
    });
    // Process sculpt path in URL
    if (params[SETTINGS.SCULPT_PATH] && config[SETTINGS.SCULPT_PATH] !== params[SETTINGS.SCULPT_PATH]) {
      config[SETTINGS.SCULPT_PATH] = params[SETTINGS.SCULPT_PATH];
    }
  },[window.location.hash]);
  useEffect(() => {
    if (!config[SETTINGS.SCULPT_PATH]) return;
    const bitstream = base64toBitArray(config[SETTINGS.SCULPT_PATH]);
    // replay loaded sculptpath
    const [sculptPath] = parseBitStream(bitstream, 0);
    //console.log("Parsed bitstream is:",sculptPath);
    if (sculptPath.length) {
      console.log("starting replay");
      doSculpt();
      setLoadedSculptPath(sculptPath[0]);
      console.log("window.performance.memory =",window.performance.memory);
    }
  }, [config[SETTINGS.SCULPT_PATH]])

  function doConfig() {
    setCurrentView(VIEWS.CONFIG);
  }
  function doSculpt() {
    setCurrentView(VIEWS.SCULPT);
  }
  function updateSculptPath(bitstream) {
    const base64 = bitArrayToBase64(bitstream);
    updateUrl(SETTINGS.SCULPT_PATH, base64)
  }
  function resetSculpture() {
    setLoadedSculptPath(-1);
    setTimeout(() => setLoadedSculptPath(null), 10);
  }
  return (
    <div className="App">
      {currentView === VIEWS.CONFIG ?
        <Config
          doSculpt={doSculpt}
        />
      :
        <div>
          <div className='canvasButtons'>
            <button onClick={doConfig}>Palette</button>
            <button onClick={resetSculpture}>Reset</button>
          </div>
          <BinaryTreeArtPixel
            depth={0}
            orientation={'v'}
            onUpdate={updateSculptPath}
            loadSculptPath={loadedSculptPath}
          />
        </div>
      }
    </div>
  );
}

export default App;
