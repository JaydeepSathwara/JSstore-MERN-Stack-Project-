const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message || "Internal Server Error";

    
    // Wrong MongoDB parameters
    if(err.name === "CastError"){
        const message = `Resource Not Found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Json Web Token Error
    if(err.code === "JsonWebTokenError"){
        const message = "Json Web Token Is Invalid, Please Try Again";
        err = new ErrorHandler(message, 400);
    }

    // JWT Expire Error
    if(err.name === "TokenExpiredError"){
        const message = "Json Web Token Expire, Please Try Again";
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
};