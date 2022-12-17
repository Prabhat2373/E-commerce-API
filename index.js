const express = require("express");
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;
const dotenv = require('dotenv');
const UserRoutes = require('./routes/UserRoutes')
const cors = require('cors');
const SellerRoute = require("./routes/SellersRoute");
const cookieParser = require("cookie-parser");
dotenv.config({
    path: './config.env',
});

const DB = process.env.DB_CLUSTER;
// const DB = process.env.DATABASE 

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB connection SUCCESS!');
    }).catch((err) => {
        console.log(err.message)
    });
console.log(process.env.NODE_ENV);
app.use(cookieParser());

app.use(cors({ origin: process.env.NODE_ENV === 'production' ? 'https://e-commerce-web-opal.vercel.app' : 'http://localhost:3000', credentials: true, exposedHeaders: ['Set-Cookie', 'Date', 'ETag'] }))
app.set("trust proxy", 1)

app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/user", UserRoutes)
app.use("/api/user", SellerRoute)
app.get("/", (req, res) => {
    res.status(200).json({
        status: "SUCCESS",
        message: "Hello From Server",
        Cookie: req.cookies
    })
})

app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
})