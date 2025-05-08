const mongoose = require('mongoose');

module.exports = {
    // Connect to the MongoDB database
    connectToDatabase: async () => {
        try {
            // Ensure Mongoose uses the new URL parser and unified topology
            await mongoose.connect(process.env.MONGODB_CONNECTION);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            // Optionally, you might want to exit the process or handle the error more gracefully
            // process.exit(1); // Uncomment if you want the process to exit on connection failure
        }
    }
};
