const Response = require('../../../helpers/respones');
const Vehical = require('../models/Vehical'); // Adjust the path based on your project structure

// Controller to create a new vehicle
const createVehical = async (req, res, next) => {
    try {
        const { vehicalType } = req.body;

        // Ensure vehicalType is provided
        // if (!vehicalType || !Array.isArray(vehicalType)) {
        //     return res.status(400).json({
        //         status: 'error',
        //         message: 'vehicalType is required and must be an array of strings.',
        //     });
        // }

        // Create a new vehicle document
        const newVehical = new Vehical({
            vehicalType,
        });

        await newVehical.save();

        res.status(200).json(Response({
            status: 'success',
            statusCode:200,
            message: 'Vehical created successfully.',
            data: newVehical,
        }));
    } catch (error) {
        next(error);
    }
};


const updateVehicalById = async (req, res, next) => {
    try {
      const { id } = req.query; // Extract the vehicle ID from the request parameters
      const { vehicalType } = req.body; // Extract the new vehicalType from the request body
  
    //   // Validate vehicalType
    //   if (!vehicalType || !Array.isArray(vehicalType)) {
    //     return res.status(400).json({
    //       status: 'error',
    //       message: 'vehicalType is required and must be an array of strings.',
    //     });
    //   }
  
      // Find the vehicle document by ID
      const existingVehical = await Vehical.findById(id);
  
      // If the vehicle document doesn't exist, return an error
      if (!existingVehical) {
        return res.status(404).json({
          status: 'error',
          message: 'Vehical not found.',
        });
      }
  
      // Update the vehicalType
      existingVehical.vehicalType = vehicalType;
  
      // Save the updated document
      await existingVehical.save();
  
      // Respond with success
      return res.status(200).json({
        status: 'success',
        message: 'Vehical updated successfully.',
        data: existingVehical,
      });
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  };
  

// const createVehical = async (req, res, next) => {
//     try {
//       const { vehicalType } = req.body;
  
//       // Ensure vehicalType is provided
//       if (!vehicalType || !Array.isArray(vehicalType)) {
//         return res.status(400).json({
//           status: 'error',
//           message: 'vehicalType is required and must be an array of strings.',
//         });
//       }
  
//       // Check if a vehicle document already exists
//       const existingVehical = await Vehical.findOne();
  
//       if (existingVehical) {
//         // Update the existing vehicle document by adding new types if they don't already exist
//         const updatedVehicalType = [
//           ...new Set([...existingVehical.vehicalType, ...vehicalType]), // Ensure no duplicates
//         ];
  
//         existingVehical.vehicalType = updatedVehicalType;
//         await existingVehical.save();
  
//         return res.status(200).json(
//           Response({
//             status: 'success',
//             statusCode: 200,
//             message: 'Vehical updated successfully.',
//             data: existingVehical,
//           })
//         );
//       }
  
//       // If no existing vehicle document, create a new one
//       const newVehical = new Vehical({
//         vehicalType,
//       });
  
//       await newVehical.save();
  
//       return res.status(200).json(
//         Response({
//           status: 'success',
//           statusCode: 200,
//           message: 'Vehical created successfully.',
//           data: newVehical,
//         })
//       );
//     } catch (error) {
//       next(error);
//     }
//   };
  
// const createVehical = async (req, res, next) => {
//     try {
//       const { vehicalType, operation } = req.body; // `operation` to specify 'add' or 'delete'
  
//       // Validate vehicalType input
//       if (!vehicalType || !Array.isArray(vehicalType)) {
//         return res.status(400).json({
//           status: 'error',
//           message: 'vehicalType is required and must be an array of strings.',
//         });
//       }
  
//       // Ensure all vehicle types are valid strings
//       if (vehicalType.some((type) => typeof type !== 'string')) {
//         return res.status(400).json({
//           status: 'error',
//           message: 'All vehicalType entries must be strings.',
//         });
//       }
  
//       // Check if a vehicle document already exists
//       const existingVehical = await Vehical.findOne();
  
//       if (existingVehical) {
//         if (operation === 'add') {
//           // Add new vehicle types (avoid duplicates)
//           const updatedVehicalType = [
//             ...new Set([...existingVehical.vehicalType, ...vehicalType]),
//           ];
//           existingVehical.vehicalType = updatedVehicalType;
//         } else if (operation === 'delete') {
//           // Remove specified vehicle types
//           existingVehical.vehicalType = existingVehical.vehicalType.filter(
//             (type) => !vehicalType.includes(type)
//           );
//         } else {
//           return res.status(400).json({
//             status: 'error',
//             message: 'Invalid operation. Use "add" or "delete".',
//           });
//         }
  
//         await existingVehical.save();
  
//         return res.status(200).json({
//           status: 'success',
//           statusCode: 200,
//           message: 'Vehicle updated successfully.',
//           data: existingVehical,
//         });
//       }
  
//       // If no existing document, create a new one (only once)
//       if (!existingVehical && operation === 'add') {
//         const newVehical = new Vehical({ vehicalType });
  
//         await newVehical.save();
  
//         return res.status(200).json({
//           status: 'success',
//           statusCode: 200,
//           message: 'Vehical created successfully.',
//           data: newVehical,
//         });
//       }
  
//       return res.status(400).json({
//         status: 'error',
//         message: 'No existing vehical document found. Create one first using "add".',
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

  
const getVehicals = async (req, res, next) => {
    try {
      

        // Fetch vehicals with pagination
        const vehicals = await Vehical.find()
            

       

        res.status(200).json(Response({
            status: 'success',
            statusCode:200,
            message: 'Vehicals fetched successfully.',
            data: vehicals,
            
        }));
    } catch (error) {
        next(error);
    }
};
const getVehicalsById = async (req, res, next) => {
    try {
      
        const {id}=req.query

        // Fetch vehicals with pagination
        const vehicals = await Vehical.findById(id)
            

       

        res.status(200).json(Response({
            status: 'success',
            statusCode:200,
            message: 'Vehicals fetched successfully.',
            data: vehicals,
            
        }));
    } catch (error) {
        next(error);
    }
};
const deleteVehicalById = async (req, res, next) => {
    try {
      
        const {id}=req.query

        // Fetch vehicals with pagination
        const vehicals = await Vehical.findByIdAndDelete(id)
            

       

        res.status(200).json(Response({
            status: 'success',
            statusCode:200,
            message: 'Vehicals delete succesfully.',
            data: vehicals,
            
        }));
    } catch (error) {
        next(error);
    }
};


module.exports={
    createVehical,
    getVehicals,
    getVehicalsById,
    deleteVehicalById,
    updateVehicalById
}