const { Schema, model} = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username must be unique'],
        minLength: [5, 'Username must have at least 5 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
        minLength: [5, 'Email must have at least 5 characters'],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password must be provided'],
        select: false,
        trim: true
    },
    followers: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    followings: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    profilePicture: {
        type: String
    },
    coverPicture: {
        type: String
    },
    desc: {
        type: String
    },
    city: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    verifiedAt: {
        type: Date
    },
    verificationCode: {
        type: String,
        select: false
    },
    verificationCodeValidation: {
        type: Number,
        select: false
    },
    forgotPasswordCode: {
        type: String,
        select: false
    },
    forgotPasswordValidation: {
        type: Number,
        select: false
    }
},{
    timestamps: true
});

module.exports = model('User', userSchema)