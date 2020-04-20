import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function SuccesFullyBooked() {
  useEffect(() => {}, []);
  return (
    <div>
      <Link to="/">
        SEATS SUCCESSFULLY BOOKED, PLEASE CHECK BOOKINGS FOR MORE INFO
      </Link>
    </div>
  );
}

export default SuccesFullyBooked;
