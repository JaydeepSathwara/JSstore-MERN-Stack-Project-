const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please Enter Product Name!"]
    },
    description: {
        type: String,
        require: [true, "Please Enter Product Description!"]
    },
    price: {
        type: Number,
        require: [true, "Please Enter Product Price!"],
        maxLength: [8, "Price Cannot Exceed 8 Characters"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                require: true
            },
            url: {
                type: String,
                require: true
            }
        }
    ],
    category: {
        type: String,
        require: [true, "Please Enter Product Category!"]
    },
    stock: {
        type: Number,
        require: [true, "Please Enter Product Stock"],
        maxLength: [4, "Stock Cannot Exceed 4 Characters"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Product", productSchema);