const express = require('express');
const { getReviews, getReviewByID, createReview, updateReview, deleteReview } = require('../controller/review.controller');
const { verityToken, authorize } = require('../middleware/verifyToken.middleware');

const router = express.Router({ mergeParams: true});

router
    .route('/')
    .get(getReviews)
    .post(verityToken, authorize('admin', 'user'), createReview);

router
    .route('/:id')
    .get(getReviewByID)
    .put(verityToken, authorize('admin', 'user'), updateReview)
    .delete(verityToken, authorize('admin', 'user'), deleteReview);

module.exports = router;