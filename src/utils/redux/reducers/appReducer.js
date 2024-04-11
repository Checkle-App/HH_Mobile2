const initialState = {
  loading: false,
  loadingDeepLink: false,
  error: false,
  dataLoading: false,
};

function appReducer(state = initialState, action) {
  if (action.type === 'SET_APP') {
    return Object.assign({}, state, {
      ...action.payload,
    });
  }
  return state;
}

export default appReducer;
