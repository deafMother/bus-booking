import React, { Suspense } from "react";
import { Switch, Route, NavLink } from "react-router-dom";

import "./App.css";
import Header from "./header/Header";
import SignInSignUp from "./header/SignInSignUp";
import SearchBox from "../components/searchBox/SearchBox";
import PopUp from "./PopUp/PupUp";
import SuccesFullyBooked from "./SeatBookedSuccessfully/SuccesFullyBooked";
import UserBookings from "./UserBookings/UserBookings";
import Admin from "./Admin/Admin";
import AllBusses from "./Admin/AllBusses/AllBusses";
import AddNewBus from "./Admin/NewBus/AddNewBus";
import EditBus from "./Admin/EditBus/EditBus";
import BusForDate from "./Admin/BusForDate/BusForDate";
import MapContainer from "./MapContainer/MapContainer";

const BussesForDate = React.lazy(() => import("./BussesForDate/BussesForDate"));
const BookedBusDetail = React.lazy(() =>
  import("./BookedBusDetail/BookedBusDetail")
);
const BusDetail = React.lazy(() => import("./BusDetail/BusDetail"));
function App() {
  return (
    <div className="App">
      <h1>
        <NavLink to="/">Welcome to the bus booking</NavLink>{" "}
      </h1>
      <Header />
      <Admin />
      <div className="main__page--grid">
        <Switch>
          <Route exact path="/" component={SearchBox} />
          <Route exact path="/registerLogin" component={SignInSignUp} />
          <Route
            exact
            path="/succesFullyBooked"
            component={SuccesFullyBooked}
          />
          <Route exact path="/userBookings" component={UserBookings} />
          <Route exact path="/allBusses" component={AllBusses} />
          <Route exact path="/addNewBus" component={AddNewBus} />
          <Route exact path="/getBusDetailsDate" component={BusForDate} />
          <Route exact path="/editBus/:number" component={EditBus} />{" "}
          <Suspense fallback={<h5>fetching bus info..</h5>}>
            <Route exact path="/busStatus/:number" component={BusDetail} />
            <Route
              exact
              path="/bookedBus/:bookingId"
              component={BookedBusDetail}
            />
          </Suspense>
        </Switch>
        <Suspense fallback={<h5>fetching bus info..</h5>}>
          <Route exact path="/" component={BussesForDate} />
        </Suspense>
      </div>
      <Switch>
        <Route exact path="/" component={MapContainer} />
      </Switch>

      <PopUp />
    </div>
  );
}

export default App;

// 1) implement login and logout feature: done
