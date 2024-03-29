const express = require("express");
const Authentication = require("../Controller/AuthenticationController");
const { AddProduct } = require("../Controller/ProductController");
const { BecameASeller } = require("../Controller/UserController");
const router = express.Router();
const { protect } = Authentication;

router.route("/beaseller").post(protect, BecameASeller);
router.route("/product").post(AddProduct)

const SellerRoute = router;

module.exports = SellerRoute;