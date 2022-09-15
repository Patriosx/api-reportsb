const express = require("express");
const mongoConnect = require("./db/dbConnection");
const { router } = require("./router");
const { config } = require("./config");
const app = express();

//* Setup middlewares*//
config(app);

//* routes *//
router(app);

//* Error handler *//
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    data: err.data,
    message: errorMessage,
    stack: err.stack,
  });
});

//* Run server *//
app.listen(process.env.PORT || 5000, () => {
  mongoConnect();
  console.log("Listening ");
});
