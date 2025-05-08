const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Response = require("../../../helpers/respones");
const sendActivationEmail = require("../../../helpers/email");
const { createJSONWebToken } = require("../../../helpers/jsonwebtoken");
const { forgotPasswordService, changePasswordService, userLogin, clearOtpAfterOneMinute } = require("../services/userServices");


// signup 


const signUp = async (req, res, next) => {
    try {
        const { name, email, password, role, agencyId, fcmToken, city } = req.body;

        // Check if fcmToken is missing
        if (!fcmToken) {
            return res.status(400).json(Response({
                message: "fcm-token is required",
                status: "Bad Request",
                statusCode: 400,
                type: "Validation"
            }));
        }

        // Check if the user already exists
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(409).json(Response({
                message: "User Already Exists",
                statusCode: 409,
                status: "Conflict",
                type: "Auth"
            }));
        }

        // Generate one-time code for email verification
        const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        // Create a new user instance
        const newUser = new User({
            name, email, password, oneTimeCode, role, city, agencyId, fcmToken
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Send activation email asynchronously (in background)
        sendActivationEmail(email, name, oneTimeCode).catch((error) => {
            console.error('Error sending activation email:', error);
        });

        // Set a timeout to nullify the one-time code after 3 minutes
        setTimeout(async () => {
            try {
                savedUser.oneTimeCode = null;
                await savedUser.save();
                console.log('oneTimeCode reset to null after 3 minutes');
            } catch (error) {
                console.error('Error updating oneTimeCode:', error);
            }
        }, 180000); // 3 minutes in milliseconds

        // Respond with a success message
        return res.status(200).json(Response({
            message: "User created successfully. Please check your email for the verification code.",
            statusCode: 200,
            status: "Success",
            data: savedUser,
            type: role
        }));
    } catch (error) {
        next(error);
    }
};


// const signUp = async (req, res, next) => {
//     try {
//         const { name, email, password, role, agencyId, fcmToken, city } = req.body;
//         console.log(password);
//         console.log(fcmToken, "fcm-token");

//         // Check if fcmToken is missing
//         if (!fcmToken) {
//             return res.status(400).json(Response({ message: "fcm-token is required", status: "Bad Request", statusCode: 400, type: "Validation" }));
//         }

//         // Check if the user already exists
//         const userExist = await User.findOne({ email: email });
//         if (userExist) {
//             return res.status(409).json(Response({
//                 message: "User Already Exist",
//                 statusCode: 409,
//                 status: "Conflict",
//                 type: "Auth"
//             }));
//         }

//         // Generate one-time code for the user
//         const oneTimeCode = generateOneTimeCode();

//         // Create a new user instance
//         const newUser = new User({ name, email, password, role, city, oneTimeCode, agencyId, fcmToken });

//         // Save the new user and get the result asynchronously
//         const savedUser = await newUser.save();

//         // Send the activation email asynchronously (does not block the response)
//         sendActivationEmail(email, name).catch((err) => {
//             console.error('Error sending activation email:', err);
//         });

//         // Set a timeout to update the oneTimeCode to null after 3 minutes
//         setTimeout(async () => {
//             try {
//                 savedUser.oneTimeCode = null;
//                 await savedUser.save();
//                 console.log('oneTimeCode reset to null after 3 minutes');
//             } catch (error) {
//                 console.error('Error updating oneTimeCode:', error);
//             }
//         }, 180000); // 3 minutes in milliseconds

//         // Respond with a success message and the saved user data
//         return res.status(200).json(Response({
//             message: "User created successfully. Activation email sent.",
//             statusCode: 200,
//             status: "Success",
//             data: savedUser,
//             type: role
//         }));
//     } catch (error) {
//         next(error);
//     }
// };


//verify code
const verifyCode = async (req, res,next) => {
    try {
        const { code, email } = req.body;

        // Check if email or code is missing
        if (!email || !code) {
            return res.status(400).json(Response({ message: "Email and code are required", status: "Bad Request", statusCode: 400, type: "Validation" }));
        }

        console.log(code, email);
        const user = await User.findOne({ email: email });

       
 

        // Check if user exists
        if (!user) {
            return res.status(404).json(Response({ message: "User not found", status: "Not Found", statusCode: 404, type: "User" }));
        }

        console.log(user.oneTimeCode);
        // Check if one-time code is null
        if (!user.oneTimeCode) {
            return res.status(400).json(Response({ message: "One-time code is null, please generate a new code", status: "Bad Request", statusCode: 400, type: "Validation" }));
        }

        // Check if provided code matches the user's one-time code
        if (user.oneTimeCode !== code) {
            return res.status(400).json(Response({ message: "Incorrect verification code", status: "Bad Request", statusCode: 400, type: "Validation" }));
        }

        // If code is correct, mark user as verified and clear one-time code
        user.isVerified = true;
        user.oneTimeCode = null;
        await user.save(); // Remember to await save()
          // Generate JWT token for the user
          const expiresInOneYear = 365 * 24 * 60 * 60; // seconds in 1 year
          const accessToken = createJSONWebToken({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, expiresInOneYear);
          console.log(accessToken);

        // Respond with success message
        res.status(200).json(Response({ message: "User verified successfully", status: "OK", statusCode: 200, type: "User",token:accessToken }));

    } catch (error) {
       next(error)
    }
};


//Sign in user
const signIn = async (req, res, next) => {
    try {
        // Get email and password from req.body
        const { email, password,fcmToken } = req.body;
        console.log("--------Meow", email)
       

        // Find the user by email
        const user = await User.findOne({ email });
        console.log("-------------->>>>>", user)
        console.log(user);

        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        if(user.isVerified === false){
 return res.status(401).json(Response({statusCode:401, message:'you are not veryfied',status:'Failed'}))
        }

        // Check if the user is banned
        if (user.isBlocked) {
            return res.status(404).json(Response({ statusCode: 404, message: 'sorry your account  blocked', status: "Failed" }));
        }
           
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("---------------", isPasswordValid)

        if (!isPasswordValid) {
           return res.status(401).json(Response({ statusCode: 401, message: 'Invalid password', status: "Failed" }));
        }

        // Call userLogin service function
        const accessToken = await userLogin({ email, password, user });
        
      // Update the user's isLoggedIn status to true
      await User.updateOne({ _id: user._id }, { fcmToken:fcmToken,isLoggedIn: true });

        //Success response
        res.status(200).json(Response({ statusCode: 200, message: 'Authentication successful', status: "OK", data: user, token: accessToken, }));

    } catch (error) {
     
        next(error)
    }
};
// resend otp


const resendOtp = async (req, res, next) => {
    try {
      // Extract email from request body
      const { email } = req.body;
  
      // Validate email
      if (!email) {
        return res.status(400).json(Response({
          message: 'Email is required',
          statusCode: 400,
          status: 'failed'
        }));
      }
  
      // Find user by email
      const user = await User.findOne({ email });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json(Response({
          message: 'User not found',
          statusCode: 404,
          status: 'failed'
        }));
      }
  
      // If OTP is expired or missing, generate a new one
      if (!user.oneTimeCode || user.oneTimeCode===null) {
        // Generate a new OTP
        const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  
        // Update the user with the new OTP and expiration time (1 minute expiry)
        user.oneTimeCode = oneTimeCode;
        // user.oneTimeCodeExpiry = Date.now() + 60000; // OTP expires in 1 minute
  
        // Save the updated user data
        await user.save();
  
        // Send the activation email with the new OTP
        sendActivationEmail(email, user.name, oneTimeCode).catch((error) => {
          console.error('Error sending activation email:', error);
        });
  
        // Reset OTP after 1 minute
        setTimeout(async () => {
          try {
            user.oneTimeCode = null;
            await user.save();
            console.log('oneTimeCode reset to null after 1 minute');
          } catch (error) {
            console.error('Error updating oneTimeCode:', error);
          }
        }, 180000); // 1 minute in milliseconds
  
        return res.status(200).json(Response({
          message: 'OTP has been resent successfully. Please check your email.',
          statusCode: 200,
          status: 'success',
          data: { user }
        }));
      } else {
        // If OTP is still valid, inform the user that OTP is already active
        return res.status(400).json(Response({
          message: 'You already have a valid OTP. Please check your email.',
          statusCode: 400,
          status: 'sucess'
        }));
      }
    } catch (error) {
      next(error);
    }
  };
  


// forget password
const forgotPassword = async (req, res,next) => {
    try {
        const { email } = req.body;
       
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

      const users=  await forgotPasswordService(email, user);
      console.log(users);
        res.status(200).json(Response({ statusCode: 200, message: 'A verification code is sent to your email', status: "OK" ,data:users}));

    } catch (error) {
        next(error)
    }
};

// change your password after forget the password
const cahngePassword = async (req, res,next) => {
    try {
        const email=req.user.email
        const {  password } = req.body;
        

        const user = await User.findOne({ email });
        
        if (!email) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Email is required', status: "Failed" }));
        }
        if (!password) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Password is required', status: "Failed" }));
        }

        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        await changePasswordService({ user, password });

        res.status(200).json(Response({ statusCode: 200, message: 'Password changed successfully', status: "OK" }));

    } catch (error) {
        next(error)
    }
};

