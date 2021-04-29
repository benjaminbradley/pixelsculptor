import { createContext, useReducer, useContext } from 'react';

export const ConfigContext = createContext();

export const ACTIONS = {
  UPDATE:1
};

export const SETTINGS = {
  SCULPT_PATH: 's',
  PALETTE_NAME: 'p',
  DEFAULT_COLOR: 'd'
};

// Initial state
const initialState = {
  [SETTINGS.PALETTE_NAME]: 'none',
  [SETTINGS.DEFAULT_COLOR]: '#ddd'
};

export function parseUrl() {
  if (window.location.hash.length === 0) return {};
  const params={};
  window.location.hash.substring(1).split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    params[key] = decodeURIComponent(value);
  });
  return params;
}

export function updateUrl(setting_key, raw_value) {
  const params = parseUrl();
  params[setting_key] = raw_value;
  const newHash = Object.entries(params).map(
    ([key,value]) => `${key}=${encodeURIComponent(value)}`
  ).join('&');
  window.location.hash = newHash;
}

// Action creators
export function updateConfig(key, value) {
  return { type: ACTIONS.UPDATE, key, value };
}

// Reducer
export const configReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
}

function ConfigProvider(props) {
  const [config, dispatch] = useReducer(configReducer, initialState);
  const configData = { config, dispatch };
  return <ConfigContext.Provider value={configData} {...props} />;
}

function useConfigContext() {
  return useContext(ConfigContext);
}

export { ConfigProvider, useConfigContext };
