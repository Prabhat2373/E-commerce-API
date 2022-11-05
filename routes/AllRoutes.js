const express = require("express");
const { getAllUsers } = require("../Controller/ApiController");
const Authentication = require("./../Controller/AuthenticationController");
const router = express.Router();
const { signup, login } = Authentication;

router.post("/signup", signup);
router.post("/login", login);
router.get("/all", getAllUsers)

module.exports = router;
