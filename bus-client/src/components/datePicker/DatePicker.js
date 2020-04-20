import React from "react";
import DayPicker from "react-day-picker";

import "react-day-picker/lib/style.css";

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.state = {
      selectedDay: undefined
    };
  }

  handleDayClick(day) {
    this.setState({ selectedDay: day });
    console.log(day.toISOString().split("T")[0]);
    this.props.setDate(day.toISOString().split("T")[0]);
  }

  render() {
    return (
      <div>
        <DayPicker onDayClick={this.handleDayClick} />
        {this.state.selectedDay ? (
          <p>You selected {this.state.selectedDay.toLocaleDateString()}</p>
        ) : (
          <p>Please select a day.</p>
        )}
      </div>
    );
  }
}
