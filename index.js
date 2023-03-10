const express = require('express');
const mongoose = require('mongoose');
const blogRouter = require('./routes/blogRouter');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const dbUrl = process.env.MONGO_URL;

const app = express();
app.use(function (req, res, next) {
    const allowedOrigins = [
        "http://localhost:4200"
    ];
    const origin = req.headers.origin;
    console.log(origin)
    console.log(allowedOrigins.indexOf(origin) > -1)
// Website you wish to allow to
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

// res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

// Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

// Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,Authorization"
    );

// Pass to next layer of middleware
    next();
});
app.use(express.json());
app.use('/blog', blogRouter);

const start = async () => {
    try {
        await mongoose.connect(dbUrl)
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();
