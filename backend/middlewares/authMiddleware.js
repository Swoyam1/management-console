import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Check if token is provided
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied, no token provided" });
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user info to request
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
