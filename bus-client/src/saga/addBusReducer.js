import { put } from "redux-saga/effects";
import history from "../history";
import axios from "../api";
export function* addNewBus(action) {
  try {
    const response = yield axios.post("/addBus", action.data);
    yield put({
      type: "POPUP",
      error: false,
      message: "New Bus Added Succssfully"
    });
    history.push("/");
  } catch (err) {
    yield put({
      type: "POPUP",
      error: true,
      message: err.response.data.message
    });
    history.push("/");
    console.log(err.response);
  }
}

// EDIT_BUS_IN_COLLECTION
export function* editBus(action) {
  try {
    let { number } = action.data;
    console.log(number);
    const response = yield axios.patch(`/getBus/${number}`, action.data);
    yield put({
      type: "POPUP",
      error: false,
      message: "Bus Added Updated"
    });
    history.push("/");
  } catch (err) {
    yield put({
      type: "POPUP",
      error: true,
      message: err.response.data.message
    });
    history.push("/");
    console.log(err.response);
  }
}
