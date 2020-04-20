let initialState = false;

export const setSelectedBusReducer = (state = false, action) => {
  switch (action.type) {
    case "SET_SELECTED_BUS":
      return { ...action.data };
    default:
      return state;
  }
};
