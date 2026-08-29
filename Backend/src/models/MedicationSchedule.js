const mongoose = require("mongoose");

const medicationScheduleSchema = new mongoose.Schema(
    {
        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine",
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        days: [
            {
                type: String,
                enum: [
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                ],
            },
        ],

        dose: {
            type: Number,
            required: true,
            min: 0,
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

module.exports = mongoose.model(
    "MedicationSchedule",
    medicationScheduleSchema
);