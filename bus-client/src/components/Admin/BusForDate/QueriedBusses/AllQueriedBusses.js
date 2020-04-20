import React, { useEffect } from "react";
import { connect } from "react-redux";
import EachQueriedBus from "./EachQueriedBus";

/* 
    Route protection: pending
*/
function AllQueriedBusses(props) {
  if (props.bussesInfo.length > 0) {
    return (
      <div>
        <div style={{ marginBottom: "1rem" }}>
          All Busses for <strong>{props.queryInfo.date}</strong> between{" "}
          <strong>{props.queryInfo.start}</strong> to{" "}
          <strong>{props.queryInfo.to}</strong>
        </div>
        <div>
          {props.bussesInfo.map(bus => {
            return <EachQueriedBus key={bus._id} bus={bus} />;
          })}
        </div>
      </div>
    );
  } else {
    return <h6>Loading Bus Info ...</h6>;
  }
}

const mapStateToProps = state => {
  const { queryInfo, bussesInfo } = state.allBusInfo;
  return {
    queryInfo,
    bussesInfo
  };
};

export default connect(mapStateToProps)(AllQueriedBusses);
