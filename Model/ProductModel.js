const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String },
    desc: { type: String },
    price: { type: Number },
    stock: { type: Number },
    img: { data: Buffer, contentType: String }
});

const Product = mongoose.model('Products', productSchema);
module.exports = Product