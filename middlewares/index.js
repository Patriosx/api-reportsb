const auth = require("./auth");
const { verifyTokenWCookie, verifyUser } = require("./verifyToken");

module.exports = { auth, verifyTokenWCookie, verifyUser };
