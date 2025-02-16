import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "1d", // Token valid for 1 day
    });

    res.cookie("token", token, {
        httpOnly: true, // Secure cookie
        secure: process.env.NODE_ENV === "production", // Only in HTTPS
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
};
