import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { bookSeats } from "../../action";
import moment from "moment";
import "./bus-detail.css";

class BusDetail extends Component {
  state = {
    seatsSelected: [],
    startAt: null,
    destination: null
  };
  updateSeats = e => {
    // let seatsSelected = [...this.state.seatsSelected];
    // seatsSelected.push(e.target.textContent * 1);
    const seat = e.target.textContent * 1;
    this.setState((prevState, prevProps) => {
      return {
        seatsSelected: Array.from(new Set([...prevState.seatsSelected, seat]))
      };
    });
  };
  removeSeat = e => {
    const seatChecked = e.target.textContent * 1;
    this.setState((prevState, prevProps) => {
      let newList = [...prevState.seatsSelected].filter(
        seat => seat !== seatChecked
      );
      return {
        seatsSelected: Array.from(new Set([...newList]))
      };
    });
  };

  handleBooking = (number, startTime) => {
    if (this.state.seatsSelected.length <= 0) {
      alert("Please select seats for booking");
      return;
    } else {
      let form = {
        startAt: this.props.busRoute.startAt,
        destination: this.props.busRoute.destination,
        seats: this.state.seatsSelected,
        number,
        date: startTime.split("T")[0]
      };
      console.log(form);
      this.props.bookSeats(form);
    }
  };

  renderBusDeatil() {
    const { number, availableSeats, startTime } = this.props.busDetail;
    if (!this.props.loggedIn) {
      return <h4>Please Login To Book Seats</h4>;
    }
    if (moment().isAfter(moment(startTime))) {
      return <h4>Bus Has Already departed !!</h4>;
    }
    return (
      <div>
        <h3>Number: {number}</h3>
        <h5>Departure: {moment(startTime).calendar()}</h5>
        <div>
          <p>From : {this.props.busRoute.startAt}</p>
          <p>To : {this.props.busRoute.destination}</p>
        </div>
        <h5>Available Seats</h5>
        <div className="seats-ctn">
          {availableSeats.map(seat => {
            return (
              <span
                className="seat-number"
                key={seat}
                onClick={this.updateSeats}
              >
                {seat}
              </span>
            );
          })}
        </div>
        <br></br>
        <br></br>
        <h5>Seats Selected</h5>
        <div>
          {this.state.seatsSelected.map(seat => (
            <span className="seat-number" key={seat} onClick={this.removeSeat}>
              {seat}
            </span>
          ))}
        </div>
        <div
          className="button main-button"
          onClick={() => this.handleBooking(number, startTime)}
        >
          Book
        </div>
      </div>
    );
  }
  render() {
    if (!this.props.busDetail) {
      return <Redirect to="/" />;
    }
    return <div>{this.renderBusDeatil()}</div>;
  }
}

const mapStateToProps = (state, hasOwnProps) => {
  const number = hasOwnProps.match.params.number;
  if (state.bussesForDate.length <= 0)
    return {
      busDetail: null
    };

  let busDetail = state.bussesForDate.find(bus => bus.number === number);
  return {
    busDetail,
    loggedIn: state.loggedIn,
    busRoute: state.busRoute
  };
};
export default connect(mapStateToProps, { bookSeats })(BusDetail);

// the props ie the bus number is passed from the bus component
// we can refetech the bus status from the database but in this case we are not doing that
// the bus detail is being fetched from the state
// peding : calling the action dispatcher with the booking values
