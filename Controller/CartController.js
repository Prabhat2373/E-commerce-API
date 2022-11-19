const { promisify } = require('util')
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/AppError")
const Cart = require("../Model/CartModel");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.AddToCart = async (req, res, next) => {
    try {
        const NewCartItem = await Cart.create({
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            quantity: req.body.quantity,
        });
        res.status(200).json({
            status: "SUCCESS",
            payload: NewCartItem
        })
    } catch (err) {
        res.status(400).json({
            status: "BAD REQUEST",
            message: err.message
        })
    }
}
exports.GetCartItems = async (req, res, next) => {
    try {
        const CartItems = await Cart.find();
        res.status(200).json({
            status: "SUCCESS",
            payload: CartItems
        })
    } catch (err) {
        res.status(400).json({
            status: "BAD REQUEST",
            message: err.message
        })
    }
}