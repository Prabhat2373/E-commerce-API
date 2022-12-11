const upload = require("../middlewere/upload");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const Product = require("../Model/ProductModel");
const BASE_URL = 'https://w-shop.onrender.com/api/user/getproducts/'
const dbConfig = require("../config/db_config")
const url = dbConfig.url;
const mongoClient = new MongoClient(url);


exports.AddProduct = async (req, res, next) => {
    try {
        await upload(req, res)

        const NewProduct = await Product.create({
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            stock: req.body.stock,
            image: BASE_URL + req.files[0].filename,
        });
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
        const Products = await Product.find({})

        res.status(200).json({
            status: "SUCCESS",
            payload: Products
        })
    } catch (err) {
        res.status(404).json({
            status: "BAD REQUEST",
            message: err.message
        })
    }
}
exports.getOneProduct = async (req, res, next) => {
    try {
        const ID = req.params.id
        const Item = await Product.findById(ID);
        
        res.status(200).json({
            status: "SUCCESS",
            payload: Item
        })
    } catch (err) {
        res.status(404).json({
            status: "BAD REQUEST",
            message: err.message
        })
    }
}

exports.download = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        // console.log("DB :", database);
        const bucket = new GridFSBucket(database, {
            bucketName: dbConfig.imgBucket,
        });
        // console.log("BUCKET :", bucket);
        let downloadStream = bucket.openDownloadStreamByName(req.params.name);

        downloadStream.on("data", function (data) {
            return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
            return res.status(404).send({
                message: "Cannot download the Image!" + err.message
            });
        });

        downloadStream.on("end", () => {
            return res.end();
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
