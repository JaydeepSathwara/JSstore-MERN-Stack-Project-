const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authRoles} = require('../middleware/auth');
const {registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getUser, updateUserRole, deleteUser} = require('../controllers/userController');

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);
router.route("/profile").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/profile/update").put(isAuthenticatedUser, updateProfile);
router.route("/admin/users").get(isAuthenticatedUser, authRoles('admin'),getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedUser, authRoles('admin'), getUser);
router.route("/admin/user/:id").put(isAuthenticatedUser, authRoles('admin'), updateUserRole);
router.route("/admin/user/:id").delete(isAuthenticatedUser, authRoles('admin'), deleteUser);

module.exports = router;