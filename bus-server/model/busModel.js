const mongoose = require("mongoose");

const BusSchema = mongoose.Schema({
  number: {
    type: String,
    unique: [true, "Bus wiht the provided number already exixts"],
    required: [true, "Please Provide Bus Number"],
    trim: true
  },
  route: {
    type: [String],
    default: ["One", "Two"]
    // required: [true, "journey route must be provided"] //note: make this required
  },
  startAt: {
    type: String,
    required: [true, "Please provide a start location"],
    trim: true,
    validate: {
      validator: function(val) {
        return typeof val === "string";
      },
      message: "Invalid type: has to be string"
    }
  },
  destination: {
    type: String,
    required: [true, "Please provide a destination location"],
    trim: true
  },
  noOfSeats: {
    type: Number,
    required: [true, "Please provide the number of seats"]
  },
  startTime: {
    type: Date,
    required: [true, "Please provide Departure time "]
  },
  active: {
    type: Boolean,
    default: true
  }
});

// make a virtual time take will keep track of total journey date

const Bus = mongoose.model("buses", BusSchema);
module.exports = Bus;
