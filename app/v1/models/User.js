const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"], minlength: 1, maxlength: 300, },
    email: {
        type: String, required: [true, "Email is required"], minlength: 3, maxlength: 100, trim: true,
        unique: [true, 'Email should be unique'],
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
            },
            message: 'Please enter a valid Email'
        }
    },
    role: { type: String, required: true, enum: ["user", "admin","agency","driver"], default: "user" },
    password: {
        type: String,
        required: false,
      
      },
    phone: { type: String, required: false ,default:"0124544"},
    address:{type:String,required:false,default:null},
    dateOfBirth:{type:String,require:false,default:null},
    rating:{type:String,require:false,default:"0.00"},
    city:{type:String,require:false, default:""},
   
    currentLocation: {
        type: {
            type: String, // This will always be 'Point' for GeoJSON data
            enum: ['Point'], // Only allow 'Point' as type
            required: false,
            default: 'Point'
        },
        coordinates: {
            type: [Number], // Array of numbers: [longitude, latitude]
            required: false,
            default: [0, 0], // Default to [longitude, latitude]
        }
    },
    drivingLicence:{type:Object,required:false,default:null},
    isAgentAcceptDriver:{type:Boolean,default:false},
    isDriverAbailable:{type:Boolean,default:true},
agencyId:{type:mongoose.Schema.ObjectId,ref:"User",required:false},
driverVehical:{type:mongoose.Schema.ObjectId,ref:"DriverVehical",required:false,default:null},
    privacyPolicyAccepted: { type: Boolean, default: false, required: false },
    remainingAmount:{type:Number,required:false},
    totalAmount:{type:Number,required:false},
    creditAmount:{type:Number,required:false},
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isVerifiedProfile: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    image: { type: Object, required: false, default: { publicFileUrl: "/images/users/user.png", path: "public\\images\\users\\user.png" } },
    fcmToken:{type:String,required:false},
   
    oneTimeCode: { type: String, required: false, default: null },
},{ timestamps: true },
 {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
        },
    },
},
    
);

// Add a geospatial index for location
userSchema.index({ currentLocation: "2dsphere" });

userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
  };
  
  userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  });
module.exports = mongoose.model('User', userSchema);