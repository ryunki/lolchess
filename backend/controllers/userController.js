const User = require('../models/UserModel');
const { hashPassword, comparePasswords } = require('../utils/hashPassword');
const generateAuthToken = require('../utils/generateAuthToken');
const Deck = require('../models/DeckModel');

const cookieOptions = {
  // This can enhance security by reducing the risk of cross-site scripting (XSS) attacks.
  httpOnly: true,
  //  helps prevent cross-site request forgery (CSRF) attacks
  sameSite: 'strict',
  // the cookie will be sent only over HTTPS connections. It's recommended to use this option when your site is served over HTTPS.
  secure: process.env.NODE_ENV === 'production',
}

// Define functions to handle user-related logic
exports.getAllUsers = (req, res) => {
  // Logic to get all users
  // Send response
  console.log('get all users')
  res.send('hey')
};

exports.getUserById = (req, res) => {
  // Logic to get a user by ID
  // Send response
};

exports.loginUser = async (req, res , next) => {
  // Logic to get a user by ID
  // Send response
  try{
    const {username, password} = req.body
    if (!(username && password)){
      return res.status(400).send('All inputs are required')
    }
    const user = await User.findOne({username})
    const passwordsMatch = comparePasswords(password, user.password)
    if (user && passwordsMatch) {
      const cookieValue = generateAuthToken(user._id, user.username)
  
      res.cookie('access_token',cookieValue, cookieOptions)
      .status(201).json({
                success: "User logged in",
                userLoggedIn: {
                  _id: user._id,
                  username: user.username,
                  deck: user.deck
                },
              })
    }else{
      return res.status(401).send("wrong credentials");
    }

  }catch(err){
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    // Logic to create a new user
    // Send response
    const { username, password, repeatPassword } = req.body;
    // check if user sent all the data needed
    if (!(username && password && repeatPassword)) {
      return res.status(400).send('All inputs are required');
    }
    if (password !== repeatPassword){
      return res.status(400).send('password does not match');
    }
    // check if email already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).send('User exists');
    } else {
      const hashedPassword = hashPassword(password);
      // create a user 
      const user = await User.create({
        username: username.toLowerCase(),
        password: hashedPassword,
      });
      const cookieValue = generateAuthToken(user._id, user.username)

      res.cookie('access_token',cookieValue, cookieOptions)
        .status(201).json({
          success: 'User created',
          userCreated: {
            _id: user._id,
            username: user.username},
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

exports.saveComposition = async (req, res, next) =>{
  try{
    const {userId, championSelectedList,deckName} = req.body
    console.log(userId, championSelectedList,deckName)
    if(!userId && !deckName){
      return res.status(400).send('Composition name is required');
    }
    const result = await Deck.create({
      name:deckName,
      champions: championSelectedList,
      user: userId
    })
    res.status(200).json({
      success: 'Composition created',
      composition: {
        name: result.name,
        champions: result.champions,
        userId: result.user
      }
    })
  }catch(error){
    next(error)
  }
}

exports.getCompositions = async (req,res,next) => {
  try{
    const {id} = req.params
    console.log(id)
    const compositionsFound = await Deck.find({user:id})
    console.log(compositionsFound)
    if(compositionsFound){
      res.json({compositions: compositionsFound})
    }
  }catch(error){
    console.log(error)
  }
}