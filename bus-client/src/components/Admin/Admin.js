import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./admin.css";
import history from "../../history";

function Admin(props) {
  //   uncomment this.
  // if (!props.loggedIn || props.role === "user") {
  //     return <h4>Restricted To User</h4>;
  //   }

  let handleClicks = to => {
    history.push(to);
  };

  return (
    <div>
      <h4>Admin</h4>
      <div className="admin-menu">
        <div
          className="button admin-menu-btn"
          onClick={() => handleClicks("/allBusses")}
        >
          ALL BUSSES
        </div>
        <div
          className="button admin-menu-btn"
          onClick={() => handleClicks("/addNewBus")}
        >
          ADD NEW BUS
        </div>
        <div
          className="button admin-menu-btn"
          onClick={() => handleClicks("/getBusDetailsDate")}
        >
          BUS
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    role: state.role
  };
};

export default connect(mapStateToProps)(Admin);
