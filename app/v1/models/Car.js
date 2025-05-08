

const mongoose = require('mongoose');



const carSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: false 
    },
    ratings:{type:String,default:"0.00"},
    price:{type:String,default:"20"},
    category:{type:String,required:true},
    vehicle:{type:Array, required:true},
    mileage:{type:String,required:true},
    mileageLimit:{type:Number,required:false},
    transmission:{type:String,required:true,enum:["Automatic","Manual"]},
    fuelCondations:{type:String,required:true},
    guarantee:{type:String,required:true},
    passengers:{type:String,required:true},
    deliveryCharge:{type:String,required:false,default:"0"},
  
    use:{type:Array, required:true},
    fuelType:{type:String,required:true},
    suporior:{type:String,required:true},
    carName:{type:String,required:true},
    carBrand:{type:String,required:true},
    carModel:{type:String,required:true},
    carImage:{type:Object,required:true},
    carRegistation:{type:Object,required:false},
    carfitnessLicence:{type:Object,required:false},
    weeklyDiscount:{type:Number,required:false,default:0},
    monthlyDiscount:{type:Number,required:false,default:0},
    

    startDate:{type:String,default:null},
    endDate:{type:String,default:null},
    startTime:{type:String,default:null},
    endTime:{type:String,default:null},
      bookedDates: [
        {
           startDate: { type: String, required: false },
           endDate: { type: String, required: false },
           startTime: { type: Number, required: false },
           endTime: { type: Number, required: false }
        }
     ],



    isRent:{type:Boolean,default:false},
    isWifi:{type:Boolean,default:false},
    wifiprice:{type:String,required:false},
    bostterSetPrice:{type:String,required:false},
    isBosterSet:{type:Boolean,default:false},
  
    carStatus:{type:String, enum:["available","notAvailable"],default:"available"},

  
    

   
    
}, { timestamps: true });



const Car = mongoose.model('Car', carSchema);
module.exports = Car;



