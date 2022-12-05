const express = require("express");
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;
const dotenv = require('dotenv');
const UserRoutes = require('./routes/UserRoutes')
const cors = require('cors');
const SellerRoute = require("./routes/SellersRoute");
const bodyParser = require("body-parser");
const Cart = require("./Model/CartModel")
const upload = require("multer");
const Product = require("./Model/ProductModel");

dotenv.config({
    path: './config.env',
});

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DB_PASS
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB connection SUCCESS!');
    });
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/user", UserRoutes)
app.use("/api/user", SellerRoute)
app.get("/",(req,res)=>{
    res.status(200).json({
        status: "SUCCESS",
        message:"Hello From Server"
    })
})
// app.post("/uploadDetails", async (req, res) => {
//     try {
//         const newItem = await Cart.create({
//             name: req.body.name,
//             price: req.body.price,
//             quantity: req.body.quantity,
//             image: req.body.image,
//         });
//         res.status(200).json({
//             status: "SUCCESS",
//             payload: newItem
//         })
//     } catch (err) {
//         res.status(404).json({
//             status: "BAD REQUEST",
//             message: err.message
//         })
//     }
// })

app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
})