const errorHandler = (error, request, response, next) => {
  const statusCode = error.statusCode || error.status || 500;

  response.status(statusCode).json({
    success: false,
    message:
      statusCode === 503
        ? "Database unavailable"
        : statusCode >= 500
          ? "Internal server error"
          : error.message,
  });
};

export default errorHandler;