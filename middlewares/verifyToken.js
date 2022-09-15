const jwt = require("jsonwebtoken");
const { createError } = require("../helpers");

const verifyTokenWCookie = (req, res, next) => {
  //check if there is a token
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "user not authenticated"));

  //check if the token sent has being signed correctly. (login)
  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) return next(createError(403, "invalid token"));
    req.user = user;
    next();
  });
};

const verifyUser = (req, res, next) => {
  verifyTokenWCookie(req, res, () => {
    console.log("verifyUser", req.params.id, req.user);
    //check if the account is correspond with the current user(req.user => token)
    //or the user is a policeOfficer or admin
    if (
      req.user.id === req.params.id ||
      req.user.isAdmin ||
      "department" in req.user
    ) {
      next(); //go to next middleware
    } else {
      return next(createError(403, "user not authorized"));
    }
  });
};
const verifyPolice = (req, res, next) => {
  verifyTokenWCookie(req, res, () => {
    console.log("verifyPolice", req.user);

    //check if contain the key/prop department
    if ("department" in req.user) {
      next(); //go to next middleware
    } else {
      return next(createError(403, "not Police"));
    }
  });
};
const verifyAdmin = (req, res, next) => {
  verifyTokenWCookie(req, res, () => {
    console.log("verifyAdmin", req.user);
    //check if the user is an administrator
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "not admin"));
    }
  });
};
module.exports = { verifyTokenWCookie, verifyUser, verifyAdmin, verifyPolice };
