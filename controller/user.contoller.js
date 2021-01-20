
const ErrorHandler = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async.handler');
const userSchema = require('../models/User.model');

/**
 * @desc  : Get all Users
 * @route : GET /api/v1/auth/users
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
    let users = await userSchema.find();

    if (!users) {
        return next(new ErrorHandler("No users found", 404));
    }

    res.status(200).json({ 
        success: true, 
        count: users.length, 
        data: users 
    });
});

/**
 * @desc  : Get user by id
 * @route : GET /api/v1/auth/users/:userId
 */
exports.getUserById = asyncHandler(async (req, res, next) => {
    let user = await userSchema.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`No user found with id ${req.params.id}`, 404));
    }

    res.status(200).json({ 
        success: true,  
        data: user 
    });
});

/**
 * @desc  : Create user
 * @route : POST /api/v1/auth/users
 */
exports.createUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const user = await userSchema.create({ name, email, password, role });

    res.status(200).json({ 
        success: true,  
        data: user 
    });
});


/**
 * @desc  : update user with respective to user by id
 * @route : PUT /api/v1/auth/users/:userId
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
    let user = await userSchema.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new ErrorHandler(`No user found with id ${req.params.id}`, 404));
    }

    res.status(200).json({ 
        success: true,  
        data: user 
    });
});

/**
 * @desc  : Delete user with respective to user by id
 * @route : delete /api/v1/auth/users/:userId
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
    let user = await userSchema.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`No user found with id ${req.params.id}`, 404));
    }

    await user.remove();

    res.status(200).json({ 
        success: true,  
        data: {} 
    });
});