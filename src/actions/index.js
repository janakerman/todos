import {normalize} from 'normalizr';
import * as schema from './schema';
import * as api from '../api';
import {getIsFetching} from '../reducers';

/* Async action creator.
  Previously we returned a promise, which we've decorated dispatch to handle,
  resulting in a dispatch call on the result. Now, because we want to cause two
  actions to dispatch, we can return a function instead, which is injected with
  dispatch. This allows us to make multiple dispatches within our action creator.

  Such functions returned from other functions are called 'thunks'.
*/
export const fetchTodos = (filter) => (dispatch, getState) => {
  if (getIsFetching(getState(), filter)) {
    return Promise.resolve();
  }

  dispatch({
    type: 'FETCH_TODOS_REQUEST',
    filter,
  });

  return api.fetchTodos(filter).then(
    response => {
      dispatch({
        type: 'FETCH_TODOS_SUCCESS',
        filter,
        response: normalize(response, schema.arrayOfTodos),
      })
    },
    error => {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        filter,
        message: error.message || 'Something went wrong!',
      })
    });
};

export const addTodo = (text) => (dispatch) =>
  api.addTodo(text).then(response => {
    dispatch({
      type: 'ADD_TODO_SUCCESS',
      response: normalize(response, schema.todo),
    });
  });

export const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id,
});
