const express = require("express");
const mongoose = require("mongoose");

const app = express();

//MongoDB Config
const dbConfig = require("./config/keys").mongoUri;

//Connect to MongoDB
mongoose
  .connect(dbConfig)
  .then(() => console.log("MongoDB Connected"))
  .catch(() => console.log("Error Connecting to MongoDB"));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.json("Hello"));

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
