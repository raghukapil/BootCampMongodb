const jwt = require('jsonwebtoken');
const userSchema = require('../models/User.model');
const asyncHandler = require('./async.handler');
const ErrorHandler = require('../utils/ErrorResponse');

exports.verityToken = asyncHandler( async (req, res, next) => {
    let token;

    if(req.headers && req.headers.authentication) {
        token = req.headers.authentication.split(' ')[1];        
    } else {
        return next(new ErrorHandler('You are not authenticated for this route', 401));
    }

    try {
        const tockenDecoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userSchema.findById(tockenDecoded.id);
    } catch (err) {
        return next(new ErrorHandler('You are not authenticated for this route', 401));
    }
    next();
});

exports.authorize = (...roles) => {
    return ((req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`User with role '${req.user.role}' cannot perform this operation`, 403));
        }
        next();
    });
};