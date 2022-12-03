const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Name of Product is a MUST']
    },
    productPrice: {
        type: Number,
        required: [true, 'provide price please']
    },
    quantity: {
        type: Number,
        required: [true, 'please provide quantity']
    },
    img: {
        data: Buffer,
        contentType: String,
    }
})


const CartModel = mongoose.model('cart', Schema);
module.exports = CartModel
