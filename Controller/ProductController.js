const uploadFilesMiddleware = require("../middlewere/upload");
const upload = require("../middlewere/upload");
const Product = require("../Model/ProductModel");
const BASE_URL = process.env.BASE_URL || 'http://localhost:8000/files/'

exports.AddProduct = async (req, res, next) => {
    try {
        await upload(req, res).then((res) => {
            console.log("RES", res);
        }).catch((err) => {
            console.log("ERR", err)
        });

        const NewProduct = await Product.create({
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            stock: req.body.stock,
            image: req.filename,
        });
        console.log(req);
        res.status(200).json({
            status: "SUCCESS",
            payload: NewProduct,
        })
    } catch (err) {
        res.status(404).json({
            status: "BAD REQUEST",
            message: err.message
        })
    }
}

exports.getProducts = async (req, res, next) => {
    try {
        const AllProducts = await Product.find();
        const { image } = AllProducts[0]
        console.log(image);
        res.status(200).json({
            status: "SUCCESS",
            payload: {
                imageUrl: BASE_URL + image,
                AllProducts
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "BAD REQUEST",
            message: err.message
        })
    }
}