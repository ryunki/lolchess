const bcrypt = require('bcryptjs');
const salt = 10
// for registration
const hashPassword = (password) => bcrypt.hashSync(password, salt)
// password check for login
const comparePasswords = (inputPassword, hashedPassword) => bcrypt.compareSync(inputPassword, hashedPassword)

module.exports = { hashPassword, comparePasswords }