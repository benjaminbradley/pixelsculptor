import { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useConfigContext, SETTINGS, PALETTE_TYPES, updateConfig, updateUrl } from '../contexts/ConfigContext';
import { encodeCustomPalette, decodeCustomPalette, getGradientEntries, colorSetToGradientDef } from '../lib/paletteTools';
import addIcon from '../assets/ftadd.svg';
import delIcon from '../assets/ftedit-remove.svg';
import editIcon from '../assets/ftpencil.svg';
import insertIcon from '../assets/ftinscol.svg';
import closeIcon from '../assets/ftbrackets.svg';

function CustomPalette({
  type
}) {
  const { config, dispatch } = useConfigContext();
  const [ colorSet, setColorSet ] = useState(
    decodeCustomPalette('', type)
  );
  const [ curGradientEntries, setGradientEntries ] = useState({});
  const [ showCustomPaletteEditor, setShowCustomPaletteEditor ] = useState(false);
  const [ colorPickerIsVisible, setColorPickerIsVisible ] = useState(false);
  const [ pickerColor, setPickerColor ] = useState('');
  const pickerIndex = useRef();

  // Load custom palette from config when it changes externally
  useEffect(() => {
    setColorSet(decodeCustomPalette(config[SETTINGS.CUSTOM_PALETTE], type));
  }, [config, type]);

  // When colorSet changes, update ConfigContext and URL
  useEffect(() => {
    const customPaletteString = encodeCustomPalette(colorSet, type);
    if (!customPaletteString) return;
    if (type === PALETTE_TYPES.GRADIENT) {
      const gradientDef = colorSetToGradientDef(colorSet)
      setGradientEntries(getGradientEntries(gradientDef));
    }
    if (customPaletteString === config[SETTINGS.CUSTOM_PALETTE]) return; // no change
    // store value in context
    dispatch(updateConfig(SETTINGS.CUSTOM_PALETTE, customPaletteString));
    updateUrl(SETTINGS.CUSTOM_PALETTE, customPaletteString);
  }, [colorSet, type, dispatch, config]);

  function updateColor(i, newCode) {
    colorSet[i].colorCode = newCode;
    setColorSet([...colorSet]);
  }

  const newEntry = {colorCode:''};

  function addEntryToEnd() {
    colorSet.push(newEntry);
    setColorSet([...colorSet]);
  }

  function addEntryAt(i) {
    colorSet.splice(i, 0, newEntry);
    setColorSet([...colorSet]);
  }

  function delEntryAt(i) {
    colorSet.splice(i, 1);
    setColorSet([...colorSet]);
  }

  function getGradColor(depth) {
    if (depth in curGradientEntries) return curGradientEntries[depth];
    return null;
  }

  function showColorPicker(initialColor, index) {
    setPickerColor(initialColor);
    pickerIndex.current = index;
    setColorPickerIsVisible(true);
  }

  function pickerReturn(newColor) {
    setColorPickerIsVisible(false);
    updateColor(pickerIndex.current, newColor);
  }

  return (
    <div className='customPalette'>
      {type === PALETTE_TYPES.GRADIENT &&
        Object.entries(curGradientEntries).map(([d,c]) => (
          <div className='colorsample gradient' style={{backgroundColor: c}} key={`palette_gradient_CUSTOM_${d}_${c.replace(/[^0-9a-zA-Z]/, '')}`}/>
        ))
      }
      {type === PALETTE_TYPES.CYCLE &&
        colorSet.map((c,i) => (
          <div className='colorsample' style={{backgroundColor: c.colorCode}} key={`palette_cycle_CUSTOM_${i}`}/>
        ))
      }
      <span>custom</span>
      <button onClick={() => setShowCustomPaletteEditor(true)} className="edit" title="Edit custom palette"><img src={editIcon} alt="Edit custom palette"/></button>
      {showCustomPaletteEditor &&
        <div>
          <div className='custom-palette-creator-backdrop'></div>
          <div className='custom-palette-creator-container'>
            <div className='custom-palette-creator'>
              <button className='close' onClick={() => setShowCustomPaletteEditor(false)} title="Close custom palette editor"><img src={closeIcon} alt="Close custom palette editor"/></button>
              <h2>Custom Palette Editor</h2>
              <div className='palette-entries'>
                {colorSet.map((e,i) =>
                  <div className='palette-entry' key={`custpalcr_idx_${i}`}>
                    <div className='pe-row'>
                      {i}
                      <div className='colorsample' style={{backgroundColor: (e.colorCode ? e.colorCode : getGradColor(i))}} />
                    </div>
                    <div className='pe-row'>
                      <input type='text' value={e.colorCode} onChange={(e) => updateColor(i, e.target.value)} placeholder="#RRGGBB"
                        title="Enter an HTML color name or code in #RGB or #RRGGBB hexadecimal format"
                      />
                    </div>
                    <div className='pe-row'>
                      <button onClick={() => addEntryAt(i)} className="add-before" title="Add palette entry before this one"><img src={insertIcon} alt="Add palette entry before this"/></button>
                      <button onClick={() => delEntryAt(i)} className="remove" title="Remove this palette entry"><img src={delIcon} alt="Remove this palette entry"/></button>
                      <button onClick={() => showColorPicker(e.colorCode, i)} className="edit" title="Open color picker"><img src={editIcon} alt="Open color picker"/></button>
                    </div>
                  </div>
                )}
                <div className='palette-entry'>
                  <button onClick={addEntryToEnd} className="add-entry" title="Add palette entry"><img src={addIcon} alt="Add palette entry to end"/></button>
                  {!colorSet.length &&
                    <span> &lArr; click to add to the palette</span>
                  }
                </div>
              </div>
              {colorPickerIsVisible &&
                <HexColorPicker color={pickerColor} onChange={pickerReturn} />
              }
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default CustomPalette;
