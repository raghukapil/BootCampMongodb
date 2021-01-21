const Review = require('../models/Review.model');
const Bootcamp = require('../models/Bootcamp.model');
const ErrorHandler = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async.handler');

/**
 * @desc  : Get all reviews
 * @route : GET /api/v1/reviews
 * @route : GET /api/v1/bootcamps/:bootcampId/reviews
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
    let query;
    if(req.params.bootcampId) {
        query = Review.find({ bootcamp: req.params.bootcampId});
    } else {
        query = Review.find();
    }
    const reviews = await query.populate({
        path: 'bootcamp',
        select: 'name description'
    });
    res.status(200).json({ 
        success: true, 
        count: reviews.length, 
        data: reviews 
    });
});

/**
 * @desc  : Get a Review with respective to reviewID
 * @route : GET /api/v1/reviews/:id
 */
exports.getReviewByID = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!review) {
        return next(new ErrorHandler(`Review not found with ID: ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: review });
});

/**
 * @desc  : Create a Review
 * @route : POST /api/v1/bootcamp/:bootcampId/review
 */
exports.createReview = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp) {
        return next(new ErrorHandler(`Bootcamp not found with ID: ${req.params.bootcampId}`, 404)); 
    }

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const review = await Review.create(req.body);

    res.status(200).json({ success: true, data: review });
});

/**
 * @desc  : Update a Review with respective to reviewID
 * @route : PUT /api/v1/review
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
        return next(new ErrorHandler(`Review not found with ID: ${req.params.id}`, 404));
    }
    //review user or admin can only update this Review.
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorHandler(`Review can not be updated with user ${req.user.id}`, 401));
    }

    const reviewUpdate = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ succes: true, data: reviewUpdate });
});

/**
 * @desc  : Update a Review with respective to reviewID
 * @route : PUT /api/v1/review
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(new ErrorHandler(`Review not found with ID: ${req.params.id}`, 404));
    }
    //review user or admin can only update this Review.
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorHandler(`Review can not be updated with user ${req.user.id}`, 401));
    }

    await review.remove();
    res.status(200).json({ succes: true, data: {} });
});