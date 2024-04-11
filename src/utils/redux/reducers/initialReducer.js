const initialState = {
  homePage: {},
  downVoteOptions: [],
  initialDeals: {
    popularDeals: [],
    bestDrinks: [],
    favoriteFoods: [],
    events: [],
    recentlyAdded: [],
  },
  initialDealVenues: [],
  initialVenues: [],
  statusBarHeight: null,
};

function initialReducer(state = initialState, action) {
  if (action.type === 'SET_INITIAL') {
    return Object.assign({}, state, {
      ...action.payload,
    });
  }
  return state;
}

export default initialReducer;
