const Response = require('../../../helpers/respones');
const DriverVehical = require('../models/DriverVehical');
const User = require('../models/User');

const createDriverVehical = async (req, res, next) => {
  try {
    const driverId=req.user._id
    const {
      brandName,
      model,
      year,
      registationNumber,
      seat,
      transmession,
      
    } = req.body;

    // Validate required fields
    if (
      !brandName ||
      !model ||
      !year ||
      !registationNumber ||
      !seat ||
      !transmession 
      
    ) {
      return res.status(400).json(Response({
        status: 'error',
        statusCode: 400,
        message: 'All fields are required.',
      }));
    }

    // Check if the driver already has a vehicle registered
    const existingVehicle = await DriverVehical.findOne({ driverId });
    console.log(existingVehicle,"sdoajflksdjflksjlk");
    if (existingVehicle) {
      return res.status(400).json(Response({
        status: 'error',
        statusCode: 400,
        message: 'You have already registered a vehicle.',
      }));
    }

    
        // Handle file uploads for images
     
        const driveingLicence = req.files?.driveingLicence;
        const carfitnessLicence = req.files?.carfitnessLicence;

        

        const driveingLicencefiels = driveingLicence
            ? driveingLicence.map((img) => ({
                  publicFileUrl: `/images/users/${img.filename}`,
                  path: img.filename,
              }))
            : [];

        const carfitnessLicencefiles = carfitnessLicence
            ? carfitnessLicence.map((img) => ({
                  publicFileUrl: `/images/users/${img.filename}`,
                  path: img.filename,
              }))
            : [];

    // Create a new driver vehicle
    const newVehicle = new DriverVehical({
        driverId,
      brandName,
      model,
      year,
      registationNumber,
      seat,
      transmession,
      driveingLicence:driveingLicencefiels[0],
      regisattionImage:carfitnessLicencefiles[0],
    });

    await newVehicle.save();

    await User.findByIdAndUpdate(driverId,{driverVehical:newVehicle._id})

    res.status(200).json(Response({
      status: 'success',
      statusCode: 200,
      message: 'Driver vehicle created successfully.',
      data: newVehicle,
    }));
  } catch (error) {
    next(error);
  }
};

module.exports={
    createDriverVehical
}