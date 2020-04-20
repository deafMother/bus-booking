import React, { Component } from "react";
import { connect } from "react-redux";
import "./bus.css";
import Bus from "./Bus";
import { checkBusJouurneySatus } from "../../action";

export class BussesForDate extends Component {
  componentDidMount() {
    if (this.props.busRoute.date) {
      console.log("reload bus data");
      this.props.checkBusJouurneySatus({
        start: this.props.busRoute.startAt,
        to: this.props.busRoute.destination,
        date: this.props.busRoute.date
      });
    }
  }
  render() {
    if (this.props.bussesForDate.length === 0) {
      return <h5>Search For Your Ride...</h5>;
    }
    return (
      <div className="max-500">
        <h5>Availbale Busses</h5>
        <div>
          {this.props.bussesForDate.map(bus => {
            return <Bus key={bus._id} bus={bus} />;
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  //console.log(state.bussesForDate);
  return {
    bussesForDate: state.bussesForDate,
    busRoute: state.busRoute
  };
};
export default connect(mapStateToProps, { checkBusJouurneySatus })(
  BussesForDate
);
