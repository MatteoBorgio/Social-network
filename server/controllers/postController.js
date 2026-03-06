const Post = require('../models/Post')

exports.createPost = async (req, res) => {
    console.log("Dati utente dal token:", req.user)

    const { title, description } = req.body

    let imagePath = null;
    if (req.file) {
        imagePath = req.file.path;
    }

    try {
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
            error: error.message
        })
    }
}

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('user', 'username email profilePicture');
        return res.status(200).json({
            success: true,
            results: posts
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error
        })
    }
}

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
            error: error.message
        })
    }
}

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
            error: error.message
        })
    }
}