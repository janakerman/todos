import { createStore } from 'redux';
import todoApp from './reducers';

const logger = (store) => (next) => {
  /* eslint-disable no-console */
  if (!console.group) {
    return next;
  }

  return (action) => {
    console.group(action.type);
    console.log('%c prev state', 'color: gray', store.getState());
    console.log('%c action', 'color: blue', action);
    const returnValue = next(action);
    console.log('%c next state', 'color: green', store.getState());
    console.groupEnd(action.type);
    return returnValue;
  };
  /* eslint-enable no-console */
};

const promise = (store) => (next) => (action) => {
  if (typeof action.then === 'function') {
    return action.then(next);
  }
  return next(action);
};

const wrapDispatchWithMiddlewares = (store, middlewares) => {
  middlewares.slice()
  // Allows middleware to be specified in the order that the action propagates through the middlewares.
    .reverse()
    .forEach(middleware => store.dispatch = middleware(store)(store.dispatch));
};

const configureStore = () => {
  const store = createStore(todoApp);

  const middlewares = [];

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(logger);
  }

  // The order is important here. We want the promise to be resolved before we do our special logging.
  middlewares.push(promise)

  wrapDispatchWithMiddlewares(store, middlewares);

  return store;
};

export default configureStore;
