const express = require('express');
const { getBootCamps, getBootCamp, createBootCamp, updateBootCamp, deleteBootCamp, getBootcampsByRadius } = require('../controller/bootcamp.controller');
const { route } = require('./course.router');
const courseRoute = require('./course.router');

const router = express.Router();

router.use('/:bootcampId/courses', courseRoute);

router
    .route('/')
    .get(getBootCamps)
    .post(createBootCamp);

router
    .route('/:id')
    .get(getBootCamp)
    .put(updateBootCamp)
    .delete(deleteBootCamp);

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsByRadius);

module.exports = router;