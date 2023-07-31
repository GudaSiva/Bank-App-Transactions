const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  zipCode: {
    type: Number,
    minlength: 5,
    maxlength: 5,
    required: false,
  },
  country: {
    type: String,
    default: "India",
    required: false,
  },
});

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
    unique: true,
    trim: true,
    required: [true, "can't be blank"],
  },

  pwdHash: {
    type: String,
    required: true,
    trim: true,
    minlength: 60,
    maxlength: 60,
  },

  documentType: {
    type: String,
    enum: ["pdf", "jpg"],
    trim: true,
    required: false,
  },

  documentNumber: {
    type: String,
    trim: true,
    minlength: 9,
    unique: true,
    index: true,
    sparse: true,
    required: false,
  },

  registerAt: {
    type: Date,
    immutable: true,
    required: false,
  },
  lastLogin: {
    type: Date,
    required: false,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },

  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phone: {
    type: Number,
    unique: true,
    index: true,
    sparse: true,
    minlength: 9,
    maxlength: 9,
  },

  address: addressSchema,

  birthDate: {
    type: Date,
    required: false,
  },

  userVerified: { type: Boolean, default: false },

  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    trim: true,
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
