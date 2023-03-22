const catchError = require('./catchError');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");

exports.isAuthenticatedUser = catchError( async(req, res, next) => {
    const { token } = req.cookies;
    // If cookie don't have token
    if(!token){
        return next(new ErrorHandler("Please Login To Access This Page", 401));
    }
    
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    //Accessing User Id From Token
    req.user = await user.findById(decodeToken.id);
    next();
})

exports.authRoles = (...roles) => {
    return (req, res, next) => {
         if(!roles.includes(req.user.role)){
            return next (new ErrorHandler(
                `Role: ${req.user.role} is not allowed to access this resources`, 403
            ))
         }
         next();
    };
};