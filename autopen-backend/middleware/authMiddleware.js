import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔑 Decoded Token:", decoded); // Debugging line

        req.user = { userId: decoded.userId, email: decoded.email };
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token." });
    }
}

