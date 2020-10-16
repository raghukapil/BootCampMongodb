const express = require('express');
const { getCourses, getCourseByID, createCourse, updateCourse, deleteCourse } = require('../controller/course.controller');
const { verityToken, authorize } = require('../middleware/verifyToken.middleware');

const router = express.Router({ mergeParams: true});

router
    .route('/')
    .get(getCourses)
    .post(verityToken, authorize('admin', 'publisher'), createCourse);

router
    .route('/:id')
    .get(getCourseByID)
    .put(verityToken, authorize('admin', 'publisher'), updateCourse)
    .delete(verityToken, authorize('admin', 'publisher'), deleteCourse);

module.exports = router;