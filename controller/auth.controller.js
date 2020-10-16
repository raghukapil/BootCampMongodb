const ErrorHandler = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async.handler');
const userSchema = require('../models/User.model');


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
    if(!isPasswordTrue) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }

    sendResponseWithCookies(user, 200, res);
});

exports.currentlogin = asyncHandler(async (req, res, next) => {
    const currentUser = req.user;

    res.status(200).json({success: true, data: currentUser});
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