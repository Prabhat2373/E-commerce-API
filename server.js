const express = require("express");
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;
const dotenv = require('dotenv');
const AllRoutes = require('./routes/AllRoutes')
const cors = require('cors');
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
        useUnifiedTopology: true
    })
    .then(() => {
        // console.log(conn.connection);
        console.log('DB connection SUCCESS!');
    });
app.use(cors())
app.use(express.json());
app.use("/api/user", AllRoutes)

app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
})