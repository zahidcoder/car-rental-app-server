const Response = require("../../../helpers/respones");
const Location = require("../models/Location");
const User = require("../models/User");





const createLocation = async (req, res, next) => {
    try {
        const user = req.user; // Get the authenticated user from the request
        console.log(user);

        // Check for an existing location for the user
        const existingLocation = await Location.findOne({ userId: user._id });
        if (existingLocation) {
            // Delete the old location if it exists
            await Location.findByIdAndDelete(existingLocation._id);
        }

        const { latitude, longitude ,address} = req.body; // Extract latitude and longitude from the request body

        // Create a new location document
        const newLocation = new Location({
            userId: user._id, // Reference to the User model
            location: {
                type: 'Point', // GeoJSON type
                coordinates: [longitude, latitude] // Note: [longitude, latitude]
            }
        });

        // Save the new location to the database
        const savedLocation = await newLocation.save();

        // Update the user's currentLocation field with the new location
        const userAdd=await User.findByIdAndUpdate(
            user._id,
            { currentLocation: savedLocation.location,address:address }, // Update with saved location
            { new: true }
        );
        console.log(userAdd,"sdfsdkfj");

        // Send a response with the saved location
        return res.status(200).json(Response({
            message: "Location created",
            status: "ok",
            statusCode: 200,
            data: savedLocation
        }));
    } catch (err) {
        next(err); // Pass the error to the error-handling middleware
    }
};


const getLocations = async (req, res,next) => {
  try {
    const locations = await Location.find();
    return res.status(200).json(Response({message:"get location", statusCode:200,data:locations,status:"ok"}));
  } catch (err) {
next(err)
  }
};

// get location by user id 
const getLocationById = async (req, res,next) => {
  
  try {
   const {id}=req.query
console.log(id);
    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json(Response({ status:"not found",statusCode:400, message: 'Location not found' }));
    }
    return res.status(200).json(Response({ status:"success",statusCode:200, message: 'succesfully show' ,data:location}));
} catch (err) {
   next(err)
  }
};

const updateLocation = async (req, res) => {
    
 
 try {
     // Verify the token
     const user = req.user;
     console.log(user);
    
    const { latitude, longitude } = req.body;
    console.log(latitude,longitude)
    const location = await Location.findByIdAndUpdate({userId:user._id}, { latitude, longitude }, { new: true });
    if (!location) {
      return res.status(404).json(Response({statusCode:404,status:"faield", message: 'Location not found' }));
    }
    res.status(200).j(son(Response({status:"ok",message:"updated successfullu",data:location})));
  } catch (err) {
    next(err)
  }
};



// Controller to find all sellers within 5 km of the user
const findSellersNearby = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user's current location
    const user = await User.findById(userId);
    if (!user || !user.currentLocation || !user.currentLocation.coordinates) {
      return res.status(404).json({ message: 'User or user location not found' });
    }

    const userLatitude = user.currentLocation.coordinates[1]; // latitude
    const userLongitude = user.currentLocation.coordinates[0]; // longitude
    console.log(user, "User data:", userLatitude, userLongitude);

    // MongoDB query to find sellers within 5 km (5 km = 5000 meters)
    const sellers = await User.find({
      role: 'provider', // Only look for users with role 'seller'
      currentLocation: {
        $geoWithin: {
          $centerSphere: [
            [userLongitude, userLatitude], // User's location
            5/ 6378.1, // Radius in radians (5 km radius / Earth's radius in km)
          ],
        },
      },
    });
    console.log(sellers, "Nearby sellers:");

    // Return the list of sellers
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: 'Successfully retrieved sellers',
      data: sellers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};




module.exports = { getLocationById,getLocations,updateLocation,createLocation,findSellersNearby };