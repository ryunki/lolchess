const mongoose = require('mongoose');

// Define the schema for the User model
const traitSchema = new mongoose.Schema({
  name: { type: String},
  champions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChampionModel'}],
  activation: [{type: Number}]
});

// Create the User model using the schema
const User = mongoose.model('Trait', traitSchema);

// Export the User model
module.exports = User;