const Course = require('../models/Course.model');
const Bootcamp = require('../models/Bootcamp.model');
const ErrorHandler = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async.handler');

/**
 * @desc  : Get all Courses
 * @route : GET /api/v1/courses
 * @route : GET /api/v1/bootcamps/:bootcampId/courses
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if(req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId});
    } else {
        query = Course.find();
    }
    const courses = await query.populate({
        path: 'bootcamp',
        select: 'name description'
    });
    res.status(200).json({ 
        success: true, 
        count: courses.length, 
        data: courses 
    });
});

/**
 * @desc  : Get a Course with respective to courseID
 * @route : GET /api/v1/courses
 */
exports.getCourseByID = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(new ErrorHandler(`Course not found with ID: ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: course });
});

/**
 * @desc  : Create a course
 * @route : POST /api/v1/bootcamp/:bootcampId/courses
 */
exports.createCourse = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp) {
        return next(new ErrorHandler(`Bootcamp not found with ID: ${req.params.bootcampId}`, 404)); 
    } 

    //Bootcamp user or admin can only update this bootcamp.
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorHandler(`Course can not be added with user ${req.user.id}`, 401));
    }

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const course = await Course.create(req.body);

    res.status(200).json({ success: true, data: course });
});

/**
 * @desc  : Update a Course with respective to courseID
 * @route : PUT /api/v1/course
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!course) {
        return next(new ErrorHandler(`Course not found with ID: ${req.params.id}`, 404));
    }
    //Bootcamp user or admin can only update this Course.
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorHandler(`Course can not be updated with user ${req.user.id}`, 401));
    }

    res.status(200).json({ succes: true, data: course });
});

/**
 * @desc  : Update a Course with respective to courseID
 * @route : PUT /api/v1/course
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorHandler(`Course not found with ID: ${req.params.id}`, 404));
    }
    //Bootcamp user or admin can only update this Course.
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorHandler(`Course can not be updated with user ${req.user.id}`, 401));
    }

    course.remove();
    res.status(200).json({ succes: true, data: {} });
});