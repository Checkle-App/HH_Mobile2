import appReducer from './appReducer';
import initialReducer from './initialReducer';
import searchReducer from './searchReducer';
import locationReducer from './locationReducer';
import dealsReducer from './dealsReducer';
import venuesReducer from './venuesReducer';
import userReducer from './userReducer';
import deeplinkReducer from './deeplinkReducer';

export default {
  app: appReducer,
  initial: initialReducer,
  search: searchReducer,
  location: locationReducer,
  deals: dealsReducer,
  venues: venuesReducer,
  user: userReducer,
  deeplink: deeplinkReducer,
};
