const crypto = require('crypto');
const ErrorHandler = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async.handler');
const userSchema = require('../models/User.model');
const sendEmail = require('../utils/sendEmail');

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const user = await userSchema.create({ name, email, password, role });
    sendResponseWithCookies(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    const user = await userSchema.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }

    const isPasswordTrue = await user.matchPassword(password);
    if (!isPasswordTrue) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }

    sendResponseWithCookies(user, 200, res);
});

exports.currentlogin = asyncHandler(async (req, res, next) => {
    const currentUser = req.user;

    res.status(200).json({ success: true, data: currentUser });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const email = req.body.email;

    const user = await userSchema.findOne({ email });
    if (!user) {
        return next(new ErrorHandler('user not found with respective email', 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    //create reset URL
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `Please click on the below URL to Reset your password \n\n ${resetURL}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Bootcamp Reset Password',
            message: message
        });
        res.status(200).json({ success: true, data: 'Email Send' });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler('Email could not be sent', 500));
    }

});

exports.resetPassword = asyncHandler(async (req, res, next) => {

    const resetToken = req.params.resetToken;
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await userSchema.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Invalid Token', 400));
    }

    //update new password in DB
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendResponseWithCookies(user, 200, res);

});

function sendResponseWithCookies(user, statusCode, res) {
    const token = user.getjwtToken();
    const options = {
        expire: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token });
}