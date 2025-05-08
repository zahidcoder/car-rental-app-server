const mongoose = require('mongoose');

// Privacy schema
const privacySchema = new mongoose.Schema({
  privacyText: { type: String, required: true },
}, { timestamps: true });

const Privacy = mongoose.model('Privacy', privacySchema);

// Terms schema
const termsSchema = new mongoose.Schema({
  termsText: { type: String, required: true }, // Fixing the field name to "termsText"
}, { timestamps: true });

const Terms = mongoose.model('Terms', termsSchema);
// Terms schema
const aboutSchema = new mongoose.Schema({
  aboutUsText: { type: String, required: true }, // Fixing the field name to "termsText"
}, { timestamps: true });

const AboutUs = mongoose.model('AboutUs', aboutSchema);

// contact us

const contacSchema=new mongoose.Schema({
    email:{type:String,required:false},
  
},{timestamps:true})

const Contact=mongoose.model("Contact",contacSchema)

module.exports = { Privacy, Terms,Contact ,AboutUs};
