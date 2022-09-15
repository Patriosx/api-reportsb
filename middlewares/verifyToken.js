const jwt = require("jsonwebtoken");
const { createError } = require("../helpers");

const verifyTokenWCookie = (req, res, next) => {
  //check if the is a token
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "user not authenticated"));
  /*
  //check if the token sent has being signed correctly. (login)
  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    console.log("----------------------------");
    console.log("user", user);
    console.log("error", err);
    if (err) return next(createError(403, "invalid token"));
    req.user = user;
  });
  */
  //comprobar token
  if (token) {
    const user = verifyAuthToken(token);
    if (!user) return next(createError(401, "invalid token"));

    req.user = user; //luego lo recibiremos en el controlador
  }
  next();
};
//verifica el token
function verifyAuthToken(token) {
  let user = null;
  try {
    user = jwt.verify(token, process.env.SECRET_TOKEN);
  } catch (error) {
    console.log(error);
    return next(createError(401, "user not authorized"));
  }
  return user;
}

const verifyUser = (req, res, next) => {
  verifyTokenWCookie(req, res, () => {
    console.log("verifyUser", req.params.id);
    console.log("req.user", req.user);

    //check if the account is correspond with the current user
    //or the user is a policeOfficer or admin
    if (
      req.user._id === req.params.id ||
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
    console.log("verifyPolice");
    console.log("req.user", req.user);

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
    console.log("verifyAdmin");
    console.log("req.user", req.user);
    //check if the user is an administrator
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "not admin"));
    }
  });
};
module.exports = { verifyTokenWCookie, verifyUser, verifyAdmin, verifyPolice };
