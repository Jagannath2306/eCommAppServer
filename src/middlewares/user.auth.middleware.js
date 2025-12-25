const jwt = require('jsonwebtoken');
const { JWT_KEY } = process.env;

function userAuthMiddleware(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        let token = bearerToken.split(" ");
        const payload = jwt.verify(token[1], JWT_KEY);
        req.session = {
            user: payload
        }
        next();
    } catch (err) {
        res.status(401);
        return res.json({ success: false, message: "Invalid Token !!" });
    }
}

function customerAuthMiddleware(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        let token = bearerToken.split(" ");
        const payload = jwt.verify(token[1], JWT_KEY);
        req.session = {
            customer: payload
        } 
        if (payload.userTypeName === "Customer") {
            return next();
        }
        res.status(403);
        return res.json({ success: false, message: "You are not authorized to access !!" });
    } catch (err) {
        res.status(401);
        return res.json({ success: false, message: "Invalid Token !!" });
    }
}

function adminAuthMiddleware(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        let token = bearerToken.split(" ");
        const payload = jwt.verify(token[1], JWT_KEY);
        req.session = {
            user: payload
        }
        
        // Admin :-  userTypeId  1 
        if (payload.userTypeName === "admin") {
            return next();
        }
        res.status(403);
        return res.json({ success: false, message: "You are not authorized to access !!" });

    } catch (err) {
        res.status(401);
        return res.json({ success: false, message: "Invalid Token !!" });
    }
}

module.exports = { userAuthMiddleware, adminAuthMiddleware, customerAuthMiddleware }  