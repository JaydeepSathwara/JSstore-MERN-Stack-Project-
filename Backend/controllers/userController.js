const ErrorHandler = require("../utils/errorHandler");
const catchError = require('../middleware/catchError'); //Catching Async Errors
const User = require('../models/userModel');
const generateToken = require('../utils/GenerateJWT_Token');
const sendEmail = require('../utils/sendEmail');
const crypto = require("crypto");
const Product = require("../models/productModel");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.registerUser = catchError(async (req, res, next) => {

  const { name, email, password,avatar } = req.body;
  const userCheck = await User.findOne({ email });
  if (userCheck) {
    return next(new ErrorHandler("Email Is Already In Use", 401));
  }

  // const file = fs.readFileSync("C:/Users/Admin/Desktop/login background.jpg");
    // const myCloud = await cloudinary.uploader.upload("C:/Users/Admin/Desktop/login background.jpg", {
    //   folder: "Avatars",
    //   width: 150,
    //   crop: "scale",
    // });
    const myCloud = {url : "Temp url hai bro"};
  console.log("url",myCloud.url);


  // console.log("SignUp Name123: ", name);
  // console.log("SignUp Avatar123: ", email);
  // console.log("SignUp Email123: ", password);
  // console.log("Password123: ", avatar);


  const user = await User.create({
    name, email, password,
    avatar: {
      public_id: "myCloud.public_id",
      url: "myCloud.secure_url"
    }
  })
  generateToken(user, 201, res);
})

// User Login

exports.loginUser = catchError(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Check if both email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Both Email, And Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatched = await user.checkPassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  generateToken(user, 200, res);
})

exports.logoutUser = catchError(async (req, res, next) => {

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    message: "Logout Successfully"
  })
})

// Forget Password
exports.forgotPassword = catchError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchError(async (req, res, next) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

  if (!user) {
    return next(new ErrorHandler("Reset Password Token Is Invalid Or Has Been Expired", 400));
  }
  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("Password Dosn't Match", 400));
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  generateToken(user, 200, res);
})

// Get User Profile Details
exports.getUserDetails = catchError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});

// Update User Password
exports.updatePassword = catchError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const isPasswordMatched = await user.checkPassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password Dosn't Match", 401));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password Dosn't Match", 401));
  }

  user.password = req.body.newPassword;

  await user.save();

  generateToken(user, 200, res);
});

// Update User Profile
exports.updateProfile = catchError(async (req, res, next) => {

  // console.log("exit");
  const userData = {
    name: req.body.name,
    email: req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id, userData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true
  });
});

// ADMIN = Get All Users

exports.getAllUser = catchError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  })
})

// ADMIN = Get User

exports.getUser = catchError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User Does Not Exist With Id ${req.params.id}`)
  );
  }
res.status(200).json({
  success: true,
  user
})
})


// Update User Profile Admin
exports.updateUserRole = catchError(async (req, res, next) => {


  const userData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }

  const user = await User.findByIdAndUpdate(req.params.id, userData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true
  });
});


// Delete User Profile Admin
exports.deleteUser = catchError(async (req, res, next) => {

  const user = await User.findById(req.params.id);

  if(!user){
    return next(
      new ErrorHandler(`User does not exist with id: ${req.params.id}`)
    );
  }

  await user.remove();

  res.status(400).json({
    success: true,
    message: "User Deleted Successfully"
  });
});