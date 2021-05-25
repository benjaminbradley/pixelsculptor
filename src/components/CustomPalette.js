import { useState, useEffect } from 'react';
import { useConfigContext, SETTINGS, PALETTE_TYPES, updateConfig, updateUrl } from '../contexts/ConfigContext';
import { encodeCustomPalette, decodeCustomPalette, getGradientEntries, colorSetToGradientDef } from '../lib/paletteTools';
import addIcon from '../assets/ftadd.svg';
import delIcon from '../assets/ftedit-remove.svg';

function CustomPalette({
  type
}) {
  const { config, dispatch } = useConfigContext();
  const [ colorSet, setColorSet ] = useState(
    decodeCustomPalette(config[SETTINGS.CUSTOM_PALETTE], type)
  );
  const [ curGradientEntries, setGradientEntries ] = useState({});

  // When colorSet changes, update ConfigContext and URL
  useEffect(() => {
    const customPaletteString = encodeCustomPalette(colorSet, type);
    if (typeof customPaletteString === 'undefined') return;
    // store value in context
    dispatch(updateConfig(SETTINGS.CUSTOM_PALETTE, customPaletteString));
    updateUrl(SETTINGS.CUSTOM_PALETTE, customPaletteString);
    if (type === PALETTE_TYPES.GRADIENT) {
      const gradientDef = colorSetToGradientDef(colorSet)
      setGradientEntries(getGradientEntries(gradientDef));
    }
  }, [colorSet, type, dispatch]);

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

  return (
    <div className='custom-palette-creator'>
      <table>
        <tr>
          {colorSet.map((e,i) =>
            <th key={`custpalcr_idx_${i}`} className={i===0 ? 'first' : null}>
              {i}
              <div className='colorsample' style={{backgroundColor: (e.colorCode ? e.colorCode : getGradColor(i))}} />
            </th>
          )}
          <th rowSpan="3"><button onClick={addEntryToEnd} className="add-entry"><img src={addIcon} alt="Add palette entry to end"/></button></th>
        </tr>
        <tr>
          {colorSet.map((ce,i) =>
            <td key={`custpalcr_code_${i}`} className={i===0 ? 'first' : null}>
              <input type='text' value={ce.colorCode} onChange={(e) => updateColor(i, e.target.value)}/>
            </td>
          )}
        </tr>
        <tr>
          {colorSet.map((e,i) =>
            <td key={`custpalcr_ops_${i}`} className={i===0 ? 'first' : null}>
              <button onClick={() => addEntryAt(i)} className="add-before"><img src={addIcon} alt="Add palette entry before this"/></button>
              <button onClick={() => delEntryAt(i)} className="remove"><img src={delIcon} alt="Remove this palette entry"/></button>
            </td>
          )}
        </tr>
      </table>
    </div>
  );
}

export default CustomPalette;
