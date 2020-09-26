const mongoose = require("mongoose");
const dotenv = require('dotenv');
const fs = require("fs");
dotenv.config({path: './config/config.env'});
const Bootcamp = require('./models/Bootcamp.model');


const data = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamp.json`, 'utf-8'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

const importData = async () => {
    try {
        await Bootcamp.create(data);
        console.log("successfully data Import");
        process.exit();
    } catch (error) {
       console.log(error); 
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        console.log("successfully data Deleted");
        process.exit();
    } catch (error) {
       console.log(error); 
    }
}

if(process.argv[2] === "bootcampimport") {
    importData();
} else if(process.argv[2] === "bootcampdelete"){
    deleteData();
}
