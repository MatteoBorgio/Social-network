const express = require('express')
const postController = require('../controllers/postController')
const { identifier } = require('../middlewares/identification')
const router = express.Router()

router.get('/get-all-posts', identifier, postController.getPosts)

router.post('/', identifier, postController.createPost)
router.put('/:id/like', identifier, postController.likePost)

module.exports = router