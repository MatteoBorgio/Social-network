const express = require('express')
const postController = require('../controllers/postController')
const { identifier } = require('../middlewares/identification')
const router = express.Router()
const upload = require("../middlewares/multer")

router.get('/get-all-posts', identifier, postController.getPosts)

router.post('/create', identifier, upload.single('image'), postController.createPost)
router.put('/:id/like', identifier, postController.likePost)

module.exports = router