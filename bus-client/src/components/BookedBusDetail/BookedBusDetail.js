import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import moment from "moment";
import "./BookedBusDetail.css";
import { cancelSeats } from "../../action";

class BookedBusDetail extends Component {
  state = {
    bookingId: null,
    seats: [],
    startAt: null,
    destination: null,
    date: null,
    number: null
  };

  componentDidMount() {
    if (this.props.userInfo) {
      this.setState({
        bookingId: this.props.id,
        seats: [],
        startAt: this.props.userInfo.bookingNumer.startAt,
        destination: this.props.userInfo.bookingNumer.destination,
        date: this.props.userInfo.bookingNumer.busTime.split("T")[0],
        number: this.props.userInfo.bookingNumer.busNo
      });
    }
  }

  handleCancelRequest = () => {
    let action = window.confirm("Ary you sure you want to cancel seats !!");
    if (action) {
      // make network cancellation request
      console.log(this.state);
      this.props.cancelSeats(this.state);
    }
  };

  cancelSeats = e => {
    const seat = e.target.textContent * 1;
    // if the seat ifalready cancelled then do not add the the cancel seat request
    if (this.props.userInfo.bookingNumer.seatsCancelled.indexOf(seat) > -1) {
      return;
    }
    this.setState((prevState, prevProps) => {
      return {
        seats: Array.from(new Set([...prevState.seats, seat]))
      };
    });
  };

  removeSeats = e => {
    const seatChecked = e.target.textContent * 1;
    this.setState((prevState, prevProps) => {
      let newList = [...prevState.seats].filter(seat => seat !== seatChecked);
      return {
        seats: Array.from(new Set([...newList]))
      };
    });
  };

  renderDetails() {
    if (this.props.userInfo) {
      //console.log(this.props.userInfo);
      const {
        seatsBooked,
        seatsCancelled,
        bookingTime,
        busNo,
        busTime,
        startAt,
        destination,
        cancelled
      } = this.props.userInfo.bookingNumer;
      return (
        <div>
          <div className="bus__booked--deatails">
            <p>Booking Id : {this.props.id}</p>
            <p>
              Booked At: {moment(bookingTime).format("Do MMMM YYYY, h:mm:ss a")}
            </p>
            <p>Bus No : {busNo}</p>
            <p>From : {startAt}</p>
            <p>Destination : {destination}</p>
            <p>Departure Time: {moment(busTime).calendar()}</p>
            <p>
              {" "}
              Seats Booked :
              {seatsBooked.map(seat => (
                <span
                  className="seat-number"
                  key={seat}
                  onClick={this.cancelSeats}
                >
                  {seat}
                </span>
              ))}
            </p>
            <p>
              {" "}
              Canceled Seats :
              {seatsCancelled.map(seat => (
                <span className="seat-number" key={seat}>
                  {seat}
                </span>
              ))}
            </p>
            <p className="cancel-info">
              Please Click on the booked seats to cancel
            </p>
          </div>
          <div>
            <h5>Cancel Request</h5>
            {cancelled ? (
              <h4 className="cancel-info red">
                This booking has been cacelled
              </h4>
            ) : (
              <span>
                <p>
                  {" "}
                  Seats selected for cancellation :
                  {this.state.seats.map(seat => (
                    <span
                      className="seat-number"
                      key={seat}
                      onClick={this.removeSeats}
                    >
                      {seat}
                    </span>
                  ))}
                </p>
                <span>
                  {this.state.seats.length > 0 ? (
                    <div
                      className="button cancel-button"
                      onClick={this.handleCancelRequest}
                    >
                      CANCEL SEATS
                    </div>
                  ) : (
                    <span></span>
                  )}
                </span>
              </span>
            )}
          </div>
        </div>
      );
    }
  }
  render() {
    // console.log(this.props);
    if (!this.props.loggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <div className="bus__booked--deatails-ctn">
        <h2>Booking Detail</h2>
        <div>{this.renderDetails()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state, hasMyOwnProps) => {
  let id = hasMyOwnProps.match.params.bookingId;
  console.log(id);
  let userInfo;
  if (state.userInfo.myBookings) {
    userInfo = state.userInfo.myBookings.find(
      obj => obj.bookingNumer._id === id
    );
    // console.log(userInfo);
  }
  return {
    loggedIn: state.loggedIn,
    userInfo,
    id
  };
};

export default connect(mapStateToProps, { cancelSeats })(BookedBusDetail);

/* 
Pending: making the cancelation request to the server
*/
