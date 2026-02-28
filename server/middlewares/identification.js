const jwt = require('jsonwebtoken')

exports.identifier = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization;
    }
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