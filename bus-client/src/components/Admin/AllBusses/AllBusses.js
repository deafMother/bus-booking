import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getAllBusses } from "../../../action";
import EachBus from "./EachBus";
/* 
    Route protection: pending
*/
function AllBusses(props) {
  useEffect(() => {
    props.getAllBusses();
  }, []);
  if (props.busses.length > 0) {
    return (
      <div>
        <div style={{ marginBottom: "1rem" }}>All Busses</div>
        <div>
          {props.busses.map(bus => {
            return <EachBus key={bus._id} bus={bus} />;
          })}
        </div>
      </div>
    );
  } else {
    return <h6>Loading Bus Info ...</h6>;
  }
}

const mapStateToProps = state => {
  return {
    busses: state.busses,
    role: state.role,
    loggedIn: state.loggedIn
  };
};

export default connect(mapStateToProps, { getAllBusses })(AllBusses);
