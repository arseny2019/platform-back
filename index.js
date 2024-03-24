const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const blogRouter = require('./app/routes/post.router');
const authRouter = require('./app/routes/auth.router');
const errorMiddleware = require('./app/middleware/error-middleware');
const cors = require('cors')
require('dotenv').config();
const PORT = process.env.PORT || 5001;
const dbUrl = process.env.MONGO_URL;

const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use('/post', blogRouter);
app.use('/auth', authRouter);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(dbUrl)
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();
