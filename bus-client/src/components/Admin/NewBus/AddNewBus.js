import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { addNewBus } from "../../../action";
import "./addNewBus.css";

/*
{
  "number":"ML-05-K-3012", 
  "startAt": "Gangtok",
  "destination": "Rumtek",
  "noOfSeats": 32,
  "route":["One","Two"], // implement this later
  "startTime":"2019-12-06T18:00:00",  
  "active":true
}
*/

class AddNewBus extends React.Component {
  state = {
    number: "",
    startAt: "",
    destination: "",
    noOfSeats: 0,
    // route: ["One", "Two"], // implement this later
    hours: 0,
    mins: 0,
    startTime: new Date(),
    active: true
  };
  onSubmit = e => {
    e.preventDefault();
    this.setState(
      (prevState, prevProps) => {
        let newTime = new Date();
        newTime.setHours(prevState.hours);
        newTime.setMinutes(prevState.mins);
        newTime.setSeconds(0);
        return {
          startTime: newTime,
          noOfSeats: prevState.noOfSeats * 1
        };
      },
      () => {
        this.props.addNewBus(this.state);
      }
    );
  };
  onChange = e => {
    let id = e.target.id;
    this.setState({ [id]: e.target.value });
    console.log(id);
  };

  handleHourChange = e => {};

  onChecked = e => {
    console.log(e.target.checked);
    this.setState({ active: !this.state.active });
  };

  renderForm() {
    return (
      <div>
        <form onSubmit={this.onSubmit} className="add-bus-form">
          <span>
            <label> Bus Number </label>
            <input
              type="text"
              placeholder="bus number"
              id="number"
              value={this.state.number}
              onChange={this.onChange}
            ></input>
          </span>
          <span>
            <label> Start At </label>
            <input
              type="text"
              placeholder="start at"
              id="startAt"
              value={this.state.startAt}
              onChange={this.onChange}
            ></input>
          </span>
          <span>
            <label> Destination </label>
            <input
              type="text"
              placeholder="destination"
              id="destination"
              value={this.state.destination}
              onChange={this.onChange}
            ></input>
          </span>
          <span>
            <label> Total Seats </label>
            <input
              type="number"
              placeholder="number of seats"
              id="noOfSeats"
              value={this.state.noOfSeats}
              onChange={this.onChange}
              min="1"
              max="100"
            ></input>
          </span>
          <span>
            <input
              type="checkbox"
              name="active"
              value={this.state.active}
              checked={this.state.active}
              id="active"
              onChange={this.onChecked}
            />
            <label> Active </label>
          </span>
          <span>
            <label> Departure Time </label>
            <input
              type="number"
              placeholder="hh"
              min="0"
              max="23"
              id="hours"
              value={this.state.hours}
              onChange={this.onChange}
            ></input>
            :
            <input
              type="number"
              placeholder="mm"
              min="0"
              max="59"
              id="mins"
              value={this.state.mins}
              onChange={this.onChange}
            ></input>
          </span>
          <button type="submit" className="button inline-block">
            {" "}
            Add Bus{" "}
          </button>
        </form>
      </div>
    );
  }

  render() {
    // protect from user as well i.e only available to admins: pending
    if (!this.props.loggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <h2>Add new Bus</h2>
        {this.renderForm()}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    role: state.role
  };
};

export default connect(mapStateToProps, { addNewBus })(AddNewBus);
