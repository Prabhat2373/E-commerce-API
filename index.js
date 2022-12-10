const express = require("express");
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;
const dotenv = require('dotenv');
const UserRoutes = require('./routes/UserRoutes')
const cors = require('cors');
const SellerRoute = require("./routes/SellersRoute");
const bodyParser = require("body-parser");
var Grid = require('gridfs-stream');
let gfs;
dotenv.config({
    path: './config.env',
});

// const DB = process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DB_PASS
// );
const DB = process.env.DB_CLUSTER

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
const conn = mongoose.createConnection(DB, {
    useNewUrlParser: true, useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});


conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('product');
    console.log("connection made successfully");
});
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/user", UserRoutes)
app.use("/api/user", SellerRoute)
app.get("/", (req, res) => {
    res.status(200).json({
        status: "SUCCESS",
        message: "Hello From Server"
    })
})

app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
})