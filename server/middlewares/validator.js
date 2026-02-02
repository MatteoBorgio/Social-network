const joi = require('joi')

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
