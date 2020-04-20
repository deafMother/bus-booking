const express = require("express");
const busContoller = require("../controller/busController");

const router = express.Router();

router.route("/addBus").post(busContoller.addBus);
router.route("/getBus").get(busContoller.findAllBus);
router
  .route("/getBus/:number")
  .get(busContoller.findBus)
  .patch(busContoller.updateBus);
router.route("/getBusStat").get(busContoller.busStats);
module.exports = router;
