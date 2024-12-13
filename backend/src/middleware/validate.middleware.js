const { ApiError } = require("./error.middleware");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    throw new ApiError(400, errorMessage);
  }

  next();
};

module.exports = validate;
