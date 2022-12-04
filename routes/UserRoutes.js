const express = require("express");
const { getAllUsers } = require("../Controller/ApiController");
const Authentication = require("../Controller/AuthenticationController");
const { AddToCart, GetCartItems } = require("../Controller/CartController");
const { getProducts } = require("../Controller/ProductController");
const router = express.Router();
const { signup, login, protect } = Authentication;
const upload = require('multer')();

router.post("/signup", signup);
router.post("/login", login);
router.route("/all").get(protect, getAllUsers);
router.route("/addtocart",).post(AddToCart)
router.route("/getCarts").get(GetCartItems);
router.route("/getproducts").get(getProducts);

module.exports = router;
