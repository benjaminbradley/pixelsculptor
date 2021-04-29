import { useState, useEffect } from 'react';
import './App.css';
import BinaryTreeArtPixel from './components/BinaryTreeArtPixel.js';
import { ConfigProvider } from './contexts/ConfigContext';
import Config from './components/Config.js';
import { bitArrayToBase64, base64toBitArray, parseBitStream } from './lib/binaryTools.js';

function App() {
  const VIEWS={
    CONFIG:3,
    MENU:2,
    SCULPT:1
  };
  const [currentView, setCurrentView] = useState(VIEWS.CONFIG);
  const [loadedSculptPath, setLoadedSculptPath] = useState(null);
  useEffect(() => {
    // parse hash in URL
    if (window.location.hash.length > 1) {
      const params={};
      window.location.hash.substring(1).split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        params[key] = decodeURIComponent(value);
      });
      if (params['s']) {
        const bitstream = base64toBitArray(params['s']);
        // replay loaded sculptpath
        const [sculptPath] = parseBitStream(bitstream, 0);
        //console.log("Parsed bitstream is:",sculptPath);
        if (sculptPath.length) {
          console.log("starting replay");
          doSculpt();
          setLoadedSculptPath(sculptPath[0]);
          console.log("window.performance.memory =",window.performance.memory);
        }
      }
    }
  },[window.location.hash]);
  function doMEnu() {
    setCurrentView(VIEWS.MENU);
  }
  function doConfig() {
    setCurrentView(VIEWS.CONFIG);
  }
  function doSculpt() {
    setCurrentView(VIEWS.SCULPT);
  }
  function updateSculptPath(bitstream) {
    const base64 = bitArrayToBase64(bitstream);
    // update URL
    window.location.hash = `s=${encodeURIComponent(base64)}`;
  }
  function resetSculpture() {
    setLoadedSculptPath(-1);
    setTimeout(() => setLoadedSculptPath(null), 10);
  }
  return (
    <div className="App">
      <ConfigProvider>
        {currentView === VIEWS.MENU ?
          <div id="main-menu">
            <h1>Le Menu</h1>
            <button onClick={doSculpt}>Sculpt!</button>
            <button onClick={doConfig}>
              Configure<br/>
              (Set your palette, etc.)
            </button>
            <a target="_blank" rel="noreferrer" className='button' href="https://github.com/benjaminbradley/pixelsculptor#readme">About</a>
          </div>
        :
          <div>
            <div className='canvasButtons'>
              <button id='goToMenu' onClick={doMEnu}>Menu</button>
              <button onClick={resetSculpture}>Reset</button>
            </div>
            {currentView === VIEWS.CONFIG?
              <Config
                doSculpt={doSculpt}
              />
            :
              <BinaryTreeArtPixel
                depth={0}
                orientation={'v'}
                onUpdate={updateSculptPath}
                loadSculptPath={loadedSculptPath}
              />
            }
          </div>
        }
      </ConfigProvider>
    </div>
  );
}

export default App;
