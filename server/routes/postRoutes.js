/**
 * Container for all the routes inherent to the management of posts
 * Includes the routes for getting all the posts, creating a post,
 * and like or remove like from a post
 */

const express = require('express')
const postController = require('../controllers/postController')
const { identifier } = require('../middlewares/identification')
const router = express.Router()
const upload = require("../middlewares/multer")

router.get('/get-all-posts', postController.getPosts)
router.get('/get-my-posts', identifier, postController.getMyPosts)

router.post('/create', identifier, upload.single('image'), postController.createPost)
router.put('/:id/like', identifier, postController.likePost)

module.exports = router
