// make seperate action files if this file gets to large

/* 
    fetch all buses info
*/
export const getAllBus = () => {
  return {
    type: "GET_ALL_BUS"
  };
};

/* 
  login request action 
 */

export const loginIn = formValue => {
  return {
    type: "LOG_IN",
    data: formValue
  };
};

/* logout request */
export const logOut = () => {
  return {
    type: "LOG_OUT"
  };
};

/* 
  register request action
 */

export const register = formValue => {
  return {
    type: "REGISTER",
    data: formValue
  };
};

/*  check login  status */
export const checkLoginStatus = () => {
  return {
    type: "CHECK_LOGIN_STATUS"
  };
};

/*  
  search for bus between start and destination
*/

export const checkBusJouurneySatus = formValue => {
  // console.log(formValue);
  return {
    type: "CHECK_BUS_JOURNEY_STATUS",
    data: formValue
  };
};

/* 
  book seats
*/
export const bookSeats = formValue => {
  return {
    type: "BOOK_SEATS",
    data: formValue
  };
};

/* 
  fetch user info.. including all the bookings
*/

export const getUserInfo = () => {
  return {
    type: "GET_USER_INFO_BOOKING"
  };
};

/* 
  cancel seats request
 */

export const cancelSeats = formValue => {
  return {
    type: "CANCEL_BOOKED_SEATS",
    data: formValue
  };
};

/* 
    fetch all busses from collections

*/

export const getAllBusses = () => {
  return {
    type: "GET_ALL_BUSSES_IN_REPO"
  };
};

// add new bus to the busses collection
export const addNewBus = formValue => {
  console.log(formValue);
  return {
    type: "ADD_NEW_BUS_TO_COLLECTION",
    data: formValue
  };
};

//  edit a bus
export const editBus = formValue => {
  console.log(formValue);
  return {
    type: "EDIT_BUS_IN_COLLECTION",
    data: formValue
  };
};

//  fetch all busses for a particular date and route: used by admin

export const getAllBusInfo = formValue => {
  return {
    type: "BUS_FOR_ADMIN",
    data: formValue
  };
};

//  this action dispatcher is used locally

export const setSelectedBus = formValue => {
  return {
    type: "SET_SELECTED_BUS",
    data: formValue
  };
};

export const getGeocode = (location, startAt = false) => {
  const source = startAt ? "startAt" : "destination";
  return {
    type: "GET_GEOCODE",
    data: location,
    source
  };
};
