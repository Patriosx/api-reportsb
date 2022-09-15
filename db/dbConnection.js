require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const URI = process.env.MONGO_DB_URI;
// Conexión a la base de datos (MongoDB Atlas) y arrancar el servidor (Express)
const mongoConnect = () => {
  mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
  });
  mongoose
    .connect(URI)
    .then(() => {
      console.log("\x1b[36m%s\x1b[0m", "BD connected");
    })
    .catch((error) => console.log("connection error", error));
};
module.exports = mongoConnect;
