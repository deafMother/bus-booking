const mongoose = require("mongoose");
const CatchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const AllBookings = require("../model/allBookingsModel");

let addToBookings = (req, seats, number, myBus) =>
  CatchAsync(async () => {
    const allBookings = await AllBookings.create({
      userId: req.user.id,
      seatsBooked: seats,
      busNo: number,
      busTime: myBus.startTime
    });
    console.log(allBookings);
  });

module.exports = addToBookings;
