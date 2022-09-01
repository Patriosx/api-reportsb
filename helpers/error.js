const createError = (status, message, data = null) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  err.data = data;
  return err;
};
module.exports = createError;
