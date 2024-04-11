import {SortTypes} from '../../constants';

const initialState = {
  searchQuery: {
    text: '',
    location: '',
  },
  activeSort: SortTypes.Time,
  sortOpen: false,
};

function searchReducer(state = initialState, action) {
  if (action.type === 'SET_SEARCH') {
    return Object.assign({}, state, {
      ...action.payload,
    });
  }
  return state;
}

export default searchReducer;
