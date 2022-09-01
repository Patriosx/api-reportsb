const jwt = require("jsonwebtoken");
const { createError } = require("../helpers");

const verifyTokenWCookie = (req, res, next) => {
  //si hay token es porque ha iniciado sesion correctamente
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "user not authenticated"));

  //comprueba si el token enviado lleva la firma secreta. Si se ha autenticado(login) primero
  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) return next(createError(403, "invalid token"));
    req.user = user;
    next();
  });
};
const verifyUser = (req, res, next) => {
  verifyTokenWCookie(req, res, next, () => {
    console.log(req.params.id);
    console.log("req.user", req.user);

    //comprueba que sea tu cuenta o que sea admin
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next(); //avanza al siguiente middleware
    } else {
      return next(createError(403, "user not authorized"));
    }
  });
};
module.exports = { verifyTokenWCookie, verifyUser };
// module.exports = verifyUser;
