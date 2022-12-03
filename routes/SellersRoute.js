const express = require("express");
const Authentication = require("../Controller/AuthenticationController");
const { AddProduct } = require("../Controller/ProductController");
const { BecameASeller } = require("../Controller/SellerController");
const router = express.Router();
const { protect } = Authentication;

router.route("/beaseller").post(protect, BecameASeller);
router.post("/product", AddProduct)

const SellerRoute = router;

module.exports = SellerRoute;