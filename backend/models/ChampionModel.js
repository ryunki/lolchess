const mongoose = require('mongoose');

// Define the schema for the User model
const championSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  cost: { type: Number, required: true},
  traits: [{type: mongoose.Schema.Types.ObjectId, ref: 'TraitModel' }]
});

// Create the User model using the schema
const User = mongoose.model('Champion', championSchema);

// Export the User model
module.exports = User;