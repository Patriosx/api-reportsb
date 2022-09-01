const express = require("express");
const bodyParser = require("body-parser");
const db_connection = require("./db/db_connection");

const app = express();
const cookieParser = require("cookie-parser");

//* Setup middlewares*//
//will help us to retrieve body parameters when handling a request.
app.use(bodyParser.json());
app.use(cookieParser());

//* Routes *//
app.use((req, res, next) => {
  res.status(404);
  res.json({
    message: "Route not found",
  });
});

//* Se usa para vincular y escuchar las conecciones en un puerto*//
app.listen(5000, () => {
  //* MongoDB connection *//
  db_connection();
  console.log("Listening ");
});
