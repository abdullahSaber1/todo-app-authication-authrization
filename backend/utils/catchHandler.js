const catchHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error); //redirect toGlobal Error Middleware in server
  }
};

module.exports = catchHandler;
