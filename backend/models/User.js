const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    picture: String,
    accessToken: String,
    refreshToken: String,
    tokenExpiry: Date,

    // ✅ ADD THIS - User preferences
    preferences: {
        notifications: {
            type: Boolean,
            default: true
        },
        autoSync: {
            type: Boolean,
            default: false
        },
        darkMode: {
            type: Boolean,
            default: true
        },
        syncStartDate: {
            type: String,
            default: ''
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);