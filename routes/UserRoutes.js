const express = require("express");
const { getAllUsers, getUser } = require("../Controller/ApiController");
const Authentication = require("../Controller/AuthenticationController");
const { AddToCart, GetCartItems, removeCartItem } = require("../Controller/CartController");
const { getProducts, download, getOneProduct, deleteProducts, deleteProductById } = require("../Controller/ProductController");
const { UpdateUser } = require("../Controller/UserController");
const router = express.Router();
const { signup, login, protect } = Authentication;

router.post("/signup", signup);
router.post("/login", login);
router.route("/all").get(protect, getAllUsers);
router.route("/user/:email").get(getUser)
router.route("/cart/:id").post(AddToCart).delete(removeCartItem)
router.route("/cart").get(GetCartItems);
router.route("/products").get(getProducts).delete(deleteProducts);
router.route("/product/:id").get(getOneProduct).delete(deleteProductById    );
router.route("/getproducts/:name").get(download);
router.route("/logout").post(Authentication.logout)
router.route("/update").put(UpdateUser)

module.exports = router;
