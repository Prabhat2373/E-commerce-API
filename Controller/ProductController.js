const uploadFilesMiddleware = require("../middlewere/upload");
const upload = require("../middlewere/upload");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const Product = require("../Model/ProductModel");
const BASE_URL = process.env.BASE_URL || 'http://localhost:8000/api/user/getproducts/'
const dbConfig = require("../config/db_config")
const url = dbConfig.url;
const mongoClient = new MongoClient(url);


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
            image: req.files[0].filename,
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
        const Products = await Product.find({});
        // console.log("Products");
        // const { image } = Products
        console.log("Before Map :", Products);
        const AllProducts = Products.map(el => {
            if (el.image) {
                return { ...el, image: BASE_URL + el.image };
            }

            return el;
        })
        // el.image = BASE_URL + el.image

        console.log("AllProducts :", AllProducts);
        res.status(200).json({
            status: "SUCCESS",
            payload: {
                imageUrl: BASE_URL,
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
        console.log(downloadStream);
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
