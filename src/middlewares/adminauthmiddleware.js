import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config.js';

const adminauthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Access denied: No token provided" });
    }

    const token = authHeader.split(' ')[1];
    // console.log(token)

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // console.log("Decoded Token:", decoded);

        if (!decoded.id) {
            return res.status(403).json({ message: "Invalid token: User ID missing" });
        }

        if (!(decoded.property == "admin")) {
            return res.status(403).json({ message: "Unauthorized action!" });
        }

        req.adminId = decoded.id;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

export { adminauthMiddleware };