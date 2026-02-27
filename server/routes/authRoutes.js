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

router.put('/createProfile', identifier, upload.single('image'), authController.createProfile)

router.get("/me", identifier, authController.me);

module.exports = router