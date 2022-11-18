const { promisify } = require('util')
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/AppError");
const Users = require("../Model/UserModel");
const Sellers = require("../Model/SellerModel");

exports.BecameASeller = catchAsync(async (req, res, next) => {
    const NewSeller = await Sellers.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        businessName: req.body.businessName,
        businessUserName: req.body.businessUserName,
        // sellingCategory: req.body.sellingCategory,
    });
    const sellerUser = await Users.findOneAndUpdate(NewSeller.email, {
        isSeller: true
    }, {
        new: true,
    })
    console.log("New Seller :", sellerUser)
    // console.log(NewSeller.id)
    res.status(201).json({
        status: "SUCCESS",
        message: "New Seller get Created",
        data: NewSeller
    })
})

