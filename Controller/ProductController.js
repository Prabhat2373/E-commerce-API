const upload = require("../middleware/upload");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const Product = require("../Model/ProductModel");
const BASE_URL = 'https://w-shop.onrender.com/api/user/getproducts/'
const dbConfig = require("../config/db_config");
const url = dbConfig.url;
const mongoClient = new MongoClient(url);


exports.AddProduct = async (req, res, next) => {
    try {
        await upload(req, res)
        console.log(req)
        const NewProduct = await Product.create({
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            stock: req.body.stock,
            image: BASE_URL + req.files[0].filename,
            brand: req.body.brand,
            ratings: req.body.ratings,
            category: req.body.category,
            sellerId: req.body.sellerId
        });
        res.status(201).json({
            status: "SUCCESS",
            message: "PRODUCT HAS BEED CREATED",
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
        const filters = req.query;
        if (!filters) {
            res.status(200).json({
                status: "SUCCESS",
                payload: Products,
            })
        }
        var FilteredProducts = Products.filter(product => {
            let isValid = true;
            for (key in filters) {
                // console.log(key, product[key], filters[key]);
                isValid = isValid && product[key] == filters[key];
            }
            return isValid;
        });
        res.json({
            status: "SUCCESS",
            payload: FilteredProducts
        })

        // console.log(FilteredProducts);

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
exports.deleteProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products || products.length === 0) {
            res.status(404).json({
                status: "BAD REQUEST",
                message: "NO DATA"
            })
        }
        const deletedProducts = await Product.deleteMany();
        res.status(204).json({
            status: "SUCCESS",
            message: "ITEMS HAS BEEN DELETED",
            data: deletedProducts
        })
    } catch (error) {
        return res.status(404).send({
            status: "BAD REQUEST",
            message: error.message,
        });
    }
}
exports.deleteProductById = async (req, res) => {
    try {
        const ID = req.params.id;
        const deletedItem = await Product.deleteOne({ _id: ID })
        res.json({
            status: "SUCCESS",
            message: "ITEM DELETED SUCCESSFULLY",
            data: deletedItem
        })
    } catch (err) {
        res.json({
            status: "BAD REQUEST",
            message: err.message
        })
    }
}