const { validationResult, body } = require("express-validator");

const userValidationMiddleware = [
  body("firstname")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .matches(/^[A-Za-z\s]+$/)
    .custom((value) => {
      if (value.trim() === "") {
        throw new Error("First name must not contain only spaces");
      }
      return true;
    }),
  body("lastname")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .matches(/^[A-Za-z\s]+$/)
    .custom((value) => {
      if (value.trim() === "") {
        throw new Error("Last name must not contain only spaces");
      }
      return true;
    }),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) => {
      if (value.trim() === "") {
        throw new Error("Email must not contain only spaces");
      }
      return true;
    }),
  body("phone")
    .not()
    .isEmpty()
    .withMessage("Phone is required")
    .isString()
    .custom((value) => {
      if (value.trim() === "") {
        throw new Error("Phone Number must contain only spaces");
      }
      return true;
    }),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isString()
    .custom((value) => {
      if (value.trim() === "") {
        throw new Error("Password must not contain only spaces");
      }
      return true;
    })
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("role")
    .not()
    .isEmpty()
    .withMessage("Role is required")
    .isString()
    .custom((value) => {
      if (value.trim() === "") {
        throw new Error("Role must not contain only spaces");
      }
      return true;
    }),
];

const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const errorMessages = errors.array().map((error) => error.msg);
  return res.status(422).json({ errors: errorMessages });
};

module.exports = {
  userValidationMiddleware,
  validateUser,
};
