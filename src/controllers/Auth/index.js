// Import required modules and dependencies
const bcrypt = require("bcrypt");
const { registration, login } = require("../../services/Auth");
const jwt = require("jsonwebtoken");
const isEmpty = require("../../middleware/checkEmptyFields");

// Register a user
const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      role,
    };

    await registration(user);
    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "User Already Exists" });
    } else {
      console.error(error);
      res.status(500).json({ error: "User registration failed." });
    }
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const body = req.body;

    if (!isEmpty(body)) {
      const user = await login(body);

      if (!user) {
        res.json({ message: "Invalid Email, User Not Found" });
      } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          res.json({ message: "Invalid Password" });
        } else {
          const token = jwt.sign(
            { id: user.id, role: user.role },
            "SECRET_KEY",
            { expiresIn: "48h" }
          );
          res.status(200).json({ token });
        }
      }
    } else {
      res.json({ message: "All fields are required" });
    }
  } catch (err) {
    console.log("Login Error in catch:", err);
    res.status(500).json({ error: "User login failed." });
  }
};

// Export the middleware and functions
module.exports = {
  registerUser,
  loginUser,
};
