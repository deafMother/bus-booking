import React from "react";
import { connect } from "react-redux";

function SelectedBus(props) {
  if (!props.selectedBus || props.busNumber !== props.selectedBus.number) {
    return <span></span>;
  }

  const {
    bookedSeats,
    availableSeats,
    bookings,
    number,
    totalSeats,
    startTime,
    totalSeatsAvailable
  } = props.selectedBus;
  return (
    <div className="each-selected-bus">
      <strong>Total Seats :{totalSeats}</strong>
      <div>
        <p>Total Seats Available : {totalSeatsAvailable} </p>
        <p>Booked Seats : </p>
        <ul>
          {bookedSeats
            .sort((a, b) => a - b)
            .map(seatNum => {
              return (
                <li style={{ marginLeft: "2rem" }} key={seatNum}>
                  {seatNum}
                </li>
              );
            })}
        </ul>{" "}
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    selectedBus: state.selectedBus
  };
};

export default connect(mapStateToProps)(SelectedBus);
