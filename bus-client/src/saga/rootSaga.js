import { put, takeEvery, all } from "redux-saga/effects";

// import history from "../history";
import axios from "../api/index";
import { instanceGeocode, API_GEOCODE } from "../api/index";

import history from "../history";
import { getRepoBusses, getBusInfoAdmin } from "./getRepoBusses";
import { addNewBus, editBus } from "./addBusReducer";

const getJWT = () => {
  let jwtToken = localStorage.getItem("token-bus-jwt");
  if (!jwtToken) {
    jwtToken = "";
  }
  var config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json"
    }
  };

  return config;
};

// get user info
function* getUserInfo() {
  try {
    const config = getJWT();
    const response = yield axios.get("/name", config); // this is the get all users request
    //console.log(response);
    yield put({
      // dispatching the action, this is dispatched to the reducers
      type: "GET_USER",
      error: false,
      data: response.data.data.user
    });
  } catch (err) {
    yield put({
      type: "GET_USER",
      error: true
    });
  }
}
// the token has to be verified while visiting every route, so the token has to be sent with every request
function* verifyToken(action) {
  try {
    const config = getJWT();
    const response = yield axios.get("/", config); // this is the get all users request
    //console.log(response);
    yield put({
      // dispatching the action, this is dispatched to the reducers
      type: "LOGGEDIN",
      error: false,
      token: response.data.token,
      status: true
    });
  } catch (err) {
    yield put({
      type: "LOGGEDIN",
      error: true,
      token: "",
      status: false
    });
  }
}

// login
function* login(action) {
  try {
    const response = yield axios.post("/user/login", action.data);
    localStorage.setItem("token-bus-jwt", response.data.token);
    yield put({
      // dispatching the action, this is dispatched to the reducers
      type: "LOGGEDIN",
      error: false,
      token: response.data.token,
      status: true
    });
  } catch (err) {
    console.log(err.response.data.message);
    yield put({
      type: "LOGGEDIN",
      error: true,
      token: "",
      status: false
    });
  }
}

// logout, note: the server is not processing the logout request, it can be implemented at the server end if required
function* logout() {
  try {
    localStorage.setItem("token-bus-jwt", "xxyyzzzz");
    yield put({
      // dispatching the action, this is dispatched to the reducers
      type: "LOGGEDIN",
      error: false,
      token: "",
      status: false
    });
  } catch (err) {
    yield put({
      type: "LOGGEDIN",
      error: true,
      token: "",
      status: false
    });
  }
}

// get user info
function* getAllBusInfo() {
  try {
    const response = yield axios.get("/getBus");
    console.log(response);
    yield put({
      // dispatching the action, this is dispatched to the reducers
      type: "GET_USER",
      error: false
    });
  } catch (err) {}
}
// login
function* register(action) {
  try {
    console.log(action.data);
    const response = yield axios.post("/user", action.data);
    localStorage.setItem("token-bus-jwt", response.data.token);
    console.log(response);
    yield put({
      // dispatching the action, this is dispatched to the reducers
      type: "LOGGEDIN",
      error: false,
      token: response.data.token,
      status: true
    });
  } catch (err) {
    yield put({
      type: "LOGGEDIN",
      error: true,
      token: "",
      status: false
    });
  }
}

/*  check login status
 */
function* verifyLoginStatus() {
  try {
    const config = getJWT();
    const response = yield axios.get("/user/checkLoginStatus", config); // this is the get all users request
    console.log(response.data);
    const role = response.data.data.data.role;
    console.log(role);
    yield put({
      // dispatching the action, this is dispatched to the reducers
      type: "LOGGEDIN",
      error: false,
      token: response.data.token,
      role: role,
      status: true
    });
    yield put({
      // dispatching the action, this is dispatched to the reducers
      type: "USER_ROLE",
      role
    });
  } catch (err) {
    yield put({
      type: "LOGGEDIN",
      error: true,
      token: "",
      status: false
    });
  }
}
function* checkBusStatusForDate(action) {
  //console.log(action);
  try {
    let { start, to, date } = action.data;
    //http://localhost:3000/bookBus/findBus?startAt=Gangtok&destination=Rumtek&date=2019-12-08
    let reqUrl = `/bookBus/findBus?startAt=${start}&destination=${to}&date=${date}`;
    const response = yield axios.get(reqUrl, action.data);

    yield put({
      // dispatching the action, this is dispatched to the reducers
      type: "FETCH_BUSSES_FORDATE",
      error: false,
      data: response.data.data.booking.busses,
      startAt: start,
      destination: to,
      date
    });
    yield put({
      type: "POPUP",
      error: false,
      message: "Busses Found"
    });
  } catch (err) {
    yield put({
      type: "POPUP",
      error: true,
      message: err.response.data.message
    });
  }
}

