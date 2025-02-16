import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Debugging log
        req.userId = decoded.id; // Use 'id' as per the token structure
        next();
    } catch (error) {
        console.log("Error in verifyToken middleware:", error);
        return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    }
};
