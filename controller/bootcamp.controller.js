const Bootcamp = require('../models/Bootcamp.model');
const ErrorHandler = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async.handler');

exports.getBootCamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find(req.query);
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

exports.createBootCamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
});

exports.getBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorHandler(`Bootcamp not found with ID: ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

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

exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(new ErrorHandler(`Bootcamp not found with ID: ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });
});