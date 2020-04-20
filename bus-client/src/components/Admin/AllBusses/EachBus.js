import React from "react";
import momment from "moment";
import history from '../../../history'

function EachBus(props) {
  let { bus } = props;
  return (
    <div className="booking-overview" onClick={()=>{history.push(`/editBus/${bus.number}`)}}>
      <p>
        <strong>Number : </strong>
        {bus.number}
      </p>
      <p>
        <strong>From : </strong>
        {bus.startAt}
      </p>
      <p>
        <strong>Destination : </strong>
        {bus.destination}
      </p>
      <p>
        <strong>Number of Seats : </strong>
        {bus.noOfSeats}
      </p>
      <p>
        <strong>
          {bus.active ? <span>Active</span> : <span>Non-Active</span>}
        </strong>
      </p>
      <p>
        <strong>Departure Time : </strong>
        {momment(bus.startTime).format("LT")}
      </p>
    </div>
  );
}

export default EachBus;
