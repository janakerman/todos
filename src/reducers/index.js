import { combineReducers } from 'redux';

const byId = (state = {}, action) => {
  if (!action.response) {
    return state;
  }

  return {
    ...state,
    ...action.response.entities.todos,
  };
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case 'FETCH_TODOS_REQUEST':
      return true;
    case 'FETCH_TODOS_SUCCESS':
    case 'FETCH_TODOS_FAILURE':
      return false;
    default:
      return state;
  }
};

const errorMessage = (state = null, action) => {
  switch (action.type) {
    case 'FETCH_TODOS_FAILURE':
      return action.message;
    case 'FETCH_TODOS_SUCCESS':
    case 'FETCH_TODOS_REQUEST':
      return null;
    default:
      return state;
  }
};

const todos = combineReducers({
  byId,
  isFetching,
  errorMessage
});

export default todos;

// Public API
export const getTodo = (state, id) => state.byId[id];
export const getIsFetching = (state) => state.isFetching;
export const getErrorMessage = (state) => state.errorMessage;
export const getVisibleTodos = (state, filter) => {

  const completed = (todo) => todo.completed;
  const active = (todo) => !todo.completed;
  const all = (todo) => todo;

  const filterToFunc = {
    all,
    active,
    completed,
  };

  return Object.keys(state.byId)
    .map(id => getTodo(state, id)) // Map to array of todos
    .filter(filterToFunc[filter]);
};
