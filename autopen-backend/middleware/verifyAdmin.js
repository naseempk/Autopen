import authMiddleware from "./authMiddleware.js";

// This wrapper runs your existing auth middleware first, then checks for admin
export default function verifyAdminToken(req, res, next) {
  authMiddleware(req, res, () => {
    // Now check if the user is an admin (assuming you have a role or isAdmin flag)
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  });
}
