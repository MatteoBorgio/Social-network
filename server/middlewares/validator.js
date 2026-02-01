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
