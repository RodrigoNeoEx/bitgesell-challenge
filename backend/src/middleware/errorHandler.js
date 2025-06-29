// src/middleware/errorHandler.js

// 404 Handler
function notFound(req, res, next) {
  const error = new Error('Route Not Found');
  res.status(404);
  next(error);
}

// Error handler Express
function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error'
  });
}

module.exports = { notFound, errorHandler, getCookie };
