import { combineReducers } from 'redux';

// TODO: We're maintaining the lists as state, can these arrays be something we calculate on the fly?
// Probably goes against the whole idiom of Redux but I'm too tired to think - answer this question tomorrow!

const createList = (filter) => {
  const handleToggle = (state, action) => {
    const {result: toggledId, entities} = action.response;
    const {completed} = entities.todos[toggledId];
    const shouldRemove = (
      (completed && filter === 'active') ||
      (!completed && filter === 'completed')
    );

    return shouldRemove ?
      state.filter(id => id !== toggledId) :
      state;
  };

  const ids =  (state = [], action) => {
    switch (action.type) {
      case 'FETCH_TODOS_SUCCESS':
        // If the filter hasn't changed, then don't update the list. Note: Not 100% sure why this is needed - premature optimisation?
        // TODO: Answer the above tomorrow!
        return filter === action.filter ?
          action.response.result :
          state;
      case 'ADD_TODO_SUCCESS':
        // We only add the ID to active & all lists as no newly added todo is completed.
        return filter !== 'completed' ?
          [...state, action.response.result] :
          state;
      case 'TOGGLE_TODO_SUCCESS':
        return handleToggle(state, action);
      default:
        return state;
    }
  };

  const isFetching = (state = false, action) => {
    if (action.filter !== filter) {
      return state;
    }

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
    if (action.filter !== filter) {
      return state;
    }

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

  return combineReducers({
    ids,
    isFetching,
    errorMessage,
  });
};

export default createList;

export const getIds = (state) => state.ids;
export const getIsFetching = (state) => state.isFetching;
export const getErrorMessage = (state) => state.errorMessage;
