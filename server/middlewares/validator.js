/**
 * Middleware for the validation of the data using joi
 * before storing them in the database
 */

const joi = require('joi')

/**
 * Schema for the validation of the user data for the signup
 */
exports.signupSchema = joi.object({
    email: joi
        .string()
        .min(5)
        .max(50)
        .required()
        .email({
            tlds: {allow: ['com', 'net']}
    }),
    password: joi
        .string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')),
    username: joi
        .string()
        .required()
        .min(5)
        .max(50)
})

/**
 * Schema for validation of the user data for the login
 */
exports.signinSchema = joi.object({
    email: joi
        .string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds: {allow: ['com', 'net']}
        }),
    password: joi
        .string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'))
})

/**
 * Schema for the validation of the verification code data
 */
exports.acceptCodeSchema = joi.object({
        email: joi
            .string()
            .min(6)
            .max(60)
            .required()
            .email({
                tlds: {allow: ['com', 'net']}
            }),
        providedCode: joi
            .number()
            .required()
    }
)

/**
 * Schema for the validation of the passwords provided
 * for the change password functionality
 */
exports.changePasswordSchema = joi.object({
    newPassword: joi
        .string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')),
    oldPassword: joi
        .string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'))
})