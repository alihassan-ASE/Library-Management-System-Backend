// routes/users.js
const express = require("express");
const router = express.Router();
const {
  userValidationMiddleware,
  validateUser,
} = require("../../middleware/userValidation");
const { registerUser, loginUser } = require("../../controllers/Auth");

router.post(
  "/api/registerUser",
  userValidationMiddleware,
  validateUser,
  registerUser
);
router.post("/api/login", loginUser);

module.exports = router;
