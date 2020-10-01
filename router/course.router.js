const express = require('express');
const { getCourses, getCourseByID, createCourse, updateCourse, deleteCourse } = require('../controller/course.controller');

const router = express.Router({ mergeParams: true});

router
    .route('/')
    .get(getCourses)
    .post(createCourse);

router
    .route('/:id')
    .get(getCourseByID)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;