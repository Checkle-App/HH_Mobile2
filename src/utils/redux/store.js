import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import rootReducer from './reducers';

export const configureStore = () => {
  const middleware = [];

  middleware.push(thunk);

  /* Must be last middleware to be pushed */
  if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
  }

  const store = createStore(
    combineReducers(rootReducer),
    applyMiddleware(...middleware),
  );

  return store;
};
