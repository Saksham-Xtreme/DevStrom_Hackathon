const mongoose = require("mongoose");

// Medicine data extracted from OCR or entered manually
const prescriptionMedicineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        dosage: {
            type: String,
            trim: true,
        },

        form: {
            type: String,
            enum: [
                "tablet",
                "capsule",
                "syrup",
                "injection",
                "cream",
                "ointment",
                "drops",
                "inhaler",
                "powder",
                "other",
            ],
            default: "other",
        },

        frequency: {
            type: String,
            trim: true,
        },

        duration: {
            type: String,
            trim: true,
        },

        instructions: {
            type: String,
            trim: true,
        },

        // OCR confidence score
        // Example: 0.95 = 95% confidence
        confidence: {
            type: Number,
            min: 0,
            max: 1,
        },

        // User confirms/corrects this medicine
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: true,
    }
);

const prescriptionSchema = new mongoose.Schema(
    {
        // User who uploaded/created the prescription
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // Original prescription file
        fileUrl: {
            type: String,
            trim: true,
        },

        fileType: {
            type: String,
            enum: ["image", "pdf"],
        },

        // How the prescription entered the system
        source: {
            type: String,
            enum: ["OCR", "MANUAL", "API"],
            required: true,
            default: "MANUAL",
        },

        // OCR processing status
        ocrStatus: {
            type: String,
            enum: [
                "NOT_REQUIRED",
                "PENDING",
                "PROCESSING",
                "COMPLETED",
                "FAILED",
            ],
            default: "NOT_REQUIRED",
        },

        // Raw text returned by OCR
        extractedText: {
            type: String,
            trim: true,
        },

        // Medicines extracted from OCR
        // or entered manually
        medicines: {
            type: [prescriptionMedicineSchema],
            default: [],
        },

        // Overall prescription verification
        verificationStatus: {
            type: String,
            enum: [
                "PENDING",
                "PARTIALLY_VERIFIED",
                "VERIFIED",
            ],
            default: "PENDING",
        },

        // Doctor information
        doctorName: {
            type: String,
            trim: true,
        },

        hospitalName: {
            type: String,
            trim: true,
        },

        prescriptionDate: {
            type: Date,
        },

        // Additional notes
        notes: {
            type: String,
            trim: true,
        },

        // Error information if OCR fails
        processingError: {
            type: String,
            trim: true,
        },

        // Overall prescription state
        status: {
            type: String,
            enum: [
                "DRAFT",
                "PROCESSED",
                "CONFIRMED",
                "FAILED",
            ],
            default: "DRAFT",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Prescription",
    prescriptionSchema
);