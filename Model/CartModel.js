const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    productName:{
        type: String,
    },
    productPrice:{
        type: String,
    },
    quantity:{
        type:Number
    }
})


const CartModel = mongoose.model('cart', Schema);
module.exports = CartModel
