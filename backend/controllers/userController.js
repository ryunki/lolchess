const User = require('../models/UserModel');
const { hashPassword, comparePasswords } = require('../utils/hashPassword');
const generateAuthToken = require('../utils/generateAuthToken');

// Define functions to handle user-related logic
exports.getAllUsers = (req, res) => {
  // Logic to get all users
  // Send response
};

exports.getUserById = (req, res) => {
  // Logic to get a user by ID
  // Send response
};

exports.loginUser = (req, res) => {
  // Logic to get a user by ID
  // Send response
};

exports.createUser = async (req, res, next) => {
  try {
    // Logic to create a new user
    // Send response
    const { username, password } = req.body;
    // check if user sent all the data needed
    if (!(username && password)) {
      return res.status(400).send('All inputs are required');
    }
    // check if email already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).send('User exists');
    } else {
      // // Create a token with a secret key
      // const token = jwt.sign({ username, password }, process.env.SECRET_KEY, { expiresIn: '1h' });
      // console.log(token)
      console.log(username, password)
      const hashedPassword = hashPassword(password);
      const user = await User.create({
        username: username.toLowerCase(),
        password: hashedPassword,
      });
      res.cookie(
        'access_token',
        generateAuthToken(user._id, user.username),
        {
          // This can enhance security by reducing the risk of cross-site scripting (XSS) attacks.
          httpOnly: true,
          //  helps prevent cross-site request forgery (CSRF) attacks
          sameSite: 'strict',
          // the cookie will be sent only over HTTPS connections. It's recommended to use this option when your site is served over HTTPS.
          secure: process.env.NODE_ENV === 'production',
        }
      ).status(201).json({
          success: 'User created',
          userCreated: {username: user.username},
        })
    }
  } catch (err) {
    next(err);
  }
};

exports.updateUser = (req, res) => {
  // Logic to update a user by ID
  // Send response
};

exports.deleteUser = (req, res) => {
  // Logic to delete a user by ID
  // Send response
};
