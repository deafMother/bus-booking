const express = require("express");
const busContoller = require("../controller/busController");
const userController = require("../controller/userController");
const bookingController = require("../controller/bookingController");
const router = express.Router();

// all routes besieds getting all bus status for a date has to be protected: authentication etc has to be implemented
router.route("/findBus").get(bookingController.getBusStatusForDate);
router
  .route("/bookSeat")
  .post(userController.protect, bookingController.bookBusByNumber);
router
  .route("/cancelSeat")
  .post(userController.protect, bookingController.cancelBooking);

// this route should be available only to the admin: pending
router.route("/busDetails").get(bookingController.getAllBusDetailsForDate);

module.exports = router;
