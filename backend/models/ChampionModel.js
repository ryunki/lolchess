const mongoose = require('mongoose');
const Trait = require('./TraitModel')
// Define the schema for the User model
const championSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  cost: { type: Number, required: true},
  traits: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trait' }]
});

// Create the User model using the schema
const Champion = mongoose.model('Champion', championSchema);

// Export the User model
module.exports = Champion;