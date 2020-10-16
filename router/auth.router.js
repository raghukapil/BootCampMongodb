const express = require('express');
const { register, login, currentlogin } = require('../controller/auth.controller');
const { verityToken } = require('../middleware/verifyToken.middleware');

const router = express.Router();

router
    .route('/register')
    .post(register);

router
    .route('/login')
    .post(login);

router
    .route('/currentlogin')
    .post(verityToken, currentlogin);

module.exports = router;