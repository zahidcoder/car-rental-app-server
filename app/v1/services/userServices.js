const sendActivationEmail = require("../../../helpers/email");
const { createJSONWebToken } = require("../../../helpers/jsonwebtoken");


// signin  serivcess
const userLogin = async ({ email, password, user }) => {

    try {
        const expiresInOneYear = 365 * 24 * 60 * 60; // seconds in 1 year
        const accessToken = createJSONWebToken({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, expiresInOneYear);
        console.log(accessToken);
        return accessToken;
    } catch (error) {
        console.error("Error in userLogin service:", error);
        throw new Error("Error occurred while logging in user");
    }
};
// forgot the password
// const forgotPasswordService = async (email, user) => {
//     try {
      
//         try {
//            const emailResult= await sendActivationEmail(email, user.name);
//             const oneTimeCode = emailResult.oneTimeCode;
//             user.oneTimeCode = oneTimeCode;

//             await user.save();

//         } catch (saveError) {
//             console.error('Failed to save oneTimeCode to user', saveError);
//             throw new Error('Error saving oneTimeCode to user');
//         }

//         const expiresInOneHour = 3600; // seconds in 1 hour
//         const accessToken = createJSONWebToken({ _id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, expiresInOneHour);
       
//         return {accessToken ,oneTimeCode};
//     } catch (error) {
//         console.error("Error in forgotPassword service:", error);
//         throw new Error("Error occurred while processing forgotPassword request");
//     }
// };


const clearOtpAfterOneMinute = (user) => {
    setTimeout(async () => {
        try {
            user.oneTimeCode = null; // Clear the OTP
            await user.save(); // Save the updated user data
            console.log("One-time code cleared after 1 minute");
        } catch (error) {
            console.error("Error clearing one-time code", error);
        }
    }, 3 * 60 * 1000); // 1 minute in milliseconds
};

// const forgotPasswordService = async (email, user) => {
//     try {
//         // Generate the one-time code
//         const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
//         console.log(oneTimeCode, "Generated one-time code for user");

//         // Send activation email
//         try {
//             await sendActivationEmail(email, user.name, oneTimeCode);
//             console.log("Activation email sent successfully");
//         } catch (emailError) {
//             console.error("Failed to send activation email", emailError);
//             throw new Error("Error sending activation email");
//         }

//         // Save the one-time code to the user
//         try {
//             user.oneTimeCode = oneTimeCode; // Assign generated OTP to the user
//             const users=await user.save(); // Save the updated user data
//             clearOtpAfterOneMinute(users)

//             console.log("One-time code saved to user record");
//         } catch (saveError) {
//             console.error("Failed to save one-time code to user", saveError);
//             throw new Error("Error saving one-time code to user");
//         }

//         // Generate JWT token with 1-hour expiration
//         const expiresInOneHour = 3600; // seconds
//         const accessToken = createJSONWebToken(
//             { _id: user._id, email: user.email },
//             process.env.JWT_SECRET_KEY,
//             expiresInOneHour
//         );

//         // Return the access token and the one-time code
//         return { accessToken, oneTimeCode };
//     } catch (error) {
//         console.error("Error in forgotPassword service:", error);
//         throw new Error("Error occurred while processing forgotPassword request");
//     }
// };


// change the password sercvice

const forgotPasswordService = async (email, user) => {
    try {
        // Generate the one-time code
        const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        console.log(oneTimeCode, "Generated one-time code for user");

        // Generate JWT token with 1-hour expiration (This can be done right away without waiting for email or database save)
        const expiresInOneHour = 3600; // seconds
        const accessToken = createJSONWebToken(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET_KEY,
            expiresInOneHour
        );

        // Run email sending and database save in parallel, without blocking the response cycle
        const emailJob = sendActivationEmail(email, user.name, oneTimeCode);
        const saveUserJob = (async () => {
            user.oneTimeCode = oneTimeCode; // Assign generated OTP to the user
            const updatedUser = await user.save(); // Save the updated user data
            clearOtpAfterOneMinute(updatedUser); // Clear OTP after 1 minute
            console.log("One-time code saved to user record");
        })();

        // Do not await email job, continue immediately with save user and respond to client
        await saveUserJob; // Make sure user save is done before responding
        console.log("One-time code saved");

        // Return the access token and the one-time code immediately
        // Email sending will continue in the background
        emailJob.catch((error) => {
            console.error("Error sending email", error); // Log the error but don't block the response
        });

        console.log("Activation email job initiated");
        
        return { accessToken, oneTimeCode }; // Respond immediately
    } catch (error) {
        console.error("Error in forgotPassword service:", error);
        throw new Error("Error occurred while processing forgotPassword request");
    }
};


const changePasswordService = async ({user, password}) => {
    console.log(user.password=password,"this is password")
    try {
        if(user){
           
            user.password = password;
            await user.save();
            return true;
        }
        else{
            throw new Error("Error occurred while changing password");
        }
    } catch (error) {
        console.error("Error in changePassword service:", error.message);
        throw new Error("Error occurred while changing password");
    }
}
module.exports={
    userLogin,
    forgotPasswordService,
    changePasswordService,
    clearOtpAfterOneMinute
}