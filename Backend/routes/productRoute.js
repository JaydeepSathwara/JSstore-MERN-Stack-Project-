const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getReview, deleteReview } = require('../controllers/productController');
const { isAuthenticatedUser, authRoles} = require('../middleware/auth');
const { create } = require('../models/userModel');
const router = express.Router();

router.route('/products').get(getAllProducts);
router.route('/admin/products/new').post(isAuthenticatedUser, authRoles("admin"), createProduct);
router.route('/admin/products/:id').put(isAuthenticatedUser, authRoles("admin"), updateProduct);
router.route('/admin/products/:id').delete(isAuthenticatedUser, authRoles("admin"), deleteProduct);
router.route('/products/:id').get(getProductDetails);
router.route('/review').put(isAuthenticatedUser, createProductReview);
router.route('/reviews').get(getReview);
router.route('/reviews').delete(isAuthenticatedUser, deleteReview);

module.exports = router;