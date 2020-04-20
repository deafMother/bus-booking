// state to keep track of whether logged in or not

const initialState = false;

export const loggedIn = (state = initialState, action) => {
  switch (action.type) {
    case "LOGGEDIN":
      return (state = action.status);
    default:
      return state;
  }
};

/* 
    reducer to set user role
*/
export const userRole = (state = "user", action) => {
  switch (action.type) {
    case "USER_ROLE":
      return action.role;
    default:
      return state;
  }
};
