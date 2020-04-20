let initialState = [];

export const allBusReducer = (state = initialState, action) => {
  //console.log(action);
  switch (action.type) {
    case "ALL_BUSSES_IN_REPO":
      return [...action.data];
    default:
      return state;
  }
};

export const allBusInfoReducerAdmin = (state = { error: false }, action) => {
  //console.log(action);
  switch (action.type) {
    case "ALL_BUSSES_INFO_ADMIN":
      return { ...action.data };
    default:
      return state;
  }
};
