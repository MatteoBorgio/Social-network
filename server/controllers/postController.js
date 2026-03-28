/**
 * Controller for the upload and delete of posts
 * Includes create and delete post functionality
 * Includes the like toggle functionality
 */

const Post = require('../models/Post')

/**
 * Save a new post in the database
 * Require a valid userId
 * @returns {Object} Json response with the post information
 */
exports.createPost = async (req, res) => {
    try {
        console.log("Dati utente dal token:", req.user)

        const { title, description } = req.body;

        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path;
        }

        const newPost = new Post({
            title,
            image: imagePath,
            description,
            user: req.user.userId
        })

        const savedPost = await newPost.save()

        await savedPost.populate('user', 'username email profilePicture')

        return res.status(200).json({
            success: true,
            result: savedPost
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message || error
        })
    }
}

/**
 * Get all the post in the database
 * @returns {Object} Json response with the object which contains all the information
 * about the posts
 */
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('user', 'username email profilePicture');

        if (!posts) {
            return res.status(404).json({
                success: false,
                error: "Risorsa non trovata"
            })
        }
        return res.status(200).json({
            success: true,
            results: posts
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message || error
        })
    }
}


/**
 * Get all the posts of a specific user
 * @returns {Object} Json response with the object which contains all the information
 * about the user posts
 */
exports.getMyPosts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const myPosts = await Post.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('user', 'username email profilePicture');
        return res.status(200).json({
            success: true,
            results: myPosts
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message || error
        })
    }
}

/**
 * Add a like in a post, push the userId in the post likes in the database
 * Requires a valid userId
 * @returns {Object} Json response with a success or fail message
 */
exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user.userId

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post non trovato"
            })
        }

        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } })
            return res.status(200).json({
                success: true,
                message: "Post aggiunto ai piaciuti"
            })
        } else {
            await post.updateOne({ $pull: { likes: userId } })
            return res.status(200).json({
                success: true,
                message: "Like rimosso"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || error
        })
    }
}

/**
 * Delete a post
 * Requires the userId of the owner of the post
 * @returns {Object} Json response with a success or fail message
 */
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user.userId

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post non trovato"
            })
        }
        if (post.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Non sei autorizzato a cancellare questo post"
            })
        }

        await Post.findByIdAndDelete(postId)

        return res.status(200).json({
            success: true,
            message: "Post eliminato con successo"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || error
        })
    }
}
