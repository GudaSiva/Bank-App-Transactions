const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { generateAccessToken } = require("../utils/jwt");
const ageValidation = require("../utils/ageValidation");

const createNewUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Confirm data
  if (!password || !email) {
    return res.status(400).json({
      status: "failed",
      data: null,
      message: "All fields are required",
    });
  }
  // Check for duplicate email
  const duplicate = await User.findOne({ email }).lean().exec();
  if (duplicate) {
    return res.status(409).json({
      status: "failed",
      data: null,
      message: "This email is already registered",
    });
  }

  try {
    const newUser = new User({
      email,
      pwdHash: await bcrypt.hash(password, 10),
      registerAt: new Date(),
      lastLogin: new Date(),
    });
    newUser.save().then((newUser) => {
      const accessToken = generateAccessToken(newUser);
      res.status(201).json({
        status: "success",
        message: "User created successfully",
        accessToken,
      });
    });
  } catch (error) {
    if (error.message === "data and salt arguments required") {
      res.status(422).json({
        status: "failed",
        data: null,
        message:
          "Password is required, please insert a valid password and try again",
      });
    }

    if (error.code == 11000 || duplicate) {
      return res.status(409).json({
        status: "failed",
        message: "This email is already registered",
        data: null,
      });
    }
    return res
      .status(400)
      .json({ status: "failed", data: null, message: error.message });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id !== req.user.id) {
    res.status(401).json({
      status: "failed",
      data: null,
      message: "Unauthorized",
    });
  }

  const {
    password,
    documentType,
    documentNumber,
    address,
    firstName,
    lastName,
    phone,
    birthDate,
  } = req.body;

  try {
    const foundUser = await User.findById(id);

    // Check for user
    if (!req.user || !foundUser) {
      res.status(401);
      throw new Error("User not found");
    }

    //Check if user has 18 years
    if (birthDate) {
      let isAdult = ageValidation(birthDate);

      if (!isAdult) {
        res.status(422).json({
          status: "failed",
          data: null,
          message: "You must be 18 years old to register",
        });
      }
    }

    // Check if user is verified
    if (!foundUser.userVerified) {
      // Check for required fields
      const requiredFields = [
        ["Document type", documentType],
        ["Document number", documentNumber],
        ["Address", address],
        ["First name", firstName],
        ["Last name", lastName],
        ["Phone number", phone],
        ["Birth date", birthDate],
      ];
      const missingFields = requiredFields.filter((field) => !field[1]);

      if (missingFields.length > 0) {
        res.status(422).json({
          status: "failed",
          data: null,
          message: `Please provide the following fields: ${missingFields.join(
            " "
          )}`,
        });
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          id,

          //encrypt password if it is provided
          password
            ? { ...req.body, pwdHash: await bcrypt.hash(password, 10) }
            : { ...req.body, userVerified: true },
          {
            new: true,
          }
        );

        res.status(200).json({ status: "succeeded", updatedUser, error: null });
      }
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        id,

        //encrypt password if it is provided
        password
          ? { ...req.body, pwdHash: await bcrypt.hash(password, 10) }
          : req.body,
        {
          new: true,
        }
      );

      res.status(200).json({ status: "succeeded", updatedUser, error: null });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ status: "failed", data: null, message: error.message });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id !== req.user.id) {
    res.status(401).json({
      status: "failed",
      data: null,
      message: "Unauthorized",
    });
  }

  try {
    const foundUser = await User.findById(id);

    if (!req.user || !foundUser) {
      res.status(401);
      throw new Error("User not found");
    }

    res.status(200).json({
      status: "succeeded",
      data: {
        email: foundUser.email,
        documentType: foundUser.documentType,
        documentNumber: foundUser.documentNumber,
        address: foundUser.address,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        phone: foundUser.phone,
        birthDate: foundUser.birthDate,
      },
      error: null,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "failed", data: null, message: error.message });
  }
});

module.exports = {
  createNewUser,
  updateUser,
  getUserProfile,
};
