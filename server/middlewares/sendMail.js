/**
 * Middleware for sending email to the user
 * Set up the transport and the sender mail
 */

const nodemailer = require('nodemailer')

/**
 * Create the transport route, set up the service (gmail)
 * Provides the email address of the sender
 * Provides the password of the sender
 *
 */
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD
    }
})

module.exports = transport