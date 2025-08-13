const jwt = require("jsonwebtoken");

const signJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d"
  });
};

module.exports = {signJWT};
