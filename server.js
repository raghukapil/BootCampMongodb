const express = require('express');
const dotenv = require('dotenv');
const mongo_db = require('./dataSourse/db.connector');
const bootCampRouter = require('./router/bootcamp.router');
const errorMiddleware = require('./middleware/error.middleware');

dotenv.config({path: './config/config.env'});

mongo_db();
const app = express();
const port = process.env.PORT || 3500;

app.use(express.json());
app.use('/api/v1/bootcamp', bootCampRouter);
app.use(errorMiddleware);

app.listen(port, () =>{
    console.log(`server running on port ${port}`);
});

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
})