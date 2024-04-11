const initialState = null;

function deeplinkReducer(state = initialState, action) {
  if (action.type === 'SET_DEEPLINK') {
    return Object.assign({}, state, {
      ...action.payload,
    });
  }
  return state;
}

export default deeplinkReducer;
