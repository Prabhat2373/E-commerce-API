const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String },
    desc: { type: String },
    category: { type: String },
    ratings: { type: Number },
    price: { type: Number },
    stock: { type: Number },
    image: { type: String },
    brand: { type: String },
    sellerId: { type: String }
});

const Product = mongoose.model('Products', productSchema);
module.exports = Product