/* 
    this component will fetch all the user boookings if any and display them

*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getUserInfo } from "../../action";
import BookingOverview from "./BookingOverview";
import "./bookings.css";

export class UserBookings extends Component {
  componentDidMount() {
    if (this.props.loggedIn) {
      this.props.getUserInfo();
    }
  }
  renderBookings() {
    if (this.props.userInfo.myBookings) {
      return (
        <div>
          {this.props.userInfo.myBookings.reverse().map(booking => {
            return (
              <BookingOverview
                key={booking.bookingNumer._id}
                bookingDeatil={booking}
              />
            );
          })}
        </div>
      );
    } else {
      return <div className="booking-overview">No Bookings</div>;
    }
  }
  render() {
    if (!this.props.loggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <h4 style={{ marginBottom: "1rem" }}>MY BOOKINGS</h4>
        {this.renderBookings()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    userInfo: state.userInfo
  };
};

export default connect(mapStateToProps, { getUserInfo })(UserBookings);
