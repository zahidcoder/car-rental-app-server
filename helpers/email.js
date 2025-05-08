const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

// Log server connection info
transporter.verify((error, success) => {
    if (error) {
        console.error("Error connecting to email server:", error);
    } else {
        console.log("Email server is ready to send messages.");
    }
});

// const transporter = nodemailer.createTransport({
//     host: 'smtp.hostinger.com',            // Hostinger SMTP server
//     port: 587,                            // Port (587 for TLS, 465 for SSL)
//     secure: true,                        // false for TLS, true for SSL
//     auth: {
//         user: process.env.SMTP_USERNAME,       // Your Hostinger email address
//         pass: process.env.SMTP_PASSWORD       // Your email password
//     }
// });

const emailWithNodemailer = async (emailData) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USERNAME, // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            html: emailData.html, // html body
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent %s", info.response);
        return { success: true };
    } catch (error) {
        console.error('Error sending mail', error);
        throw error;
    }
};

const generateOneTimeCode = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
};

const prepareEmailData = (email, name, oneTimeCode) => {

    return {
        email,
        subject: 'Account Activation Email',
        html: `
        <div style="padding: 20px; font-family: Arial, sans-serif; text-align: center; background: #f4f4f4; min-height: 100vh;">
            <div style="background: #007bff; padding: 30px; border-radius: 10px; display: inline-block; max-width: 500px; width: 100%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <h1 style="font-size: 2.2em; color: #ffffff; margin-bottom: 10px;">Hello, ${name}</h1>
                <p style="font-size: 1.2em; color: #ffffff; margin-bottom: 20px;">Your One-Time Code is:</p>
                <h3 style="font-size: 2.5em; color: #ffffff; background: #0056b3; padding: 15px; border-radius: 5px; display: inline-block;">${oneTimeCode}</h3>
                <p style="font-size: 1em; color: #ffffff; margin-top: 20px;">This code is valid for <strong>3 minutes</strong>.</p>
                <hr style="border: 1px solid #ffffff; margin: 20px 0;">
                <small style="font-size: 0.9em; color:#ffffff;">If you didn't request this, please ignore this email.</small>
            </div>
        </div>
        `
    };
};


const sendActivationEmail = async (email, name, oneTimeCode) => {
    
    // const oneTimeCode = generateOneTimeCode();
    console.log(oneTimeCode,"-------------------send email")
    const emailData = prepareEmailData(email, name, oneTimeCode);

    const result = await emailWithNodemailer(emailData);
    // await user.save();

    if (result.success) {
        return { success: true, message: "Thanks! Please check your E-mail to verify.", oneTimeCode };
        // await user.save();

    } else {
        return { success: false, error: result.error };
    }
};

module.exports = sendActivationEmail;
