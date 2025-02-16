import { MailtrapClient } from "mailtrap";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrapConfig.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    console.log(email);

    // Properly declare the `recipient` variable
    const recipient = [
        { email: email }, // Ensure correct syntax
    ];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "EMAIL VERIFICATION",
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.log("Error sending email", error);

        // Throw a meaningful error message
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "20368b5d-0b2a-4e3a-b9d4-0691b75cc17e",
            template_variables: {
                name: name, // Include the recipient's name
                company_info_name: "Welcome to seamless connectivity",
            },
        });

        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.log("Error sending welcome email", error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
};

export const sendPasswordResetEmail = async (email, resetURL)  =>{
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL",resetURL),
            category: "PASSWORD RESET",
        })
    } catch (error) {
        console.log("Error sending Reset email", error);
        throw new Error(`Error sending Reset email: ${error.message}`);
    }
}

export const sendResetSuccessfullEmail = async (email) =>{
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            to:recipient,
            from:sender,
            subject:"Passwors Reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"        
        })
    } catch (error) {
        
    }
}