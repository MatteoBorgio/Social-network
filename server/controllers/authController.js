/**
 * Controller for user verification and creation of the user profile
 * Includes the change password functionality and the verification code procedure
 */

const fs = require("fs").promises;
const {signupSchema, signinSchema, acceptCodeSchema, changePasswordSchema} = require("../middlewares/validator");
const User = require("../models/User")
const {doHash, doHashValidation, hmacProcess} = require("../utils/hashing");
const jwt = require('jsonwebtoken')
const transport = require("../middlewares/sendMail");

/**
 * Register a new user
 * Validate the user request and hashes the password before sending back the data
 * @returns {Object} Json response with the user data and the jwt token
 */
exports.signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        const {error} = signupSchema.validate({email, password, username})

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

        const token = jwt.sign(
            {
                userId: result._id,
                email: result.email,
                verified: result.verified || false
            },
            process.env.TOKEN_SECRET,
        );

        return res
            .status(201)
            .json({
                success: true,
                message: 'Your account has been created successfully',
                result,
                token: token
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

/**
 * Complete the user profile by adding a description and a profile picture
 * Requires and authenticated user
 * @returns {Object} Json response with the updated user data
 */
exports.createProfile = async (req, res) => {
    try {
        const {userId} = req.user;
        const {desc} = req.body;

        let profilePicPath = "";
        if (req.file) {
            profilePicPath = `uploads/profiles/${req.file.filename}`;
        }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    desc: desc,
                    profilePicture: profilePicPath,
                    isCompleted: true
                }
            },
            {new: true, runValidators: true}
        );

        if (!updateUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            result: updateUser,
            message: "User updated"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error has occurred",
            error: error
        });
    }
};

/**
 * Change the user profile picture using multer middleware
 * Requires and authenticated user
 * Use fs.unlink for the deletion of the old profile picture
 * @returns {Object} Json response with the updated user profile picture
 */
exports.changeProfilePic = async (req, res) => {
    try {
        const {userId} = req.user;

        let profilePicPath = "";
        if (req.file) {
            profilePicPath = `uploads/profiles/${req.file.filename}`;
        }

        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Utente non trovato."
                });
        }

        const oldProfilePic = user.profilePicture;

        if (oldProfilePic && oldProfilePic !== "") {
            try {
                // Per eliminare serve il percorso fisico assoluto
                const path = require('path');
                const absoluteOldPath = path.resolve(process.cwd(), oldProfilePic);
                await fs.unlink(absoluteOldPath);
                console.log('Vecchia foto eliminata con successo:', absoluteOldPath);
            } catch (err) {
                console.warn('Impossibile eliminare la vecchia foto, forse non esiste fisicamente:', err.message);
            }
        }

        user.profilePicture = profilePicPath;

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.verificationCode;
        delete userResponse.verificationCodeValidation;

        return res
            .status(200)
            .json({
                success: true,
                result: userResponse,
                newProfilePic: profilePicPath
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error has occurred",
            error: error
        });
    }
}

/**
 * Change the user bio
 * Requires and authenticated user
 * @returns {Object} Json response with the updated user bio
 */
exports.changeBio = async (req, res) => {
    try {
        const {userId} = req.user;

        const {desc} = req.body;

        if (!desc) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Descrizione non specificata nella richiesta"
                });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Utente non trovato."
                });
        }

        if (desc.length > 150) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "La descrizione eccede i 150 caratteri"
                })
        }

        user.desc = desc;
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.verificationCode;
        delete userResponse.verificationCodeValidation;

        return res
            .status(200)
            .json({
                success: true,
                result: userResponse
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error has occurred",
            error: error
        });
    }
}

/**
 * Change the username, with joi validation
 * Requires and authenticated user
 * @returns {Object} Json response with the updated username
 */
exports.changeUsername = async (req, res) => {
    try {
        const {userId} = req.user;

        const {username} = req.body;

        if (!username) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Username non specificato nella richiesta"
                });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Utente non trovato."
                });
        }

        // extracts username because signupSchema wants an email and a password
        const usernameValidation = signupSchema.extract('username');

        const { error } = usernameValidation.validate(username)
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }

        user.username = username;

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.verificationCode;
        delete userResponse.verificationCodeValidation;

        return res
            .status(200)
            .json({
                success: true,
                result: userResponse
            });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error has occurred",
            error: error
        });
    }
}

/**
 * Authenticates an existing user and set a jwt cookie
 * @returns {Object} Json response with token and user data
 */
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body

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
            expiresIn: '48h'
        })

        existingUser.password = undefined

        return res.cookie('Authorization', 'Bearer ' + token, {
            expires: new Date(Date.now() + 48 * 3600000),
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

/**
 * Generates a 6-digit verification code via mail, and save the hashed code in the database
 * @returns {Object} Json response with success or failure
 */
exports.sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

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
            // for security purpose, only the hmac hash of the code is saved
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

/**
 * Validates the verification code provided by the user
 * @returns {Object} Json response like the one in the signin functionality
 */
exports.verifyVerificationCode = async (req, res) => {
    try {
        const { email, providedCode } = req.body;

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

        // check if code has expired (5 minutes time limit)
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
                expiresIn: '48h'
            });

            existingUser.password = undefined;

            return res
                .cookie('Authorization', 'Bearer ' + token, {
                    expires: new Date(Date.now() + 48 * 3600000),
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
            message: "An error has occurred"
        });
    }
};

/**
 * Change user password
 * Requires the user to be authenticated and verified
 * Requires the user old password
 * @returns {Object} Json response with the data without the password
 */
exports.changePassword = async (req, res) => {
    try {
        const { userId } = req.user;
        const { oldPassword, newPassword } = req.body;

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
        res
            .status(500)
            .json({
                success: false,
                message: "An error has occured"
            });
    }
}

/**
 * Return the profile information for the authenticated user in the session
 * @returns {Object} Json response with basics user information (like email, id and username)
 */
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
