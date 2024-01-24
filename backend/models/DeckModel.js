const mongoose = require('mongoose');

// Define the schema for the User model
const deckSchema = new mongoose.Schema({
  name: { type: String, required: true},
  champions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Champion'}],
  traits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trait'}],
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  createdAt: { type: Date, default: Date.now },
},{
  // time is saved whenever updated
    timestamps: true,
});

// Create the User model using the schema
const User = mongoose.model('Deck', deckSchema);

// Export the User model
module.exports = User;