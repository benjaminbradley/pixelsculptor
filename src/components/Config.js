import { useConfigContext, updateConfig, SETTINGS } from '../contexts/ConfigContext';

function Config() {
  const { config, dispatch } = useConfigContext();
  function myUpdateConfig(k,v) {
    // store value in context
    dispatch(updateConfig(k,v));
    // update CSS
    switch(k) {
      case SETTINGS.DEFAULT_COLOR:
        document.documentElement.style.setProperty('--default-color', v);
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
            <div id='default-color-sample'/>
            <br/><span className='help'>Can be any valid HTML color name, or a code in #rgb or #rrggbb format.</span>
        </div>
      </div>
    </div>
  );
}

export default Config;
