const initialState = {
  deals: [],
  refreshing: false,
  loadingVerification: false,
};

function dealsReducer(state = initialState, action) {
  if (action.type === 'SET_DEALS') {
    return Object.assign({}, state, {
      ...action.payload,
    });
  }
  return state;
}

export default dealsReducer;
