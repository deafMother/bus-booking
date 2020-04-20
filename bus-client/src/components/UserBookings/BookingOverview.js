import React from "react";
import moment from "moment";
import history from "../../history";

function BookingOverview(props) {
  let { bookingNumer } = props.bookingDeatil;
  return (
    <div
      className="booking-overview"
      onClick={() => history.push(`/bookedBus/${bookingNumer._id}`)}
    >
      <p>Booking Number: {bookingNumer._id}</p>
      <p>
        Booked On:{" "}
        {moment(bookingNumer.bookingTime).format("Do MMMM YYYY, h:mm:ss a")}
      </p>

      <p>Bus Number:{bookingNumer.busNo}</p>
      <p>Departure Time: {moment(bookingNumer.busTime).calendar()}</p>
    </div>
  );
}

export default BookingOverview;
