// all busses for the date and between the given route

import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllBusInfo } from "../../../action";
import AllQueriedBusses from "./QueriedBusses/AllQueriedBusses";
import SelectedBus from "./QueriedBusses/SelectedBus";

import "./busForDate.css";

export class BusForDate extends Component {
  state = {
    start: "Gangtok",
    to: "Gangtok",
    year: 2019,
    month: 12,
    day: 10,
    date: "",
    error: false
  };
  handleChangeFrom = event => this.setState({ start: event.target.value });
  handleChangeTo = event => this.setState({ to: event.target.value });

  onChange = e => {
    let id = e.target.id;
    let val = e.target.value * 1;
    if (val > e.target.max * 1) {
      return;
    }
    if (val <= 0) {
      return;
    }
    if (val <= 9) {
      val = "0" + val;
    }
    this.setState({ [id]: val });
  };

  handleSubmit = () => {
    this.setState(
      previousState => {
        let { start, to, month, day, year } = previousState;
        return { date: "" + year + "-" + month + "-" + day, error: false };
      },
      () => {
        console.log(this.state); // if we print it outside this callback then we will recieve the previous state vale and not the updated one
        this.props.getAllBusInfo(this.state);
      }
    );
  };

  renderForm() {
    return (
      <div className="find-bus-form">
        <span>
          <span> From : </span>
          <select value={this.state.start} onChange={this.handleChangeFrom}>
            <option value="Gangtok">GANGTOK</option>
            <option value="Rumtek">RUMTEK</option>
            <option value="Namchi">NAMCHI</option>
          </select>
        </span>
        <span>
          <span> To : </span>
          <select value={this.state.to} onChange={this.handleChangeTo}>
            <option value="Gangtok">GANGTOK</option>
            <option value="Rumtek">RUMTEK</option>
            <option value="Namchi">NAMCHI</option>
          </select>
        </span>
        <span>
          <span> Year : </span>{" "}
          <input
            type="number"
            value={this.state.year}
            id="year"
            onChange={this.onChange}
            min="2000"
            max="3000"
          ></input>
        </span>
        <span>
          <span> Month : </span>{" "}
          <input
            type="number"
            value={this.state.month}
            min="1"
            max="12"
            id="month"
            onChange={this.onChange}
          ></input>
        </span>
        <span>
          <span> Day : </span>{" "}
          <input
            type="number"
            value={this.state.day}
            min="1"
            max="31"
            id="day"
            onChange={this.onChange}
          ></input>
        </span>
      </div>
    );
  }

  renderError() {
    if (this.state.error) {
      return (
        <p
          style={{
            backgroundColor: "Red",
            color: "white",
            borderRadius: "4px",
            fontSize: "10px",
            padding: "4px",
            textAlign: "center",
            marginTop: "2rem"
          }}
        >
          "Please Check All Fields"{" "}
        </p>
      );
    } else {
      return "";
    }
  }
  renderErrorInvalidSearch() {
    if (this.props.error) {
      return (
        <p
          style={{
            backgroundColor: "Red",
            color: "white",
            borderRadius: "4px",
            fontSize: "12px",
            padding: "4px",
            textAlign: "center",
            marginTop: "2rem"
          }}
        >
          "No Busses For the provided date or route. Search Again"{" "}
        </p>
      );
    } else {
      return "";
    }
  }

  renderBusInfo() {
    if (!this.props.error && this.props.bussesInfo) {
      return <AllQueriedBusses />;
    } else {
      return "";
    }
  }

  render() {
    return (
      <div>
        {this.renderForm()}
        <span className="button2" onClick={this.handleSubmit}>
          Find
        </span>
        {this.renderError()}
        {this.renderBusInfo()}
        {this.renderErrorInvalidSearch()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { error, queryInfo, bussesInfo } = state.allBusInfo;

  return { error, bussesInfo };
};

export default connect(mapStateToProps, { getAllBusInfo })(BusForDate);
