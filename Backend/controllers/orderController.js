const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchError = require('../middleware/catchError');


exports.newOrder = catchError(async (req, res, next) => {
    const { ShippingInfo, paymentInfo, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        ShippingInfo,
        paymentInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(201).json({
        success: true,
        order
    })
})


// Get Order Deatils

exports.getOrderDetails = catchError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    // Using populate we can use user id from order table to get name and email
    // of user from user table

    if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
    }
    res.status(200).json({
        success: true,
        order
    })
})

// Get Logged in user Order Deatils

exports.myOrders = catchError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    })
})

// Get All Orders --Admin

exports.getAllOrders = catchError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// Update Order Status --Admin

exports.updateOrderStatus = catchError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Not Found", 400));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    order.orderItems.forEach(async o => {
        await updateStock(o.product, o.quantity);
    })

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt == Date.now();
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        order
    })
})

async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({validateBeforeSave: false});
}

// Delete Order --Admin

exports.deleteOrder = catchError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    await order.remove();

    if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
    }

    res.status(200).json({
        success: true
    })
})