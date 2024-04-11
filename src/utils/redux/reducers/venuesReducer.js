const initialState = {
  venues: [],
};

function venuesReducer(state = initialState, action) {
  if (action.type === 'SET_VENUES') {
    return Object.assign({}, state, {
      ...action.payload,
    });
  }
  return state;
}

export default venuesReducer;
