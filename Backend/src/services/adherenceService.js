const MedicationLog = require("../models/MedicationLog");

const calculateAdherence = async (userId, startDate, endDate) => {
    const logs = await MedicationLog.find({
        userId,
        scheduledTime: {
            $gte: startDate,
            $lte: endDate,
        },
    });

    const expectedDoses = logs.filter(
        (log) => log.status !== "SKIPPED"
    ).length;

    const takenDoses = logs.filter(
        (log) => log.status === "TAKEN"
    ).length;

    if (expectedDoses === 0) {
        return 0;
    }

    return Number(
        ((takenDoses / expectedDoses) * 100).toFixed(2)
    );
};

module.exports = {
    calculateAdherence,
};