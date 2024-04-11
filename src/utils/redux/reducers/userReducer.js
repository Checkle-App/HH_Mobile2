const initialState = {
  user: null,
  userVenues: [],
};

function userReducer(state = initialState, action) {
  if (action.type === 'SET_USER') {
    return Object.assign({}, state, {
      ...action.payload,
    });
  }
  return state;
}

export default userReducer;