const changePasswordUseingOldPassword = async (req, res, next) => {
  

 
  try {
      
    const { oldPassword, newPassword } = req.body;
   
    const userId=req.user._id

       const user=await User.findById(userId)
    //    console.log(user)


       if (!user) {
           return res.status(404).json(Response({ message: 'User not found.',statusCode:404,status:"failed" }));
       }

       // // Check if old password matches the stored hashed password
       const passwordMatch = await bcrypt.compare(oldPassword, user.password);
       console.log(passwordMatch,"comapar")

       if (!passwordMatch) {
          return res.status(404).json(Response({ statusCode: 404, message: 'password incurrect.', status: 'success'}));
       }


       // // Update the user's password in the database
       user.password = newPassword;
     
           await user.save()
       // Optionally, respond with success message
       res.status(200).json(Response({ statusCode: 200, message: 'Profile updated successfully.', status: 'success',data:user}));
   } catch (error) {
       // Pass error to the error handling middleware
     next(error)
   }
};



// show the personal information with get request 
//----------------------#------------------------

const userInformation=async(req,res,next)=>{
    try {
         const userId=req.user._id

      const user=await User.findById(userId)

            res.status(200).json(Response({ statusCode: 200, message: 'user information  successfully showed.', status: 'success',data:user}));


        
    } catch (error) {
        next(error)

    }
}
const userInformationById=async(req,res,next)=>{
    try {
         const {id}=req.query

      const user=await User.findById(id)

            res.status(200).json(Response({ statusCode: 200, message: 'user information  successfully showed.', status: 'success',data:user}));


        
    } catch (error) {
        next(error)

    }
}
const driverInformationById=async(req,res,next)=>{
    try {
         const {id}=req.query

         const user = await User.findOne({ _id: id }).populate("driverVehical");

            res.status(200).json(Response({ statusCode: 200, message: 'user information  successfully showed.', status: 'success',data:user}));


        
    } catch (error) {
        next(error)

    }
}


