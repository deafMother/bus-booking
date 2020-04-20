const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// configure the dot env
dotenv.config({ path: "./config.env" });

// database config
const DB_URL = process.env.DB_URL;
const port = process.env.PORT || 8000;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log("DB connected successfully");
    app.listen(port, () => {
      console.log("Server running on port..." + port);
    });
  })
  .catch(err => {
    console.log("Error in connection", err);
  });
