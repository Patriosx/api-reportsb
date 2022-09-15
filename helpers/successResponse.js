const successResponse = (res, status, message = "received", data = null) => {
  return res.status(status).send({ success: true, message, data });
};
module.exports = successResponse;