// update the user profile 
//-----------#-----------

const updatedUserProfile=async(req,res,next)=>{
   
    try {
        const {address,name,email,dateOfBirth,phone}=req.body
      const {profile,driveingLicence}=req.files || {}
     const userId=req.user._id
      
    
//    console.log(name)
      const files = [];
      console.log(profile)

// Check if there are uploaded files
if (profile && Array.isArray(profile)) {
    profile.forEach((img) => {
        const publicFileUrl = `/images/users/${img.filename}`;
        files.push({
            publicFileUrl,
            path: img.filename,
        });
    });
}

const driveingLicencefiels=[]
if (driveingLicence && Array.isArray(driveingLicence)) {
    driveingLicence.forEach((img) => {
        const publicFileUrl = `/images/users/${img.filename}`;
        driveingLicencefiels.push({
            publicFileUrl,
            path: img.filename,
        });
    });
}
console.log(driveingLicencefiels,files,driveingLicence,address,name,email,dateOfBirth,phone)

      const user=await User.findById(userId)

    //   user.address=address || user.address
      user.name=name || user.name
      user.email=email || user.email
      user.dateOfBirth=dateOfBirth || user.dateOfBirth
      user.phone=phone || user.phone
   
      user.image=files.length > 0 ?files[0]: user.image
      user.drivingLicence=driveingLicencefiels.length > 0 ?driveingLicencefiels[0]: user.drivingLicence
      
    const updateUser=  await user.save()

      res.status(200).json(Response({ statusCode: 200, message: 'user updated  successfully .', status: 'success',data:updateUser}));

        
    } catch (error) {
       next(error)

        
    }
}

const agencyCollection=async(req,res,next)=>{
    try {
        const showUser=await User.find({role:"agency"})

        res.status(200).json(Response({ statusCode: 200, message: 'user updated  successfully .', status: 'success',data:showUser}));

        
    } catch (error) {
        next(error)
    }
}


// update driver licence hare 
const updatedDriverLicence=async(req,res,next)=>{
   
    try {
       
      const {driverLicense}=req.files || {}
     const userId=req.user._id
      
    
//    console.log(name)
      const files = [];
      

// Check if there are uploaded files
if (driverLicense && Array.isArray(driverLicense)) {
    driverLicense.forEach((img) => {
        const publicFileUrl = `/images/users/${img.filename}`;
        files.push({
            publicFileUrl,
            path: img.filename,
        });
    });
}
// console.log(files)

      const user=await User.findById(userId)

   
      user.image=files.length > 0 ?files[0]: user.image
      
    const updateUser=  await user.save()

      res.status(200).json(Response({ statusCode: 200, message: 'user updated  successfully .', status: 'success',data:updateUser}));

        
    } catch (error) {
        return  res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))

        
    }
}

module.exports = { 
    signUp,
     verifyCode,
     signIn,
     resendOtp ,
    
     forgotPassword,
     cahngePassword,

     changePasswordUseingOldPassword,
  
     userInformation,
     updatedUserProfile,
     agencyCollection,
     updatedDriverLicence,
     userInformationById,
     driverInformationById
  
    };
