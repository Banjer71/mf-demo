const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  credentialID: String,
  publicKey: String,
  counter: Number,
  transports: [String],
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  userID: { type: String, required: true }, // This is the UUID
  currentChallenge: String,
  credentials: [credentialSchema],
});

module.exports = mongoose.model('User', userSchema);
