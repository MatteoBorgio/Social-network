const {signupSchema, signinSchema, acceptCodeSchema, changePasswordSchema} = require("../middlewares/validator");
const User = require("../models/User")
const {doHash, doHashValidation, hmacProcess} = require("../utils/hashing");
const jwt = require('jsonwebtoken')
const transport = require("../middlewares/sendMail");

exports.signup = async (req, res) => {
    const {email, password, username} = req.body;
    try {
        const {error, value} = signupSchema.validate({email, password, username})

        if (error) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: error.details[0].message
                })
        }

        const existingUser = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        })

        if (existingUser) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'User already exists'
                })
        }

        const hashedPassword = await doHash(password, 12)

        const newUser = new User({
            email,
            username,
            password: hashedPassword
        })

        const result = await newUser.save();
        result.password = undefined;

        return res
            .status(201)
            .json({
                success: true,
                message: 'Your account has been created successfully',
                result
            })
    }
    catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({
                success: false,
                message: "An error has occurred"
            })
    }
}

exports.signin = async (req, res) => {
    const { email, password } = req.body
    try {
        const { error } = signinSchema.validate({ email, password })
        if (error) {
            return res.status(401).json({
                success: false,
                message: error.details[0].message
            })
        }

        const existingUser = await User.findOne({ email }).select('+password')
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User doesn\'t exist'
            })
        }

        const isValidPassword = await doHashValidation(password, existingUser.password)
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credential'
            })
        }

        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified
        }, process.env.TOKEN_SECRET, {
            expiresIn: '8h'
        })

        existingUser.password = undefined

        return res.cookie('Authorization', 'Bearer ' + token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production'
        }).json({
            success: true,
            token,
            message: 'Logged in successfully',
            result: existingUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "An error has occurred"
        })
    }
}

exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User doesn\'t exist'
            });
        }

        const codeValue = Math.floor(Math.random() * 1000000).toString();

        let info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: existingUser.email,
            subject: 'Verification Code',
            html: '<h1>' + codeValue + '</h1>'
        });

        if (info.accepted[0] === existingUser.email) {
            existingUser.verificationCode = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
            existingUser.verificationCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({
                success: true,
                message: 'Code sent!'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Code sent failed!'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error has occurred"
        });
    }
};

exports.verifyVerificationCode = async (req, res) => {
    const { email, providedCode } = req.body;
    try {
        const { error, value } = acceptCodeSchema.validate({ email, providedCode });
        if (error) {
            return res.status(401).json({
                success: false,
                message: error.details[0].message
            });
        }

        const codeValue = providedCode.toString();
        const existingUser = await User.findOne({ email }).select("+verificationCode +verificationCodeValidation");

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User doesn\'t exist'
            });
        }

        if (!existingUser.verificationCode || !existingUser.verificationCodeValidation) {
            return res.status(400).json({
                success: false,
                message: 'Something\'s wrong with the code'
            });
        }

        if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
            return res.status(401).json({
                success: false,
                message: 'Code has expired'
            });
        }

        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

        if (hashedCodeValue === existingUser.verificationCode) {
            existingUser.verified = true;
            existingUser.verificationCode = undefined;
            existingUser.verificationCodeValidation = undefined;
            await existingUser.save();

            const token = jwt.sign({
                userId: existingUser._id,
                email: existingUser.email,
                verified: existingUser.verified
            }, process.env.TOKEN_SECRET, {
                expiresIn: '8h'
            });

            existingUser.password = undefined;

            return res
                .cookie('Authorization', 'Bearer ' + token, {
                    expires: new Date(Date.now() + 8 * 3600000),
                    httpOnly: process.env.NODE_ENV === 'production',
                    secure: process.env.NODE_ENV === 'production'
                })
                .status(200)
                .json({
                    success: true,
                    token,
                    message: 'Verification and Login successful',
                    result: existingUser
                });
        }

        return res.status(400).json({
            success: false,
            message: 'Invalid Code'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error has occured"
        });
    }
};

exports.changePassword = async (req, res) => {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;

    try {
        const { error } = changePasswordSchema.validate({ oldPassword, newPassword });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ _id: userId }).select('+password');

        if (!existingUser) {
            return res.status(401).json({ success: false, message: 'User doesn\'t exist' });
        }

        if (!existingUser.verified) {
            return res.status(401).json({
                success: false,
                message: "You are not verified!"
            });
        }

        const result = await doHashValidation(oldPassword, existingUser.password);

        if (!result) {
            return res.status(401).json({ success: false, message: 'Invalid credential' });
        }

        existingUser.password = await doHash(newPassword, 12);
        await existingUser.save();

        const userResponse = existingUser.toObject()
        delete userResponse.password

        return res.status(200).json({
            success: true,
            message: 'Password updated',
            updatedUser: userResponse
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "An error has occured" });
    }
}

exports.me = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId).select(
            "_id email username verified"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error has occurred"
        });
    }
};