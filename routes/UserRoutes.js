const express = require("express");
const { getAllUsers, getUser } = require("../Controller/ApiController");
const Authentication = require("../Controller/AuthenticationController");
const { AddToCart, GetCartItems, removeCartItem } = require("../Controller/CartController");
const { getProducts, download, getOneProduct } = require("../Controller/ProductController");
const router = express.Router();
const { signup, login, protect } = Authentication;

router.post("/signup", signup);
router.post("/login", login);
router.route("/all").get(protect, getAllUsers);
router.route("/user").get(getUser)
router.route("/cart/:id").post(AddToCart).delete(removeCartItem)
router.route("/cart").get(GetCartItems);
router.route("/products").get(getProducts);
router.route("/product/:id").get(getOneProduct);
router.route("/getproducts/:name").get(download);

module.exports = router;
