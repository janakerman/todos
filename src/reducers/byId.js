const byId = (state = {}, action) => {
  if (!action.response) {
    return state;
  }

  return {
    ...state,
    ...action.response.entities.todos,
  };
};

export default byId;

export const getTodo = (state, id) => state[id];
