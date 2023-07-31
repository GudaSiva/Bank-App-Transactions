const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const payload = {
    UserInfo: {
      id: user._id,
      email: user.email,
      role: user.role,
      verified: user.userVerified,
    },
  };
  const options = {
    expiresIn: process.env.NODE_ENV === "development" ? "1d" : "15m",
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
};

module.exports = { generateAccessToken };
