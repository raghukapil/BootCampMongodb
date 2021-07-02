const express = require('express');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const cookieParser =require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
// const path = require('path');
dotenv.config({path: './config/config.env'});

const mongo_db = require('./dataSourse/db.connector');
const bootCampRouter = require('./router/bootcamp.router');
const courseRouter = require('./router/course.router');
const authRouter = require('./router/auth.router');
const userRouter = require('./router/user.router');
const reviewRouter = require('./router/review.router');
const errorMiddleware = require('./middleware/error.middleware');

mongo_db();
const app = express();
const port = process.env.PORT || 3500;

app.use(express.json());
app.use(fileUpload());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootCampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use(errorMiddleware);

app.listen(port, () =>{
    console.log(`server running on port ${port}`);
});

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
});