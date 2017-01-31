import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import todoApp from './reducers';

/*
"A thunk is a subroutine that is create, often automatically, to assist a call to
another subroutine. Thunks are primarily used to represent an additional calculation
that a subroute needs to execute, or call a routine that does not support the usual
calling mechanism."

Here, we're falling into the usual calling mechanism case. The function we want
calling doesn't want the action, it wants the dispatch function so it can dispatch
actions in a different way that default.

We're assuming if we're passed a function, then that wants the dispatch.
*/
const configureStore = () => {

  const middlewares = [thunk];

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }

  return createStore(
    todoApp,
    applyMiddleware(...middlewares) // Second param here is an optional 'enhancer'.
  );
};

export default configureStore;
