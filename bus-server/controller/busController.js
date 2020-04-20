const Bus = require("../model/busModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { addNewBus } = require("../controller/bookingController");

// add a bus to the 'bus' collection
// pending: When a new bus is added to the bus 'collection' and if it is active then it should be updated to be included in the bus list for a particular date if it matches the criteria
// restrict this route to only administrators: Pending

//
//
//  protect this route to only admins: pending
exports.addBus = catchAsync(async (req, res, next) => {
  const doc = await Bus.create(req.body);
  await addNewBus(doc);
  res.status(200).json({
    status: "success",
    data: {
      doc
    }
  });
});

// find a bus
exports.findBus = catchAsync(async (req, res, next) => {
  // MAKE A REG EX TO MATCH BUS NUMBER PATTERN
  const doc = await Bus.findOne({ number: req.params.number });
  if (!doc) {
    return next(
      new AppError(`No bus found with number ${req.params.number}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      doc
    }
  });
});
//
//
//
// find all bus:
// filters:
// 1) Date max range 2 days from current, date is required
// 2) time user entered time onwards, time is required
// 3) if neither then display all busses for the next two dayss
//
//
//
exports.findAllBus = catchAsync(async (req, res, next) => {
  const docs = await Bus.find({});
  res.status(200).json({
    status: "success",
    length: docs.length,
    data: {
      doc: docs
    }
  });
});

// update a Bus
//  protect this route to only admins: pending
exports.updateBus = catchAsync(async (req, res, next) => {
  // MAKE A REG EX TO MATCH BUS NUMBER PATTERN: Not required
  const doc = await Bus.findOneAndUpdate(
    { number: req.params.number },
    req.body,
    {
      new: true, // this means return the new updated document
      runValidators: true // re-run the validation on new updated documents
    }
  );
  if (!doc) {
    return next(
      new AppError(`No bus found with number ${req.params.number}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      doc
    }
  });
});

// aggregation pipeline
//  protect this route to only admins
exports.busStats = catchAsync(async (req, res, next) => {
  const stats = await Bus.aggregate([
    {
      $group: {
        _id: "$startAt", // group by any filed, if null then it will make only one group
        numBusses: { $sum: 1 } // each time the document passes through the pipe the sum is increaded by 1
      }
    }
  ]);
  res.status(200).json({
    result: "success",
    data: {
      stats
    }
  });
});
