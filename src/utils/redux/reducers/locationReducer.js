const initialState = {
  location: false,
  loadingLocation: false,
  position: null,
  locationAvailable: false,
};

function locationReducer(state = initialState, action) {
  if (action.type === 'SET_LOCATION') {
    return Object.assign({}, state, {
      ...action.payload,
    });
  }
  return state;
}

export default locationReducer;
