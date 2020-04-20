import { reducer as formReducer } from "redux-form";
import { combineReducers } from "redux";
import { loggedIn, userRole } from "./loggedInReducer";
import { bussesForDate, busRoute } from "./busStatusForDate";
import { bookBusSeats, PopUp } from "./busSeatBookingStatus";
import { fetchUserInfo } from "./fetchUserReducer";
import { allBusReducer, allBusInfoReducerAdmin } from "./allBusReducer";
import { setSelectedBusReducer } from "./setSelectedBusReducer";
import { fetchGeoCode } from "./geoCodeReducer";
const rootReducer = combineReducers({
  form: formReducer,
  loggedIn,
  role: userRole,
  bussesForDate,
  busRoute,
  bookBusSeats,
  PopUp,
  userInfo: fetchUserInfo,
  busses: allBusReducer,
  allBusInfo: allBusInfoReducerAdmin,
  selectedBus: setSelectedBusReducer,
  coordinates: fetchGeoCode
});

export default rootReducer;
