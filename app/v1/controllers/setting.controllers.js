const Response = require("../../../helpers/respones");
const { Privacy, Terms, AboutUs, Contact } = require("../models/Setting");


// Controller to show the Privacy policy
const showPrivacy = async (req, res,next) => {
  try {
    const privacy = await Privacy.findOne();
    if (!privacy) {
      return res.status(404).json(Response({ status:"faild",statuseCode:404,message: "Privacy policy not found" }));
    }
    res.status(200).json(Response({status:"ok",statusCode:200,message:"show successfullu",data:privacy}));
  } catch (err) {
   next(err)
  }
};

// Controller to show the Terms and Conditions
const showTerms = async (req, res,next) => {
  try {
    const terms = await Terms.findOne();
    if (!terms) {
        return res.status(404).json(Response({ status:"faild",statuseCode:404,message: "terms not found" }));
    }
    res.status(200).json(Response({status:"ok",statusCode:200,message:"show successfullu",data:terms}));
} catch (err) {
 next(err)
}
};

// Controller to show About Us information
const showAboutUs = async (req, res,next) => {
  try {
    const aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
        return res.status(404).json(Response({ status:"faild",statuseCode:404,message: "aobut  not found" }));

    }
    res.status(200).json(Response({status:"ok",statusCode:200,message:"show successfullu",data:aboutUs}));
} catch (err) {
 next(err)
}
};

// Controller to show Contact information
const showContact = async (req, res,next) => {
  try {
    const contact = await Contact.findOne();
    if (!contact) {
        return res.status(404).json(Response({ status:"faild",statuseCode:404,message: "contact not found" }));

    }
    res.status(200).json(Response({status:"ok",statusCode:200,message:"show successfullu",data:contact}));
} catch (err) {
 next(err)
}
};

module.exports = {
  showPrivacy,
  showTerms,
  showAboutUs,
  showContact,
};
