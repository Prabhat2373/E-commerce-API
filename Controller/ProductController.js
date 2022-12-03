const uploadFilesMiddleware = require("../middlewere/upload");
const upload = require("../middlewere/upload");
const Product = require("../Model/ProductModel");

exports.AddProduct = async (req, res, next) => {
    try {
        await upload(req, res).then((res) => {
            console.log("RES", res);
        }).catch((err) => {
            console.log("ERR",err)
        });
        const NewProduct = await Product.create({
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            stock: req.body.stock,
            // file: req.file.filename,
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