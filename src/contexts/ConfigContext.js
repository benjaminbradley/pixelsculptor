import { createContext, useReducer, useContext } from 'react';

export const ConfigContext = createContext();

export const ACTIONS = {
  UPDATE:1
};

export const SETTINGS = {
  DEFAULT_COLOR: 'd'
};

// Initial state
const initialState = {
  [SETTINGS.DEFAULT_COLOR]: '#ddd'
};

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
