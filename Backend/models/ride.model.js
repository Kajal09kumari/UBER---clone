const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain',
    },
    pickup: {
        address: {
            type: String,
            required: true,
        },
        coordinates: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            }
        }
    },
    destination: {
        address: {
            type: String,
            required: true,
        },
        coordinates: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            }
        }
    },
    fare: {
        type: Number,
        required: true,
    },
    distance: {
        type: Number, // in kilometers
    },
    duration: {
        type: Number, // in minutes
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending',
    },
    vehicleType: {
        type: String,
        enum: ['car', 'motorcycle', 'auto'],
        required: true,
    },
    otp: {
        type: String,
    },
}, { timestamps: true });

const rideModel = mongoose.model('Ride', rideSchema);

module.exports = rideModel;
