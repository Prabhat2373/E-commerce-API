const express = require("express");
const { getAllUsers } = require("../Controller/ApiController");
const Authentication = require("../Controller/AuthenticationController");
const { AddToCart, GetCartItems } = require("../Controller/CartController");
const { getProducts, download, getOneProduct } = require("../Controller/ProductController");
const router = express.Router();
const { signup, login, protect } = Authentication;
const upload = require('multer')();

router.post("/signup", signup);
router.post("/login", login);
router.route("/all").get(protect, getAllUsers);
router.route("/createcart",).post(AddToCart)
router.route("/cart").get(GetCartItems);
router.route("/products").get(getProducts);
router.route("/product/:id").get(getOneProduct);
router.route("/getproducts/:name").get(download);

module.exports = router;
