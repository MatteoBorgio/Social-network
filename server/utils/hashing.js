const {hash, compare} = require("bcryptjs");
const { createHmac } = require('node:crypto');

exports.doHash = (value, saltValue) => {
    return hash(value, saltValue)
}

exports.doHashValidation = (value, hashedValue) => {
    return compare(value, hashedValue)
}

exports.hmacProcess = (value, key) => {
    return createHmac('sha256', key)
        .update(value)
        .digest('hex')
}