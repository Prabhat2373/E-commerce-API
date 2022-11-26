const { promisify } = require('util')
const User = require('../Model/UserModel');
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/AppError");
const upload = require("../middlewere/upload");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    console.log("BODY :",req.body);

    const RegisterUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        isSeller: false,
    });
    // await upload(req, res);
    // console.log(req.files);
    // console.log("BODY :", req.body);

    // if (req.files.length <= 0) {
    //     return res
    //         .status(400)
    //         .send({ message: "You must select at least 1 file." });
    // }

    const token = signToken(RegisterUser._id);

    res.status(201).json({
        status: 'SUCCESS',
        token: token,
        data: RegisterUser,
        message: "File is Uploaded"
    });
    next();
});
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) check email and passwords exists
    if (!email || !password) {
        // next(new AppError("Please Prove Email and Password", 400));
        return new Error("Please Provide Email and Password", 400);
        next()
    }
    // 2) check if the user exists
    const user = await User.findOne({ email }).select("+password");
    console.log(user)

    if (!user || !await user.correctPassword(password, user.password)) {
        return new Error("Incorrect email or password");
        next()
    }

    // 3) if everything is ok, send token to the client
    const token = signToken(user._id);
    res.status(200).json({
        status: "SUCCESS",
        message: "Login Success! User Authorized",
        isSeller: user,
        token
    });
})

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting the token and check if tis there 
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }
    // console.log(token)
    if (!token) {
        return next(new AppError('You are not logged in please log in to get access', 401))
    }
    // 2) verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log(decoded)

    // 3) check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this Token does no longer exists', 401))
    }
    // 4) Check if changed password after the JWT was issued
    // if (currentUser.changePasswordAfter(decoded.iat)) {
    //     return next(new AppError('User Recently Changed Password, Please Login Again', 401))

    // }

    // Grant Access To Protected Route
    req.user = currentUser
    next();
})
