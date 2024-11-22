// src/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    PurchasedTickets:{type:Array, required:true}
}, { collection: 'Account' });

const User = mongoose.model('User', userSchema);

module.exports = User;
