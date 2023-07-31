const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const { generateAccessToken } = require("../utils/jwt");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(400).json({
      status: "failed",
      data: null,
      message: "Missing some required fields",
    });
  }

  try {
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser || !foundUser.active) {
      return res.status(401).json({
        message: "Unauthorized",
        data: null,
        error: "Wrong email or password provided",
      });
    } else {
      const match = await bcrypt.compare(password, foundUser.pwdHash);
      if (!match) {
        return res.status(401).json({
          message: "Unauthorized",
          data: null,
          error: "Wrong email or password provided",
        });
      } else {
        const accessToken = generateAccessToken(foundUser);
        res.status(200).json({
          status: "success",
          accessToken,
          message: "Logged in successfully",
        });
        await User.findByIdAndUpdate(
          foundUser._id,
          { lastLogin: new Date() },
          { new: true }
        ).exec();
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "failed",
      data: null,
      error: error.message,
    });
  }
});

module.exports = { login };
