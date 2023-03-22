const express = require('express');
const { newOrder, getOrderDetails, myOrders, updateOrderStatus, deleteOrders, deleteOrder, getAllOrders } = require('../controllers/orderController');
const router = express.Router();
const { isAuthenticatedUser, authRoles} = require('../middleware/auth');

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getOrderDetails);
router.route('/my_orders').get(isAuthenticatedUser, myOrders);
router.route('/admin/orders').get(isAuthenticatedUser, authRoles('admin'), getAllOrders);
router.route('/admin/order/:id').put(isAuthenticatedUser, authRoles('admin'), updateOrderStatus);
router.route('/admin/order/:id').delete(isAuthenticatedUser, authRoles('admin'), deleteOrder);


module.exports = router;