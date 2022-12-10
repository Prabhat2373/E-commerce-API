const { promisify } = require('util')
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const Product = require("../Model/ProductModel.js");
const Cart = require("../Model/CartModel");
const upload = require("../middlewere/upload.js")

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.AddToCart = async (req, res, next) => {
    try {
        const ID = req.params.id;
        const CartProduct = await Product.findById(ID);
        await Cart.create({ ...CartProduct, quantity: req.body.quantity });

        console.log(ID);
        console.log({ ...CartProduct._doc, quantity: req.body.quantity });
        res.status(200).json({
            status: "SUCCESS",
            message: "Added To Cart Successfully"
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