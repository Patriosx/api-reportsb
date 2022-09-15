const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

module.exports.config = (app) => {
  //will help us to retrieve body parameters when handling a request.
  //   app.use(express.json());
  app.use(bodyParser.json());
  app.use(cookieParser());
};
