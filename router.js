const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const caseRoute = require("./routes/caseRoute");
const policeRoute = require("./routes/policeRoute");
const departmentRoute = require("./routes/departmentRoute");

module.exports.router = (app) => {
  app.use("/account", userRoute);
  app.use("/auth", authRoute);
  app.use("/case", caseRoute);
  app.use("/police", policeRoute);
  app.use("/department", departmentRoute);
  app.use((req, res, next) => {
    res.status(404);
    res.json({
      message: "Route not found",
    });
  });
};
