const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a username"],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    //unique: true, note: this should be unique in production
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  active: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false
    //select: false //wont show up in the output even in the middlewares like login etc
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      // this only works on save ie .create and .save!! not on update query
      validator: function(value) {
        return value === this.password; // value refers to passwordConfirm
      },
      message: "Password are not the same"
    }
  },
  myBookings: {
    bookingNumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AllBookings" // this refers to the AllBookings collection
    }
  } // will have the various bookings ids
  // my booking will refer to the allBookings collection , and fetch data related to the particular user
  // make a seperate collection named allBookings and create a document for each document: should contain detail of the user who booked the particluar seats
  // all imformation reealted to date of journeya and time, user id of the user, seats booked whether cancelled or not,
});

userSchema.pre("save", async function(next) {
  console.log("pre save running");
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; //prevent the password confirm from being persisted in the database
  next();
});

userSchema.methods.checkPassword = async function(givenPassword, userPassword) {
  //console.log(this.password);
  return await bcrypt.compare(givenPassword, userPassword);
};

// userSchema.methods.pushBookingId = async function(bookingId) {
//   this.myBookings.push(bookingId);
//   return true;
// };

const User = mongoose.model("user", userSchema);
module.exports = User;

// userSchema.post("save", async function() {
//   console.log("post save running");
// });
