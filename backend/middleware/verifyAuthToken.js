const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const verifyIsLoggedin = async (req, res, next) => {
  try {
    const token = req.cookies.access_token
    if(!token) {
      return res.status(403).send("A token is required for authentication") 
   }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Get the token from the request headers
    // Verify the token
    const user = await User.findById(decodedToken._id);
    // Check if the user found in DB
    if (user) {
      // save the user info for admin verification
      req.user = decodedToken
      // User is verified, proceed to the next middleware/route handler
      next();
    }else{
      res.status(401).send("Unauthorized. User doesn't exist.");
    }
  } catch (error) {
    // Token verification failed
    res.status(401).send('Unauthorized. Invalid token.');
  }
}
const verifyIsAdmin = (req, res, next) => {
  if (req.user.username === 'admin') {
    next(); // Call next to proceed to the next middleware or route handler
  } else {
    res.status(403).send('Forbidden'); // User is not an admin, send a forbidden response
  }
}

module.exports = {verifyIsAdmin, verifyIsLoggedin}