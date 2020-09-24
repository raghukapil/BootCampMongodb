const ErrorHandler = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if(err.name === 'CastError') {
        const message = `Bootcamp not found with ID: ${err.value}`;
        error = new ErrorHandler(message, 404);
    }

    if(err.code === 11000) {
        const message = 'Duplicate field entered';
        error = new ErrorHandler(message, 400);
    }

    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'server error'
    })
}

module.exports = errorHandler;