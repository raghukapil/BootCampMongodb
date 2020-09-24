const express = require('express');
const { getBootCamps, getBootCamp, createBootCamp, updateBootCamp, deleteBootCamp } = require('../controller/bootcamp.controller');

const router = express.Router();

router
    .route('/')
    .get(getBootCamps)
    .post(createBootCamp);

router
    .route('/:id')
    .get(getBootCamp)
    .put(updateBootCamp)
    .delete(deleteBootCamp);

module.exports = router;