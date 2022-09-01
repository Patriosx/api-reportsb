const express = require("express");
const bodyParser = require("body-parser");
const db_connection = require("./db/db_connection");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const caseRoute = require("./routes/caseRoute");
const app = express();
const cookieParser = require("cookie-parser");

//* Setup middlewares*//
//will help us to retrieve body parameters when handling a request.
// app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

//* Routes *//
app.use("/account", userRoute);
app.use("/auth", authRoute);
app.use("/case", caseRoute);
app.use((req, res, next) => {
  res.status(404);
  res.json({
    message: "Route not found",
  });
});

//* Error handler
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  console.log("Error Handler");
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    data: err.data,
    message: errorMessage,
    stack: err.stack,
  });
});
//* Se usa para vincular y escuchar las conecciones en un puerto*//
//Ejecutamos nuestra aplicación en el puerto 5000.
app.listen(5000, () => {
  //* MongoDB connection *//
  db_connection();
  console.log("Listening ");
});
