const mongoose = require("mongoose");
const dotenv = require('dotenv');
const fs = require("fs");
dotenv.config({path: './config/config.env'});
const Bootcamp = require('./models/Bootcamp.model');
const Course = require('./models/Course.model');
const User = require('./models/User.model');


const bootcampData = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamp.json`, 'utf-8'));
const courseData = JSON.parse(fs.readFileSync(`${__dirname}/_data/course.json`, 'utf-8'));
const userData = JSON.parse(fs.readFileSync(`${__dirname}/_data/user.json`, 'utf-8'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

const importData = async () => {
    try {
        await Bootcamp.create(bootcampData);
        await Course.create(courseData);
        await User.create(courseData);
        console.log("successfully data Import");
        process.exit();
    } catch (error) {
       console.log(error); 
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        console.log("successfully data Deleted");
        process.exit();
    } catch (error) {
       console.log(error); 
    }
}

if(process.argv[2] === "-i") {
    importData();
} else if(process.argv[2] === "-d"){
    deleteData();
}
