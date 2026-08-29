const mongoose = require("mongoose");

const medicationLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine",
            required: true,
        },

        scheduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicationSchedule",
            required: true,
        },

        scheduledTime: {
            type: Date,
            required: true,
        },

        takenAt: {
            type: Date,
        },

        status: {
            type: String,
            enum: ["TAKEN", "MISSED", "SKIPPED"],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("MedicationLog", medicationLogSchema);