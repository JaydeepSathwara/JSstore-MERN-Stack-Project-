const productModel = require("../models/productModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchError = require('../middleware/catchError'); //Catching Async Errors
const ProductGetFeatures = require("../utils/productGetFeatures");

// Create Product (Only Admin Can Access)
exports.createProduct = catchError(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

// Get All The Products
exports.getAllProducts = catchError(async (req, res) => {
    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    //If product is search with keyword
    if (req.query.keyword) {
        products = await Product.find({ name: { $regex: req.query.keyword, $options: 'i' } });
    } else {
        const productGetFeatures = new ProductGetFeatures(Product.find(), req.query).filter().pagination(resultPerPage);
        products = await productGetFeatures.query;
    }
    const filterProductLength = products.length;

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filterProductLength
    })
})

// Update Product (Only Admin Can Access)
exports.updateProduct = catchError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product Not Found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(201).json({
        success: true,
        product
    })
})

exports.deleteProduct = catchError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 400));
    }

    await product.remove();

    res.status(201).json({
        success: true,
        message: "Product Deleted Successfully"
    })
})

exports.getProductDetails = catchError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product Not Found"
        })
    }

    res.status(201).json({
        success: true,
        product
    })
})

// Create User Review Or Update Old review

exports.createProductReview = catchError(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(req.rating),
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if ((rev) => rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    // Avg = Average rating of that perticular product
    let avg = 0;
    
    product.reviews.forEach(rev => {
        avg += rev.ratings;
    })
    
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })
})

// Get Product Review
exports.getReview = catchError(async (req, res, next) => {
    let product = Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product Not Found', 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete Product Review
exports.deleteReview = catchError(async (req, res, next) => {
    let product = Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product Not Found', 404));
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() != req.query.id.toString());


    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    })

    const rating = avg / reviews.length;

    const numOfReviews = reviews.length();

    await Product.findByIdAndUpdate(req.query.productId,
    {
        reviews,
        ratings,
        numOfReviews
    },
    {
        new: true,
        runValidators: false,
        useFindAndModify: false
    }    
    );

    res.status(200).json({
        success: true
    })
})