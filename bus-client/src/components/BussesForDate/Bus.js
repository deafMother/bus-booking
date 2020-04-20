import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import history from "../../history";

function Bus(props) {
  let { number, startTime, totalSeats, bookedSeats, _id } = props.bus;
  return (
    <div
      className="bus"
      onClick={() => {
        history.push(`/busStatus/${number}`);
      }}
    >
      <p>Bus Number : {number}</p>
      <p>Departure Time : {moment(startTime).calendar()}</p>
      <p
        className={`${
          totalSeats >= bookedSeats.length &&
          moment().isBefore(moment(startTime))
            ? "available"
            : "not__available"
        }`}
      >
        {totalSeats >= bookedSeats.length &&
        moment().isBefore(moment(startTime))
          ? "Available"
          : "Not Available"}
      </p>
    </div>
  );
}

export default connect(null)(Bus);
