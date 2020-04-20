const initialState = {};

export const fetchUserInfo = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_USER_INFO":
      return { ...action.data };
    default:
      return state;
  }
};
