const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        dosage: {
            type: String,
            required: true,
        },

        form: {
            type: String,
            enum: [
                "tablet",
                "capsule",
                "syrup",
                "injection",
                "cream",
                "drops",
                "other",
            ],
            default: "tablet",
        },

        instructions: {
            type: String,
            trim: true,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },

        expiryDate: {
            type: Date,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Medicine", medicineSchema);