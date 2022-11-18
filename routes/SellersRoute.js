const express = require("express");
const Authentication = require("../Controller/AuthenticationController");
const { BecameASeller } = require("../Controller/SellerController");
const router = express.Router();
const { protect } = Authentication;

router.route("/beaseller").post(protect, BecameASeller);

const SellerRoute = router;

module.exports = SellerRoute;