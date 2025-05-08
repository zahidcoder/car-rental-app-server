

const mongoose = require('mongoose');

// Define the location schema
const vehicalSchema = new mongoose.Schema({
   
    vehicalType:{ type: String, required: true }

    
}, { timestamps: true });



const Vehical = mongoose.model('Vehical', vehicalSchema);
module.exports = Vehical;
