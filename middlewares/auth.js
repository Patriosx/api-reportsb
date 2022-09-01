const jwt = require("jsonwebtoken");
const { createError } = require("../helpers");
//Verifica el usuario y comprueba si el token que nos envia es correcto
function auth(req, res, next) {
  //token enviado por el headers
  const access_token = req.headers.access_token;
  if (!access_token) return next(createError(401, "user not authorized"));

  //comprobar token
  if (access_token) {
    const user = verifyAuthToken(access_token);
    if (!user) return next(createError(401, "user not authorized"));

    req.user = user; //luego lo recibiremos en el controlador
  }
  next(); //ejecuta el siguiente middleware, si lo hay
}
//verifica el token
function verifyAuthToken(token) {
  let user = null;
  try {
    user = jwt.verify(token, process.env.SECRET_TOKEN);
  } catch (error) {
    console.log(error);
  }
  return user;
}
module.exports = auth;
