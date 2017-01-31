import { v4 } from 'node-uuid';
import * as api from '../api';

const requestTodos = (filter) => ({
  type: 'REQUEST_TODOS',
  filter,
});

const receiveTodos = (filter, response) => ({
  type: 'RECEIVE_TODOS',
  filter,
  response,
});

/* Async action creator.
  Previously we returned a promise, which we've decorated dispatch to handle,
  resulting in a dispatch call on the result. Now, because we want to cause two
  actions to dispatch, we can return a function instead, which is injected with
  dispatch. This allows us to make multiple dispatches within our action creator.

  Such functions returned from other functions are called 'thunks'.
*/
export const fetchTodos = (filter) => (dispatch) => {
  dispatch(requestTodos(filter));
  api.fetchTodos(filter)
    .then(response => dispatch(receiveTodos(filter, response)));
};

export const addTodo = (text) => ({
  type: 'ADD_TODO',
  id: v4(),
  text,
});

export const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id,
});
