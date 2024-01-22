const jwt = require("jsonwebtoken");

// create token using user's info
const generateAuthToken = (_id, username) => {
  return jwt.sign(
    { _id, username },
    process.env.JWT_SECRET_KEY,
    // set expired time
    { expiresIn: "7h" }
  );
};
module.exports = generateAuthToken