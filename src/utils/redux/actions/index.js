export const setApp = payload => dispatch => {
  dispatch({
    type: 'SET_APP',
    payload,
  });
};

export const setInitial = payload => dispatch => {
  dispatch({
    type: 'SET_INITIAL',
    payload,
  });
};

export const setDeals = payload => dispatch => {
  dispatch({
    type: 'SET_DEALS',
    payload,
  });
};

export const setVenues = payload => dispatch => {
  dispatch({
    type: 'SET_VENUES',
    payload,
  });
};

export const setUser = payload => dispatch => {
  dispatch({
    type: 'SET_USER',
    payload,
  });
};

export const setLocation = payload => dispatch => {
  dispatch({
    type: 'SET_LOCATION',
    payload,
  });
};

export const setSearch = payload => dispatch => {
  dispatch({
    type: 'SET_SEARCH',
    payload,
  });
};

export const setDeeplink = payload => dispatch => {
  dispatch({
    type: 'SET_DEEPLINK',
    payload,
  });
};
