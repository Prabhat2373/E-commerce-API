const { promisify } = require('util')
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/AppError")
const Cart = require("../Model/CartModel");
const upload = require("../middlewere/upload.js")

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.AddToCart = async (req, res, next) => {
    try {
        await upload(req, res);
        const NewCartItem = await Cart.create({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            image: req.body.image,
            
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