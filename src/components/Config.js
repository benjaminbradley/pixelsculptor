import { useConfigContext, updateConfig, SETTINGS, updateUrl, PALETTE_TYPES } from '../contexts/ConfigContext';
import CustomPalette from './CustomPalette';
import { PALETTES, GRADIENTS, getGradientEntries, decodeCustomPalette, encodeCustomPalette } from '../lib/paletteTools';

function Config({doSculpt}) {
  const { config, dispatch } = useConfigContext();

  function myUpdateConfig(k,v) {
    // side effects: update CSS, etc.
    switch(k) {
      case SETTINGS.DEFAULT_COLOR:
        document.documentElement.style.setProperty('--default-color', v);
        break;
      case SETTINGS.PALETTE_TYPE:
        // if custom palette is non-blank, and switching between cycle/gradient, convert the format
        if ( config[SETTINGS.CUSTOM_PALETTE]
          && [PALETTE_TYPES.CYCLE, PALETTE_TYPES.GRADIENT].includes(config[SETTINGS.PALETTE_TYPE])
          && [PALETTE_TYPES.CYCLE, PALETTE_TYPES.GRADIENT].includes(v)
          && config[SETTINGS.PALETTE_TYPE] !== v
        ) {
          const oldColorSet = decodeCustomPalette(config[SETTINGS.CUSTOM_PALETTE], config[SETTINGS.PALETTE_TYPE]);
          const newCustomPalette = encodeCustomPalette(oldColorSet, v);
          dispatch(updateConfig(SETTINGS.CUSTOM_PALETTE, newCustomPalette));
          updateUrl(SETTINGS.CUSTOM_PALETTE, newCustomPalette);
        }
        break;
      case SETTINGS.PALETTE_NAME:
      case SETTINGS.GRADIENT_NAME:
        break;
      default:
        console.log(`Unknown settings key: '${k}'`);
    }
    // store value in context
    dispatch(updateConfig(k,v));
    updateUrl(k, v);
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
          <label>Palette type:</label>
          <div id='palette-type-options'>
            {Object.entries({
              'Monochrome (use default color)': PALETTE_TYPES.MONOCHROME,
              'Repeating cycle': PALETTE_TYPES.CYCLE,
              'Gradient': PALETTE_TYPES.GRADIENT
            }).map(([label, key]) =>
              <div key={`palette_type_${key}`}>
                <input type='radio' name='palette_type' value={key} id={`palette_type_${key}`}
                  checked={config[SETTINGS.PALETTE_TYPE] === key}
                  onChange={(e) => myUpdateConfig(SETTINGS.PALETTE_TYPE, e.target.value)}
                />
                <label htmlFor={`palette_type_${key}`}>{label}</label>
                  {PALETTE_TYPES.CYCLE === key && config[SETTINGS.PALETTE_TYPE] === key ?
                    <div id='palette-options'>
                      <span className='help'>Palette colors will cycle and repeat with depth.</span>
                      {Object.entries(PALETTES).map(([palette_name, palette_colors]) => (
                        <div key={`palette_cycle_${palette_name}`}>
                          <input type='radio' name='palette' value={palette_name} id={`palette_cycle_${palette_name}`}
                            checked={config[SETTINGS.PALETTE_NAME] === palette_name}
                            onChange={(e) => myUpdateConfig(SETTINGS.PALETTE_NAME, e.target.value)}
                          />
                          <label htmlFor={`palette_cycle_${palette_name}`}>
                            {palette_name === 'custom' &&
                              <CustomPalette
                                type={key}
                              />
                            }
                            {palette_colors.map(c => (
                              <div className='colorsample' style={{backgroundColor: c}} key={`palette_cycle_${palette_name}_${c.replace(/[^0-9a-zA-Z]/, '')}`}/>
                            ))}
                          </label>
                        </div>
                      ))}
                    </div>                      
                  : null}
                  {PALETTE_TYPES.GRADIENT === key && config[SETTINGS.PALETTE_TYPE] === key ?
                    <div id='gradient-options'>
                      <span className='help'>Palette colors transition between two or more colors.</span>
                      {Object.entries(GRADIENTS).map(([gradient_name, gradient_points]) => (
                        <div key={`palette_gradient_${gradient_name}`}>
                          <input type='radio' name='palette' value={gradient_name} id={`palette_gradient_${gradient_name}`}
                            checked={config[SETTINGS.PALETTE_NAME] === gradient_name}
                            onChange={(e) => myUpdateConfig(SETTINGS.PALETTE_NAME, e.target.value)}
                          />
                          <label htmlFor={`palette_gradient_${gradient_name}`}>
                            {gradient_name === 'custom' &&
                              <CustomPalette
                                type={key}
                              />
                            }
                            {Object.entries(getGradientEntries(gradient_points)).map(([d,c]) => (
                              <div className='colorsample gradient' style={{backgroundColor: c}} key={`palette_gradient_${gradient_name}_${d}_${c.replace(/[^0-9a-zA-Z]/, '')}`}/>
                            ))}
                          </label>
                        </div>
                      ))}
                    </div>
                  : null}
              </div>
            )}
          </div>
        </div>
        <div className='setting'>
          <label htmlFor='default-color'>Default color:</label>
          <input id='default-color' type='text' value={getValue(SETTINGS.DEFAULT_COLOR)} onChange={(e) => myUpdateConfig(SETTINGS.DEFAULT_COLOR, e.target.value)}/>
          <div id='default-color-sample' className='colorsample'/>
          <br/><span className='help'>Can be any valid HTML color name, or a code in #rgb or #rrggbb format.</span>
        </div>
        <button onClick={doSculpt}>{`Let's Sculpt!`}</button>
        <a target="_blank" rel="noreferrer" className='big button' href="https://github.com/benjaminbradley/pixelsculptor#readme">About</a>
      </div>
    </div>
  );
}

export default Config;
