const User = require('../models/User')
const {doHash, doHashValidation, hmacProcess} = require("../utils/hashing");
const {signupSchema} = require("../middlewares/validator");

exports.signup = async (req, res) => {
    const {email, password, username} = req.body
    try {
        const {error, value} = signupSchema.validate({email, password, username})

        if (error) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'Invalid credentials'
                })
        }

        const existingUser = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (existingUser) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'User already exist'
                })
        }

        const hashedPassword = await doHash(password, 12)

        const newUser = new User({
            email,
            username,
            password:hashedPassword
        })

        const result = await newUser.save();

        result.password = undefined;

        res
            .status(201)
            .json({
                success: true,
                message: 'Your account has been created successfully',
                result
            })
    }
    catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({
                success: false,
                message: 'Error while creating account'
            });
    }
}