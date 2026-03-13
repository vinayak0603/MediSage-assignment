// Error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev and monitoring
  console.error('--- ERROR START ---');
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  console.error('--- ERROR END ---');

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found / Invalid ID format`;
    error = { message, statusCode: 404 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    // Include stack trace only in development to avoid security risks, 
    // but for debugging this 500 error we might want to see it if the user allows.
    // For now, let's keep it safe but log it to the server console (Vercel Logs).
  });
};

module.exports = errorHandler;