function* bookBusSeats(action) {
  let config = getJWT();
  try {
    let response = yield axios.post("/bookBus/bookSeat", action.data, config);
    console.log(response);

    yield put({
      type: "BOOK_BUS_SEATS",
      data: response.data.data,
      status: "Success"
    });
    yield put({
      type: "POPUP",
      error: false,
      message: "Seats Booked . Please Check Bokkings For more Info"
    });
    //  redirect ot another page if successfully booked
    history.push("/succesFullyBooked");
  } catch (err) {
    yield put({
      type: "POPUP",
      error: true,
      message: err.response.data.message
    });
  }
}

/* 
  fetch user info
*/
function* fetchUserInfo() {
  try {
    ///user/getMe
    let config = getJWT();
    let response = yield axios.get("/user/getMe", config);
    console.log(response.data.data.user);
    yield put({
      type: "FETCH_USER_INFO",
      data: response.data.data.user,
      status: "Success"
    });
  } catch (err) {
    yield put({
      type: "POPUP",
      error: true,
      message: err.response.data.message
    });
  }
}

/* 
    send seat cancellation request

*/
function* sendBusCancelReq(action) {
  try {
    let config = getJWT();
    console.log(action.data);
    let response = yield axios.post("/bookBus/cancelSeat", action.data, config);
    console.log(response.data);
    yield put({
      type: "POPUP",
      error: false,
      message: "Seats Cancelled Successfully"
    });
    history.push("/");
  } catch (err) {
    console.log(err.response);
    yield put({
      type: "POPUP",
      error: true,
      message: err.response.data.message
    });
  }
}

// get geocode
function* getGeocode(action) {
  const location = action.data;
  const source = action.source;
  try {
    const response = yield instanceGeocode.get(
      `/json?q=${location}&key=${API_GEOCODE}&language=en&pretty=1&country=IN`
    ); // this is the get all users request
    // console.log(response.data.results[0].geometry);
    yield put({
      type: "GEOCODE",
      source,
      coordinates: response.data.results[0].geometry
    });
  } catch (err) {}
}

// watch for the action types
function* watchSaga() {
  yield takeEvery("VERIFY_TOKEN", verifyToken);
  yield takeEvery("LOG_IN", login); //LOG_OUT
  yield takeEvery("LOG_OUT", logout);
  yield takeEvery("REGISTER", register);
  yield takeEvery("CHECK_LOGIN_STATUS", verifyLoginStatus);
  yield takeEvery("GET_USER_INFO", getUserInfo);
  yield takeEvery("GET_ALL_BUS", getAllBusInfo);
  yield takeEvery("CHECK_BUS_JOURNEY_STATUS", checkBusStatusForDate);
  yield takeEvery("BOOK_SEATS", bookBusSeats);
  yield takeEvery("GET_USER_INFO_BOOKING", fetchUserInfo);
  yield takeEvery("CANCEL_BOOKED_SEATS", sendBusCancelReq);
  yield takeEvery("GET_ALL_BUSSES_IN_REPO", getRepoBusses);
  yield takeEvery("ADD_NEW_BUS_TO_COLLECTION", addNewBus);
  yield takeEvery("EDIT_BUS_IN_COLLECTION", editBus);
  yield takeEvery("BUS_FOR_ADMIN", getBusInfoAdmin); //GET_GEOCODE
  yield takeEvery("GET_GEOCODE", getGeocode);
}

// only export the root sage
export default function* rootSaga() {
  yield all([watchSaga()]);
}
