const Response = require("../../../../helpers/respones");
const { Privacy, Terms, AboutUs, Contact } = require("../../models/Setting");

const updatePrivacy = async (req, res, next) => {
    try {
      // Check if the user has an admin role
      if (req.user.role !== "admin") {
        return res.status(403).json(Response({
          status: "fail",
          statusCode: 403,
          message: "Unauthorized. Only admins can update privacy policy.",
        }));
      }
  
      const { content } = req.body; // New content for Privacy policy
      if (!content) {
        return res.status(400).json(Response({
          status: "fail",
          statusCode: 400,
          message: "Content is required to update privacy policy.",
        }));
      }
  
      const updatedPrivacy = await Privacy.findOneAndUpdate(
        {}, // Find the first (and only) Privacy document
        { privacyText:content }, // Update its content
        { new: true, upsert: true } // Return the updated document and create one if it doesn't exist
      );
  
      res.status(200).json(Response({
        status: "success",
        statusCode: 200,
        message: "Privacy policy updated successfully.",
        data: updatedPrivacy,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const updateTerms = async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json(Response({
          status: "fail",
          statusCode: 403,
          message: "Unauthorized. Only admins can update terms and conditions.",
        }));
      }
  
      const { content } = req.body;
      if (!content) {
        return res.status(400).json(Response({
          status: "fail",
          statusCode: 400,
          message: "Content is required to update terms and conditions.",
        }));
      }
  
      const updatedTerms = await Terms.findOneAndUpdate(
        {},
        { termsText:content },
        { new: true, upsert: true }
      );
  
      res.status(200).json(Response({
        status: "success",
        statusCode: 200,
        message: "Terms and conditions updated successfully.",
        data: updatedTerms,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const updateAboutUs = async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json(Response({
          status: "fail",
          statusCode: 403,
          message: "Unauthorized. Only admins can update About Us.",
        }));
      }
  
      const { content } = req.body;
      if (!content) {
        return res.status(400).json(Response({
          status: "fail",
          statusCode: 400,
          message: "Content is required to update About Us.",
        }));
      }
  
      const updatedAboutUs = await AboutUs.findOneAndUpdate(
        {},
        { aboutUsText:content },
        { new: true, upsert: true }
      );
  
      res.status(200).json(Response({
        status: "success",
        statusCode: 200,
        message: "About Us updated successfully.",
        data: updatedAboutUs,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const updateContact = async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json(Response({
          status: "fail",
          statusCode: 403,
          message: "Unauthorized. Only admins can update contact information.",
        }));
      }
  
      const { content } = req.body;
      if (!content) {
        return res.status(400).json(Response({
          status: "fail",
          statusCode: 400,
          message: "Content is required to update contact information.",
        }));
      }
  
      const updatedContact = await Contact.findOneAndUpdate(
        {},
        { email:content },
        { new: true, upsert: true }
      );
  
      res.status(200).json(Response({
        status: "success",
        statusCode: 200,
        message: "Contact information updated successfully.",
        data: updatedContact,
      }));
    } catch (err) {
      next(err);
    }
  };
  

  module.exports={
    updatePrivacy,
    updateTerms,
    updateAboutUs,
    updateContact

  }