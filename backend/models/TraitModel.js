const mongoose = require('mongoose');
const Champion = require('./ChampionModel')
// Define the schema for the User model
const traitSchema = new mongoose.Schema({
  name: { type: String, required: true},
  champions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Champion'}],
  activation: [{type: Number, required: true}]
});

// Create the User model using the schema
const Trait = mongoose.model('Trait', traitSchema);

// Export the User model
module.exports = Trait;