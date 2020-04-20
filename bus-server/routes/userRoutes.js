const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

// import userController

/* 
    1) Create New User/ Register
    2) Login User
    3) Update User
    4) Delete/Disable User

    // use JWT for autnentication 
    // use bcrypt fot password hashing
    // protect routes
    

*/

// use jwt authentication meddleware to extract user user info to check if they are still active in the database or not

router.route("/login").post(userController.loginIn);
router
  .route("/")
  .get(userController.protect, userController.getAllUser) // protect this route
  .post(userController.addUser);
router.route("/getMe").get(userController.protect, userController.getMe); //protect this route
router
  .route("/updateMe")
  .patch(userController.protect, userController.updateUser); //protect this route

// route to check if the user is currently logged in or not
router.route("/checkLoginStatus").get(userController.checkLoginStatus);

module.exports = router;
