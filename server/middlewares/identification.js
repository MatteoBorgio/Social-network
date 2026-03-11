/**
 * Middleware for web token authentication using JWT
 * Verify token extracted from header 'Authorization' (Bearer)
 * or from cookie. If it's valid, add the user data in the request
 */

const jwt = require('jsonwebtoken')

/**
 * JWT Identification Middleware
 * This function checks for a valid web token in the authorization headers or cookies
 * If verified against the TOKEN_SECRET in the env file, the user identity is added to req.user
 * otherwise, it terminates the request with a 401 Unauthorized status
 * @returns {Object} 401 response if unauthorized, otherwise call next()
 */
exports.identifier = (req, res, next) => {
    let token;

    // search in the header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization;
    }
    // otherwise search in the cookies authorization
    else if (req.cookies && req.cookies['Authorization']) {
        token = req.cookies['Authorization'];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    try {
        const userToken = token.includes(' ') ? token.split(' ')[1] : token;

        const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);

        if (jwtVerified) {
            req.user = jwtVerified;
            next();
        } else {
            throw new Error('Error in the token');
        }
    } catch (error) {
        console.log("Errore JWT:", error.message);
        return res.status(401).json({
            success: false,
            message: "Token non valido o scaduto"
        });
    }
}