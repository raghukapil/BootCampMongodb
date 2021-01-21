const express = require('express');
const { register, login, currentlogin, forgotPassword, resetPassword, updateUserDetails, updatePassword, logout } = require('../controller/auth.controller');
const { verityToken } = require('../middleware/verifyToken.middleware');

const router = express.Router();

router
    .route('/register')
    .post(register);

router
    .route('/login')
    .post(login);

router
    .route('/logout')
    .post(logout);

router
    .route('/forgotpassword')
    .post(forgotPassword);

router
    .route('/resetpassword/:resetToken')
    .put(resetPassword);

router
    .route('/currentlogin')
    .post(verityToken, currentlogin);

router
    .route('/updatedetails')
    .put(verityToken, updateUserDetails);

router
    .route('/updatePassword')
    .put(verityToken, updatePassword);

module.exports = router;