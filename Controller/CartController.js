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

        if (await Cart.findById(CartProduct._id)) {
            await Cart.findOneAndUpdate({ ...CartProduct._doc }, {
                $inc: { quantity: +1 }
            }, { new: true });
            res.status(200).json({
                status: "SUCCESS",
                message: "Cart Has Been Updated"
            })
        }
        await Cart.create({ ...CartProduct._doc, quantity: req.body.quantity });

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
exports.removeCartItem = async (req, res, next) => {
    try {
        const ID = req.params.id;
        const removedItem = await Cart.deleteOne({ _id: ID });
        res.status(204).json({
            status: "SUCCESS",
            message: "Cart Item Deleted Successfully", removedItem
        })
    } catch (err) {
        res.status(400).json({
            status: "BAD REQUEST",
            message: err.message
        })
    }
}