const Bootcamp = require('../models/Bootcamp.model');
const ErrorHandler = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async.handler');
const geocoder = require('../utils/geocoder');
const path = require('path');

/**
 * @desc  : Get all bootcamps
 * @route : GET /api/v1/bootcamps
 */
exports.getBootCamps = asyncHandler(async (req, res, next) => {
    let queryString = JSON.stringify(req.query);
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let query = Bootcamp.find(JSON.parse(queryString)).populate('courses');

    const bootcamps = await Bootcamp.find(query);
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

/**
 * @desc  : Create a bootcamps
 * @route : POST /api/v1/bootcamps
 */
exports.createBootCamp = asyncHandler(async (req, res, next) => {
    req.user = req.user.id;
    //check if user published bootcamp already
    const publishedBootCamp = await Bootcamp.findOne({ user: req.user.id });

    //user with role publisher can submit a single bootcamp. Admin can publish multiple bootcamps
    if (publishedBootCamp && req.user.role !== 'admin') {
        next(new ErrorHandler(`User with id ${req.user.id} already published a bootcamp`, 400))
    }
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
});

/**
 * @desc  : Get bootcamp with respective to ID
 * @route : GET /api/v1/bootcamps
 */
exports.getBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');
    if (!bootcamp) {
        return next(new ErrorHandler(`Bootcamp not found with ID: ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc  : Update bootcamp with respective to ID
 * @route : PUT /api/v1/bootcamps
 */
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootcamp) {
        return next(new ErrorHandler(`Bootcamp not found with ID: ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc  : Delete bootcamp with respective to ID
 * @route : DELETE /api/v1/bootcamps
 */
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorHandler(`Bootcamp not found with ID: ${req.params.id}`, 404));
    }
    bootcamp.remove();
    res.status(200).json({ success: true, data: {} });
});

/**
 * @desc  : Gets the bootcamps depending upon zipcode and distance
 * @route : GET /api/v1/bootcamps/radius/:zipcode/:distance
 */
exports.getBootcampsByRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //Calculate radius in KM
    const radius = distance / 6378 //in KM

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        bata: bootcamps
    });
});

/**
 * @desc  : Upload Photo for a bootcamp with respective to ID
 * @route : Put /api/v1/bootcamps/:ID/uploadPhoto
 */
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorHandler(`Bootcamp not found with ID: ${req.params.id}`, 404));
    }
    if (!req.files) {
        return next(new ErrorHandler('Plase select a file to be uploded', 404));
    }
    const file = req.files.file;

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorHandler('File should be a jpg or png', 400));
    }

    if (file.size > process.env.FILE_SIZE) {
        return next(new ErrorHandler('File size cannot be more then 3MB', 400));
    }

    file.name = `${req.params.id}_photo${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_LOCATION}/${file.name}`, async (err) => {
        if (err) {
            console.log(err);
            return next(new ErrorHandler('System error with file upload', 400));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({ success: true, data: { file: file.name } });
    });

});
