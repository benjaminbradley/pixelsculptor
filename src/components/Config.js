import { useConfigContext, updateConfig, SETTINGS, updateUrl } from '../contexts/ConfigContext';
import PALETTES from '../palettes';

function Config({doSculpt}) {
  const { config, dispatch } = useConfigContext();
  function myUpdateConfig(k,v) {
    // store value in context
    dispatch(updateConfig(k,v));
    updateUrl(k, v);
    // update CSS
    switch(k) {
      case SETTINGS.DEFAULT_COLOR:
        document.documentElement.style.setProperty('--default-color', v);
        break;
      case SETTINGS.PALETTE_NAME:
        break;
      default:
        console.log(`Unknown settings key: '${k}'`);
    }
  }
  function getValue(key) {
    if (Object.keys(config).includes(key)) return config[key];
    return '';
  }
  return (
    <div>
      <h1>Make it yours</h1>
      <div id='settings'>
        <div className='setting'>
            <label htmlFor='default-color'>Default color:</label>
            <input id='default-color' type='text' value={getValue(SETTINGS.DEFAULT_COLOR)} onChange={(e) => myUpdateConfig(SETTINGS.DEFAULT_COLOR, e.target.value)}/>
            <div id='default-color-sample' className='colorsample'/>
            <br/><span className='help'>Can be any valid HTML color name, or a code in #rgb or #rrggbb format.</span>
        </div>
        <div className='setting'>
            <label>Palette:</label>
            <div id='palette-options' onChange={(e) => myUpdateConfig(SETTINGS.PALETTE_NAME, e.target.value)}>
              <div>
                <input type='radio' name='palette' value={'none'} id={`palette_none`}
                  checked={config[SETTINGS.PALETTE_NAME] === 'none'}
                />
                <label htmlFor={`palette_none`}>None (use default color)</label>
              </div>
              {Object.entries(PALETTES).map(([palette_name, palette_colors]) => (
                <div key={`palette_${palette_name}`}>
                  <input type='radio' name='palette' value={palette_name} id={`palette_${palette_name}`}
                    checked={config[SETTINGS.PALETTE_NAME] === palette_name}
                  />
                  <label htmlFor={`palette_${palette_name}`}>
                    {palette_colors.map(c => (
                      <div className='colorsample' style={{backgroundColor: c}} key={`palette_${palette_name}_${c.replace(/[^0-9a-zA-Z]/, '')}`}/>
                    ))}
                  </label>
                </div>
              ))}
            </div>
            <span className='help'>Palette colors will cycle and repeat with depth.</span>
        </div>
        <button onClick={doSculpt}>{`Let's Sculpt!`}</button>
      </div>
    </div>
  );
}

export default Config;
