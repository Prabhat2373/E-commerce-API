const { promisify } = require("util");
const User = require("../Model/UserModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/AppError");
const upload = require("../middleware/upload");
exports.BASE_URL =
    process.env.BASE_URL || "https://w-shop.onrender.com/api/user/getproducts/";

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const CookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: process.env.NODE_ENV === "production",
        domain: "http://localhost:3000",
        secure: process.env.NODE_ENV === "production",
    };
    if (process.env.NODE_ENV === "production") {
        CookieOptions.secure = true,
            CookieOptions.httpOnly = true,
            CookieOptions.domain = "https://e-commerce-web-opal.vercel.app/"; // in this method cookie only be send in HTTPS request
        CookieOptions.sameSite = "none";
    }

    user.password = undefined;

    // res.cookie("jwt", token, CookieOptions);
    // res.cookie("user_email", user.email, CookieOptions);

    res.setHeader('Set-Cookie', [`jwt=${token}`, `user_email=${user.email}`]).status(statusCode).json({
        status: "SUCCESS",
        token,
        data: user,
        CookieOptions
    });
};

exports.signup = async (req, res, next) => {
    console.log(req.file);
    await upload(req, res);
    console.log(req.files);
    const { name, email, password, username, isSeller } = req.body;
    if (!(name && email && password && isSeller)) res.status(404).json({
        status: "BAD REQUEST",
        message: "ALL FIELDS ARE REQUIRED"
    })
    const ExistingUser = await User.findOne({ email });
    if (ExistingUser) res.status(400).json({
        status: "BAD REQUEST",
        message: "USER ALREADY EXISTS! Please Login"
    })
    const RegisterUser = await User.create({
        name: name,
        username: username,
        email: email.toLowerCase(), // sanitize
        password: password,
        isSeller: isSeller,
        image: this.BASE_URL + req.files[0].filename ?? ""
    });

    this.createSendToken(RegisterUser, 201, res);
    // next();
};
exports.login = catchAsync(async (req, res, next) => {
    await upload(req, res);
    const { email, password } = req.body;
    const jwt = req.cookies.jwt;

    // 1) check email and passwords exists
    if (!email || !password) {
        // next(new AppError("Please Prove Email and Password", 400));
        return new Error("Please Provide Email and Password", 400);
        next();
    }
    // 2) check if the user exists
    const user = await User.findOne({ email }).select("+password");
    console.log(user);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return new Error("Incorrect email or password");
        next();
    }

    // 3) if everything is ok, send token to the client
    const token = signToken(user._id);
    const CookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: false,
    };
    console.log(user.email);
    // res.cookie("jwt", token, CookieOptions);
    // res.cookie("user_email", user.email, CookieOptions);
    // res.status(200).json({
    //     status: "SUCCESS",
    //     message: "Login Success! User Authorized",
    //     user,
    //     token,
    // });
    this.createSendToken(user, 200, res)

});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting the token and check if tis there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    // console.log(token)
    if (!token) {
        return next(
            new AppError("You are not logged in please log in to get access", 401)
        );
    }
    // 2) verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    // 3) check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                "The user belonging to this Token does no longer exists",
                401
            )
        );
    }

    // Grant Access To Protected Route
    req.user = currentUser;
    next();
});
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError("You do not have permission to perform this action", 403)
            );
        }
        next();
    };
};
exports.logout = async (req, res, next) => {
    try {
        const token = req.cookies.jwt ?? undefined;

        if (!token)
            res
                .status(404)
                .json({ status: "BAD REQUEST", message: "YOU NEED TO LOG IN FIRST" });
        res.clearCookie("jwt");
        res.clearCookie("user_email");
        res.status(200).json({ status: "OK", message: "LOGGED OUT" });
    } catch (err) {
        console.log(err.message);
    }
    next();
};
