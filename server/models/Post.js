/**
 * Model for the definition of the characteristic
 * of a post object in the mongoDB database
 */

const {Schema, model} = require('mongoose')

const postSchema = new Schema({
    title: {
        type: String,
        require: [true, 'Title is required'],
        trim: true,
    },
    image: {
      type: String,
      require: [true, 'Image url is required']
    },
    description: {
        type: String,
        trim: true,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'UserId is required'],
    }

},{
    timestamps: true
});

module.exports = model('Posts', postSchema)