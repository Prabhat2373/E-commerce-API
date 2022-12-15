const express = require("express");
const Users = require("../Model/UserModel");

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
    try{
        const Email = req.cookies.user_email;
        const user = await Users.find({email:Email})
        console.log(user);
        res.status(200).json({
            status: "SUCCESS",
            payload:user
        })
    }catch (err) {
        res.status(400).json({
            status: "BAD REQUEST",
            message: err.message
        })
    }
}