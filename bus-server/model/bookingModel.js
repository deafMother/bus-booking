//
//
// the booking model will have all the booking details for all the busess for each day
// each document will have an entry for each day...which will further contain all the bookings
//
//
//
//
const mongoose = require("mongoose");
const busBookingSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, "Bus number required"]
  },
  totalSeats: {
    type: Number,
    required: [true, "Please provide total seats"]
  },
  totalSeatsAvailable: {
    type: Number
  },
  bookedSeats: {
    type: [Number],
    default: []
  },
  availableSeats: {
    type: [Number]
  },
  startTime: {
    type: Date
  },
  bookings: [
    {
      bookingNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AllBookings" // this refers to the AllBookings collection
      }
    }
  ]
});

const bookingSchema = new mongoose.Schema({
  date: {
    type: Date
  },
  startAt: {
    type: String,
    required: [true, "A route must contain a starting location"]
  },
  destination: {
    type: String,
    required: [true, "A route must contain a destination"]
  },
  busses: {
    type: [busBookingSchema]
  }
});

// document middleware
busBookingSchema.pre("save", function(next) {
  console.log("pre save running");
  this.totalSeatsAvailable = this.totalSeats - this.bookedSeats.length;
  let a = [...Array(this.totalSeats + 1).keys()];
  let b = [...this.bookedSeats];
  let c = a.filter(value => {
    return !b.includes(value);
  });
  c.shift();
  this.availableSeats = c;
  next();
});

// an instance methods, this method is called to update the bus booking status
busBookingSchema.methods.updateSeats = function(seats, bookingId) {
  let available = true;
  // 1) check if the seats requested are  valid
  if (this.totalSeatsAvailable < seats.length) {
    available = false;
  }
  seats.forEach(seat => {
    if (this.bookedSeats.includes(seat)) {
      console.log(seat + "unavailable");
      available = false;
    }
  }); // incomplete
  if (!available) {
    return available;
  }

  // 2) add the seats to the booked seats array
  this.bookedSeats = [...this.bookedSeats, ...seats];
  // 3) further calculations on seats will be done by the document middleware before saving
  this.totalSeatsAvailable = this.totalSeats - this.bookedSeats.length;
  let a = [...Array(this.totalSeats + 1).keys()];
  let b = [...this.bookedSeats];
  let c = a.filter(value => {
    return !b.includes(value);
  });
  c.shift();
  this.availableSeats = c;
  return available;
};

busBookingSchema.methods.addBookingId = async function(bookingId) {
  // the booking id has to be pushed to the bookings array
  console.log(bookingId);
  this.bookings.push({
    bookingNumber: bookingId
  });
};
//
// cancel seats
// If Possible return true and update add the seats being cancelled to the seats cancelled array in the buukings document
// Otherwise retrun false
//
busBookingSchema.methods.cancelSeat = async function(seats, cancelBooking) {
  let cancellationPossible = true;
  // check if the requested seats for cancellation request is not in the cancelled seats array for that particular booking
  seats.forEach(seat => {
    if (cancelBooking.seatsCancelled.includes(seat)) {
      cancellationPossible = false;
    }
  });
  if (!cancellationPossible || cancelBooking.cancelled) {
    return false;
  }
  //  1) check if the user has the
  if (!this.bookedSeats.length >= seats.length) {
    return false;
  }
  // 1) check if the booked seat list contains the requseted cancellation seats
  seats.forEach(seat => {
    if (!this.bookedSeats.includes(seat)) {
      cancellationPossible = false;
    }
  });

  // 2)) update the different seat position
  if (cancellationPossible) {
    this.availableSeats = [...this.availableSeats, ...seats];
    this.totalSeatsAvailable = this.availableSeats.length;

    // remove the seats from the boked seats list
    seats.forEach(seat => {
      let index = this.bookedSeats.indexOf(seat);
      if (index > -1) {
        this.bookedSeats.splice(index, 1);
      }
    });
  }
  // update the  particular booking document
  cancelBooking.seatsCancelled = [...cancelBooking.seatsCancelled, ...seats];
  cancelBooking.cancelled =
    cancelBooking.seatsCancelled.length === cancelBooking.seatsBooked.length;
  return cancellationPossible;
};

// // this function checks whether it is a valid cancel request,
// // make sure that the seats being cancelled belongs to the user who booked the seats, get the booking id and check if it is present in the particulars booking, thenupdate the bookign_id with the set(s) of cancelled seats
// busBookingSchema.methods.validCancelReq = function(bookingId, userId) {
//   let valid = bookingId.userId == userId;
//   return valid;
// };

const BusBooking = mongoose.model("booking", bookingSchema);
const AllBusses = mongoose.model("allbusses", busBookingSchema);
module.exports = BusBooking;
// better data modeling approach is needed, to keep queries to a minimum
// each there will be a seperate user collection containing registered users,
// each time user books a bus a document will be added containing the date, bus number and bus time, also  refferrences to the booking collection of the id of the booking document for the  date,
// and the id of the bus, also the list of seats booked will be saved
