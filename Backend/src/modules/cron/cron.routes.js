const express = require("express");

const router = express.Router();

router.get("/medication-reminders", async (req, res) => {
    try {
        const cronSecret = req.headers["x-cron-secret"];

        if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        console.log("Medication reminder cron started");

        // TODO: Add medication reminder logic here.

        console.log("Medication reminder cron completed");

        return res.status(200).json({
            success: true,
            message: "Medication reminder cron completed"
        });
    } catch (error) {
        console.error("Medication reminder cron error:", error);

        return res.status(500).json({
            success: false,
            message: "Cron job failed"
        });
    }
});

module.exports = router;