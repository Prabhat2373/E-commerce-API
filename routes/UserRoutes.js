const express = require("express");
const { getAllUsers } = require("../Controller/ApiController");
const Authentication = require("../Controller/AuthenticationController");
const router = express.Router();
const { signup, login, protect } = Authentication;

router.post("/signup", signup);
router.post("/login", login);
router.route("/all").get(protect, getAllUsers);

module.exports = router;
