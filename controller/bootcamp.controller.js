const Bootcamp = require('../models/Bootcamp.model');
const ErrorHandler = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async.handler');
const geocoder = require('../utils/geocoder');

/**
 * @desc  : Get all bootcamps
 * @route : GET /api/v1/bootcamps
 */
exports.getBootCamps = asyncHandler(async (req, res, next) => {
    let queryString = JSON.stringify(req.query);
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    let query = Bootcamp.find(JSON.parse(queryString));
    
    const bootcamps = await Bootcamp.find(query);
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

/**
 * @desc  : Create a bootcamps
 * @route : POST /api/v1/bootcamps
 */
exports.createBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
});

/**
 * @desc  : Get bootcamp with respective to ID
 * @route : GET /api/v1/bootcamps
 */
exports.getBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
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
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(new ErrorHandler(`Bootcamp not found with ID: ${req.params.id}`, 404));
    }
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