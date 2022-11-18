const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please tell us your name'],
    },
    email: {
        type: String,
        required: [true, 'please put your email in '],
        validate: [validator.isEmail],
        unique: true,
        lowercase: true,
    },
    businessName: {
        type: String,
        required: [true, 'please put your Business Name']
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 8,
        select: false
    },
    businessUserName: {
        type: String,
        unique: true
    }
})


const SellerModel = mongoose.model('sellers', Schema);
module.exports = SellerModel
