import React from "react";
import momment from "moment";
import { connect } from "react-redux";

import { setSelectedBus } from "../../../../action";
import SelectedBus from "./SelectedBus";

function EachBus(props) {
  let { bus } = props;
  console.log(bus);

  return (
    <div
      className="booking-overview"
      onClick={() => {
        props.setSelectedBus(bus);
      }}
    >
      <p>
        <strong>Number : </strong>
        {bus.number}
      </p>
      <p>
        <strong>Number of Seats : </strong>
        {bus.totalSeats}
      </p>
      <p>
        <strong>Available Seats : </strong>
        {bus.totalSeatsAvailable}
      </p>
      <p>
        <strong>Departure Time : </strong>
        {momment(bus.startTime).format("LT")}
      </p>
      <SelectedBus busNumber={bus.number} />
    </div>
  );
}

export default connect(null, { setSelectedBus })(EachBus);
