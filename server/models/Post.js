const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: {
        type: String,
        require: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        require: [true, 'Description is required'],
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'UserId is required'],
    }

},{
    timestamps: true
});

module.exports = mongoose.model('Posts', postSchema)