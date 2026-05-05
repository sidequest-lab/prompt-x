const ApiError = require("../utils/ApiError");

function validate(schema, property = "body") {
  return (req, _res, next) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      return next(
        new ApiError(400, "Validation failed", result.error.flatten())
      );
    }

    req[property] = result.data;
    return next();
  };
}

module.exports = validate;
