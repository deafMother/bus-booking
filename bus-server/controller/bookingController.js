const Bus = require("../model/busModel");
const BusBooking = require("../model/bookingModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const AllBookings = require("../model/allBookingsModel");
const User = require("../model/userModel");

// function to compare the cancel time and the bus time
let compareTimes = (cancelReqTime, busTime) => {
  // console.log(new Date(cancelReqTime).toString());
  // console.log(busTime.toString());
  let diffInHours = (busTime - cancelReqTime) / 36e5; // gives the hour difference bet the two timestamps
  return diffInHours.toFixed(2) >= 2;
};

// function to add busses to bus book list
let checkBusSchedule = async (req, res, next) => {
  const { startAt, destination, date } = req.query;
  // 1)) find busses between routes
  const buses = await Bus.find({
    startAt,
    destination,
    active: true
  });

  // 2) if busses exists then check the booking status for the particular date
  if (buses.length > 0) {
    let busBooking = await BusBooking.findOne({
      date,
      startAt,
      destination
    });

    // 3) if booinkg does not exists then add all the active busses into that booking list for that date

    if (!busBooking) {
      const booking = new BusBooking({ date, startAt, destination });
      buses.forEach(bus => {
        let startTime = [bus.startTime.getHours(), bus.startTime.getMinutes()];
        let newBusTime = new Date(date).setHours(
          startTime[0],
          startTime[1],
          0,
          0
        );
        booking.busses.push({
          number: bus.number,
          totalSeats: bus.noOfSeats,
          startTime: newBusTime
        });
      });
      busBooking = await booking.save();
    }
    req.busBooking = busBooking;
    return true;
  } else {
    return false;
  }
};

// function to book a seat for a bus
let upddateBusSeat = async (req, res, next) => {};

// add newly added bus  to the booking  list for current date plus two
exports.addNewBus = async bus => {
  let { startAt, destination } = bus;
  //add for the current date, and the next two dates
  let timestampToday = new Date(new Date().setHours(0, 0, 0, 0)); // current date
  let todayDateString = new Date().toISOString().split("T")[0];
  let timestampFutureOne = new Date().setDate(timestampToday.getDate() + 1); // One days into future
  let tomorowsDate = new Date(timestampFutureOne).toISOString().split("T")[0];
  let timestampFutureTwo = new Date().setDate(timestampToday.getDate() + 2); // Two days into future
  let dayAfterTmrw = new Date(timestampFutureTwo).toISOString().split("T")[0];
  let dates = [todayDateString, tomorowsDate, dayAfterTmrw];
  // now for each date if the booking list exists then add it to the list

  dates.forEach(async date => {
    console.log(date);
    let busBooking = await BusBooking.findOne({
      date,
      startAt,
      destination
    });
    if (busBooking) {
      let startTime = [bus.startTime.getHours(), bus.startTime.getMinutes()];
      let newBusTime = new Date(date).setHours(
        startTime[0],
        startTime[1],
        0,
        0
      );
      // we are pushing into an array inside a document, note: if we apply update then the pre save middleware on the nested documnet will not execute
      busBooking.busses.push({
        number: bus.number,
        totalSeats: bus.noOfSeats,
        startTime: newBusTime
      });
      await busBooking.save();
    }
  });
};

exports.getBusStatusForDate = catchAsync(async (req, res, next) => {
  // make sure that the date provided is between current and < current + 2
  const { date } = req.query;
  let timestampFuture =
    new Date().setHours(0, 0, 0, 0) + 3 * 24 * 60 * 60 * 1000; // two days into future
  let timestampPast = new Date().setHours(0, 0, 0, 0); // todays date
  let userDate = new Date(date).getTime();
  if (userDate < timestampPast || userDate > timestampFuture) {
    return next(
      new AppError("Please make sure the date entered in valid", 404)
    );
  }

  if (await checkBusSchedule(req, res, next)) {
    // display the bus list for that date
    res.status(200).json({
      status: "Success",
      data: {
        booking: req.busBooking
      }
    });
  } else {
    return next(new AppError("No route fund for the bus", 404));
  }
});

exports.bookBusByNumber = catchAsync(async (req, res, next) => {
  const { date, number, seats, startAt, destination } = req.body;
  req.query = req.body;
  if (!date) {
    return next(new AppError("Please enter a valid date", 404));
  }
  let timestampToday = new Date().setHours(0, 0, 0, 0); // todays date
  let userDate = new Date(date).getTime(); // gives the timestamp
  if (userDate < timestampToday) {
    return next(
      new AppError("Please make sure the date entered is valid", 404)
    );
  }

  // 1) search for buses between particular source and destination
  // 2) if busses exists then check the booking status for the particular date
  if (checkBusSchedule(req, res, next)) {
    let myBus = await BusBooking.findOne(
      {
        date,
        startAt,
        destination,
        "busses.number": number
      },
      { "busses.$": 1 } // this will make sure that  only one matched child
    );
    if (!myBus) {
      return next(new AppError("Bus not available", 404));
    }

    //
    //this is a method defined on the each document
    //check to make sure that only buses whoes departure time is greater then the booking request time by 2 hours is booked
    //

    let reqTime = new Date();
    let busTime = myBus.busses[0].startTime;
    if (!compareTimes(reqTime, busTime)) {
      return next(
        new AppError(
          "Invalid Time: Cannot Book backdates or book date within two hours of departure date",
          404
        )
      );
    }

    if (myBus.busses[0].updateSeats(seats)) {
      // if available true is returned then persist to database
      // 1) add this booking to the all-bookings colledtion
      // 2) add  above booking referecnce to the user's database

      // 1)
      const allBookings = await AllBookings.create({
        userId: req.user.id,
        seatsBooked: seats,
        userName: req.user.name,
        busNo: number,
        busTime: myBus.busses[0].startTime,
        startAt,
        destination
      });
      //this function is doing the above task, there is synchronization issues with this function so dont use it
      // let newPost  = addToBookings(req, seats, number, myBus.busses[0]);
      // await func();

      // 2)
      await User.findByIdAndUpdate(req.user.id, {
        $push: { myBookings: { bookingNumer: allBookings._id } }
      });

      // 3) add the booking id into the bus booking status
      await myBus.busses[0].addBookingId(allBookings._id);

      // await myBus.busses[0].findByIdAndUpdate(req.user.id, {
      //   $push: { myBookings: { bookingNumer: allBookings._id } }
      // });

      // uodate the bus booking status
      await BusBooking.findOneAndUpdate(
        {
          date,
          "busses.number": number
        },
        {
          $set: { "busses.$": myBus.busses[0] }
        }
      );
    } else {
      return next(new AppError("Seat not available", 404));
    }
    // after the seats have been booked a booking id has to be generated and associated with the user and be reflected both in the bus booked for that day as well as in the users document
    res.status(200).json({
      status: "success",
      data: {
        bus: myBus.busses[0],
        myBus: "seats booked"
      }
    });
  } else {
    return next(new AppError("No bus found for this route", 404));
  }
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const { date, number, seats, bookingId } = req.body;
  /*  
    match the booking date : cannot be back date: done
                           : bus departure time also cannot be within 2 hours of  current time: pending
                           : seats should be valid: done
                           : verify valid user is sending the cancel request(as booiking id contains the id of the user who booked the seats so this should be easy): done
                           
  
  */
  // make sure that the date provided is between current and bus departure time  2hours
  // let timestampFuture =
  //   new Date().setHours(0, 0, 0, 0) + 3 * 24 * 60 * 60 * 1000; // two days into future
  if (!date) {
    return next(new AppError("Please enter a valid date", 404));
  }
  let timestampToday = new Date().setHours(0, 0, 0, 0); // todays date: the hours are set to 0
  let userDate = new Date(date).getTime(); // gives the timestamp
  if (userDate < timestampToday) {
    return next(
      new AppError("Please make sure the date entered is valid", 404)
    );
  }

  // 1) find the particular bus to be cancelled
  let myBus = await BusBooking.findOne(
    {
      date,
      "busses.number": number
    },
    { "busses.$": 1 } // this will make sure that  only one matched child is returned
  );
  if (!myBus) {
    return next(new AppError("Bus not available", 404));
  }

  // 1) check if this particular booking id exists in the bookings database or not check verify the user for this booking
  const cancelReq = await AllBookings.findOne({
    _id: bookingId,
    userId: req.user.id
  });
  if (!cancelReq) {
    // if invalid cancel request
    return next(new AppError("invalid request", 400));
  }
  // 2) compare the cancel time with the bus time
  let cancelReqTime = new Date();
  let busTime = cancelReq.busTime;
  if (!compareTimes(cancelReqTime, busTime)) {
    return next(
      new AppError(
        "Invalid Time: Cannot cancel backdates or cancel date within two hours of departure date",
        404
      )
    );
  }
  // 3) process cancel request
  if (await myBus.busses[0].cancelSeat(seats, cancelReq)) {
    //  if available true is returned then persist to database
    //
    // 1)) update the bus status
    await BusBooking.findOneAndUpdate(
      {
        date,
        "busses.number": number
      },
      {
        $set: { "busses.$": myBus.busses[0] }
      }
    );

    // 2)) update the booking document status
    await AllBookings.findOneAndUpdate(
      {
        _id: bookingId,
        userId: req.user.id
      },
      {
        $set: {
          seatsCancelled: cancelReq.seatsCancelled,
          cancelled: cancelReq.cancelled
        }
      }
    );
  } else {
    return next(new AppError("Seat not available", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      bus: myBus.busses[0],
      myBus: "seats cancelled"
    }
  });
});

/* 
    fetch bus info for any date: if it is there by the admin to check the busse for that date between start and destination
*/
// this route is for the admin
exports.getAllBusDetailsForDate = catchAsync(async (req, res, next) => {
  let { date, startAt, destination } = req.query;
  let busBooking = await BusBooking.findOne({
    date,
    startAt,
    destination
  }).populate("bookings.bookingNumber");

  if (busBooking) {
    res.status(200).json({
      status: "success",
      data: {
        bus: busBooking
      }
    });
  } else {
    return next(new AppError("No bus for this date or route found", 404));
  }
});

/* 
    When a customer books seat(s), a booking document will be created in the a filed called myBookings:[{},{}] 
    and a filed will be created in that bus document for that day named bookedBy = [id of the user and the particular booking id]
*/

/* 
          UPDATING the user document with the booked id, **DONE**
           CANCELLING make sure that it is the user who has booked the seats is the one who is cancelling the seats, **DONE**
           Updating the bus for that day document with the new booked document id, **DONE**
*/
