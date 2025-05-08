

const mongoose = require('mongoose');

// Define the location schema
const locationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: false 
    },
    location: { // Use GeoJSON format for the location
        type: {
            type: String, // This will always be 'Point' for GeoJSON
            enum: ['Point'], // Only allow 'Point' as type
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers: [longitude, latitude]
            required: true
        }
    }
}, { timestamps: true });

// Add a 2dsphere index on location for efficient geolocation queries
locationSchema.index({ location: '2dsphere' });

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
