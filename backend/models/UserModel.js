const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true , unique: true},
  password: { type: String, required: true },
  deck: {type: mongoose.Schema.Types.ObjectId, ref: 'DeckModel'},
  createdAt: { type: Date, default: Date.now },
},{
  // time is saved whenever updated
    timestamps: true,
});

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;