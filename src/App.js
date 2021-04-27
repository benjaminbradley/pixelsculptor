import { useState } from 'react';
import './App.css';
import BinaryTreeArtPixel from './components/BinaryTreeArtPixel.js';
import { ConfigProvider } from './contexts/ConfigContext';
import Config from './components/Config.js';

function App() {
  const VIEWS={
    CONFIG:3,
    MENU:2,
    SCULPT:1
  };
  const [currentView, setCurrentView] = useState(VIEWS.CONFIG);
  function doMEnu() {
    setCurrentView(VIEWS.MENU);
  }
  function doConfig() {
    setCurrentView(VIEWS.CONFIG);
  }
  function doSculpt() {
    setCurrentView(VIEWS.SCULPT);
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
            <button id='goToMenu' onClick={doMEnu}>Menu</button>
            {currentView === VIEWS.CONFIG?
              <Config
                doSculpt={doSculpt}
              />
            :
              <BinaryTreeArtPixel
                depth={0}
                orientation={'v'}
              />
            }
          </div>
        }
      </ConfigProvider>
    </div>
  );
}

export default App;
