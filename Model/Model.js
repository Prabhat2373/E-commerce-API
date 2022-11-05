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
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        // required: [false, 'please provide confirmation of password'],
        required: false,
        minlength: 8,
        validate: {
            // This will only runs on save
            validator: function (el) {
                return el === this.password
            },
            message: "Passwords are not the same"
        },
        select: false
    }
});

Schema.pre("save", async function (next) {
    // only run this function if password is actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12, 12 is a CPU intensive amount 
    this.password = await bcrypt.hash(this.password, 12)
    // Delete the passwordConfirm field 
    this.passwordConfirm = undefined;
    next()
})
// Instance method of mongodb (correctPassword)
Schema.methods.correctPassword = async function (candidatePassword, userPassword) {
    // bcrypt compare method to compare both of passwords for authentication
    return await bcrypt.compare(candidatePassword, userPassword);
}

// Schema.methods.changePasswordAfter = function (JWTTimeStamp) {
//     if (this.passwordChangedAt) {
//         const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

//         return JWTTimeStamp < changedTimeStamp // 100 < 200
//     }
//     // False Means Not Changed 
//     return false;
// }

const User = mongoose.model('EUsers', Schema);
module.exports = User;