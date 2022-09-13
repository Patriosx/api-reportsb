const auth = require("./auth");
const {
  verifyTokenWCookie,
  verifyUser,
  verifyAdmin,
  verifyPolice,
} = require("./verifyToken");

module.exports = {
  auth,
  verifyTokenWCookie,
  verifyUser,
  verifyAdmin,
  verifyPolice,
};
