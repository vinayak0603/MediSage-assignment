const { validationResult } = require('express-validator');

// Validation middleware wrapping express-validator
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path || err.param]: err.msg }));

  return res.status(400).json({
    success: false,
    errors: extractedErrors,
  });
};
