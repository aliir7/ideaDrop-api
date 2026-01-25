export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return;
  }

  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};
