/**
 * Container for all the routes inherent to the auth
 * Includes the routes for the signup, signin,
 * verification code functionality, change password
 * functionality, and create profile functionality
 * Manage the middlewares for uploading and identify user
 */

const express = require('express')
const authController = require('../controllers/authController')
const {identifier} = require("../middlewares/identification");
const router = express.Router()
const upload = require("../middlewares/multer")

router.post('/signup', authController.signup)
router.post('/signin', authController.signin)

router.patch('/send-verification-code', authController.sendVerificationCode)
router.patch('/verify-verification-code', authController.verifyVerificationCode)
router.patch('/change-password', identifier, authController.changePassword)
router.patch('/change-profile-pic', identifier, upload.single('image'), authController.changeProfilePic)

router.put('/createProfile', identifier, upload.single('image'), authController.createProfile)

router.get("/me", identifier, authController.me);

module.exports = router