const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: "failed", data: null, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ status: "failed", data: null, message: "Forbidden" });
      req.user = {
        id: decoded.UserInfo.id,
        email: decoded.UserInfo.email,
        role: decoded.UserInfo.role,
      };
      next();
    });
  } catch (error) {
    res.status(400).send("Expired Token");
  }
};

module.exports = verifyToken;
