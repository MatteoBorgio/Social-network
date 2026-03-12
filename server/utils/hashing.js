/**
 * Utils for the hash of the passwords using bcrypt
 */

const {hash, compare} = require("bcryptjs");
const { createHmac } = require('node:crypto');

/**
 * Function for hashing a value
 * Returns a promise that resolves to the hashed string in Modular Crypt Format.
 */
exports.doHash = (value, saltValue) => {
    return hash(value, saltValue)
}

/**
 * Function for validate a value to and hashed one
 * Returns a promise that resolves to true if the values match, false otherwise
 */
exports.doHashValidation = (value, hashedValue) => {
    return compare(value, hashedValue)
}

/**
 * Function for generating a hmac for a given value using a secret key
 */
exports.hmacProcess = (value, key) => {
    return createHmac('sha256', key)
        .update(value)
        .digest('hex')
}