import { put, takeEvery, all } from "redux-saga/effects";
import axios from "../api";
export function* getRepoBusses() {
  try {
    const response = yield axios.get("/getBus");
    console.log(response.data.data.doc);
    yield put({
      type: "ALL_BUSSES_IN_REPO",
      data: response.data.data.doc
    });
  } catch (err) {
    console(err.response);
  }
}

// get all busses info for any date and route
export function* getBusInfoAdmin(action) {
  let { start, to, date } = action.data;
  let reqUrl = `/bookBus/busDetails?startAt=${start}&destination=${to}&date=${date}`;
  try {
    const response = yield axios.get(reqUrl);
    let queryInfo = { start, to, date };
    let bussesInfo = response.data.data.bus.busses;
    yield put({
      type: "ALL_BUSSES_INFO_ADMIN",
      data: { queryInfo, bussesInfo, error: false }
    });
  } catch (err) {
    yield put({
      type: "ALL_BUSSES_INFO_ADMIN",
      data: { error: true }
    });
    // yield put({
    //   type: "POPUP",
    //   error: true,
    //   message: err.response.data.message
    // });
  }
}
