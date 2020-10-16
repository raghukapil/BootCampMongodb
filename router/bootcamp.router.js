const express = require('express');
const { getBootCamps, getBootCamp, createBootCamp, updateBootCamp, deleteBootCamp, getBootcampsByRadius, uploadPhoto } = require('../controller/bootcamp.controller');
const courseRoute = require('./course.router');
const { verityToken, authorize } = require('../middleware/verifyToken.middleware');

const router = express.Router();

router.use('/:bootcampId/courses', courseRoute);

router
    .route('/')
    .get(getBootCamps)
    .post(verityToken, authorize('admin', 'publisher'), createBootCamp);

router
    .route('/:id')
    .get(getBootCamp)
    .put(verityToken, authorize('admin', 'publisher'), updateBootCamp)
    .delete(verityToken, authorize('admin', 'publisher'), deleteBootCamp);

router
    .route('/:id/uploadPhoto')
    .put(verityToken, authorize('admin', 'publisher'), uploadPhoto);

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsByRadius);

module.exports = router;