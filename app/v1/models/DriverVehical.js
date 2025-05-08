

const mongoose = require('mongoose');

// Define the location schema
const driverVehicalSchema = new mongoose.Schema({
    driverId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},

    brandName:{type:String,Required:true},
    model:{type:String,Required:true},
    year:{type:String,Required:true},
    registationNumber:{type:String,Required:true},
    seat:{type:String,Required:true},
    transmession:{type:String,Required:true},
    driveingLicence:{type:Object,Required:true},
    regisattionImage:{type:Object,Required:true},
    

    
}, { timestamps: true });



const DriverVehical = mongoose.model('DriverVehical', driverVehicalSchema);
module.exports = DriverVehical;
