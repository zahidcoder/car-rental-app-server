

const mongoose = require('mongoose');

// Define the location schema
const carBrandSchema = new mongoose.Schema({
    brandName:{type:String,Required:true,unique: true},
    brandImage:{type:Object,Required:true},
    carType: [{ type: String, required: true }]

    
}, { timestamps: true });



const CarBrand = mongoose.model('CarBrand', carBrandSchema);
module.exports = CarBrand;
