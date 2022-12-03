const upload = require("../middlewere/upload");
const Product = require("../Model/ProductModel");

exports.AddProduct = async (req, res, next) => {
    try {
        await upload(req, res);
        const NewProduct = await Product.create({
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            stock: req.body.stock,
            img: req.body.img,
        });
        res.status(200).json({
            status: "SUCCESS",
            payload: NewProduct
        })
    } catch (err) {
        res.status(404).json({
            status: "BAD REQUEST",
            message: err.message
        })
    }
}