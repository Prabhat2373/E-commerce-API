const express = require("express");
const Users = require("../Model/UserModel");
const upload = require("../middleware/upload");

exports.getAllUsers = async (req, res, next) => {
    try {
        const AllUsers = await Users.find().select("-_id -__v");
        res.status(200).json({
            status: "SUCCESS",
            users: AllUsers
        })
    }
    catch (err) {
        res.status(400).json({
            status: "BAD REQUEST",
            message: err.message
        })
    }
}
exports.getUser = async (req, res, next) => {
    try {
        await upload(req, res);
        const { email } = req.params;
        console.log("USER EMAIL :", email);
        console.log("BODY :", req.body);
        // console.log("LOCAL STORAGE :", localStorage.getItem("user_email"));
        const user = await Users.find({ email })
        console.log("USER :", user);
        res.status(200).json({
            status: "SUCCESS",
            payload: user
        })
    } catch (err) {
        res.status(400).json({
            status: "BAD REQUEST",
            message: err.message
        })
    }
}