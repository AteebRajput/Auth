import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto"
import {  generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail , sendPasswordResetEmail, sendResetSuccessfullEmail} from "../mailtrap/email.js";


export const signupController = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Generate verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiry
        });

        // Save user to the database
        await user.save();

        // Generate and set JWT token in cookies
        generateTokenAndSetCookie(res, user._id);
        console.log("Email",user.email);
        

        await sendVerificationEmail(user.email,verificationToken)

        // Respond with user data (excluding password)
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined, // Exclude the password from response
            },
        });
    } catch (error) {
        // Handle errors
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        // Find user with the verification token that hasn't expired
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpireAt: { $gt: Date.now() },
        });

        // If no user is found, send an error response
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired code" });
        }

        // Mark the user as verified and remove the verification token
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;

        // Save updated user
        await user.save();

        // Send a welcome email
        await sendWelcomeEmail(user.email, user.name);

        // Send a success response
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined, // Exclude password from the response
            },
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ success: false, message: error.message });
    }
};


export const loginController = async (req, res) => {
    const {email,password} = req.body
    try {
        const response = await User.findOne({
            email
        })
        if(!response){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        const isPasswordValid = await bcryptjs.compare(password,response.password)
        if(!isPasswordValid){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        generateTokenAndSetCookie(res,response._id)
        response.lastLogin = Date.now()

        await response.save()

        res.json({
            success:true,
            message:"Login Successfull",
            user:{
                ...response._doc,
                password:undefined  
            }
        })

    } catch (error) {
        console.log("Invalid email or password",error);
        throw new Error(`Invalid email or password ${error}`)
        
    }
};

export const logoutController = async (req, res) => {
    res.clearCookie("token")
    res.status(201).json({success:true,message:"Logout Successfully"})
};

export const forgotPassword = async (req,res) =>{
    const {email} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken
        user.resetPasswordExpireAt = resetTokenExpireAt

        await user.save()
        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({success:true,message:"Reset password link is sent to your email"})
    } catch (error) {
        console.log("Error sending Reset email", error);
        throw new Error(`Error sending Reset email: ${error.message}`);
    }
}

export const resetPassword = async (req,res) =>{
    const {password} = req.body
    const {token} = req.params;
    try {
        const user = await User.findOne({
            resetPasswordExpireAt:token,
            resetPasswordExpireAt: {$gt: Date.now()}
        })
        if(!user){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        const hashedPassword = await bcryptjs.hash(password,10)
        user.resetPasswordToken = undefined
        user.resetPasswordExpireAt = undefined

        await user.save()

        await sendResetSuccessfullEmail(user.email)

        res.status(201).json({success:true,message:"Password Reset Successfully"})

    } catch (error) {
        console.log("Error while Reseting Password", error);
        throw new Error(`Error while Reseting Password: ${error.message}`);
    }
}


export const checkAuth = async (req, res) => {
    try {
        console.log("User ID in request:", req.userId); // Debugging log
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" }); // 404 for not found
        }
        res.status(200).json({ success: true, user }); // 200 OK
    } catch (error) {
        console.error("Error in checkAuth:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
