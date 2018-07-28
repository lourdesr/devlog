const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//MongoDB Config
const dbConfig = require("./config/keys").mongoUri;

//Connect to MongoDB
mongoose
  .connect(dbConfig)
  .then(() => console.log("MongoDB Connected"))
  .catch(() => console.log("Error Connecting to MongoDB"));

//Passport Middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);
//Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
