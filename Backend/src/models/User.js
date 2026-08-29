const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // Application identity
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        profileImage: {
            type: String,
            default: null
        },

        // Authentication provider
        authProvider: {
            type: String,
            enum: ["google", "email"],
            required: true
        },

        // Google's unique user ID
        googleId: {
            type: String,
            unique: true,
            sparse: true,
            default: null
        },

        // Email verification
        emailVerified: {
            type: Boolean,
            default: false
        },

        // Password is optional because OAuth users don't need one
        passwordHash: {
            type: String,
            default: null
        },

        // Account status
        isActive: {
            type: Boolean,
            default: true
        },

        // Used later for caregiver/patient functionality
        role: {
            type: String,
            enum: ["patient", "caregiver"],
            default: "patient"
        },

        lastLoginAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);