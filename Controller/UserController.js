const { promisify } = require('util')
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Users = require("../Model/UserModel");
const Sellers = require("../Model/SellerModel");
const upload = require("../middleware/upload");
const { BASE_URL, createSendToken } = require('./AuthenticationController');


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

exports.UpdateUser = async (req, res, next) => {
    try {
        await upload(req, res);

        const email = req.cookies.user_email

        const UpdatedUser = await Users.findOneAndUpdate({ email: email }, {
            name: req.body.name,
            email: req.body.email,
            image: BASE_URL + req.files[0].filename,
            isSeller: req.body.isSeller,
            password: req.body.password
        }, { new: true })
        console.log("USER ",UpdatedUser);
        createSendToken(UpdatedUser, 200, res)
    } catch (err) {
        res.status(404).json({
            status: "BAD REQUEST",
            message: err.message
        })
    }

}
