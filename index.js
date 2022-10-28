const express = require("express");
const bodyParser = require("body-parser");
// const cors = require('cors')
const { main } = require("./mongoose.js");
const routes1 = require("./Routes.js");
const routes2 = require("./account2Routes.js");
const routes3 = require("./account3Routes")
var passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
// -----------End Of Imports
 
// --------------connect to mongoDB--------------
mongoose.set("useCreateIndex", true); //for warning
main().catch((err) => console.log(err));
// ------- End MongoDB

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", routes1);
app.use("/api", routes2);
app.use("/api",routes3)
app.use(express.static('build'))

//-----------------Middleware------------------

app.use(
  session({
    secret: "cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log("server runing on port" + PORT);
});
