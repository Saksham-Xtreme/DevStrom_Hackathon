const express = require("express");

const {
    searchMedicines,
    getMedicineDetails,
    getMedicines,
    getMedicine,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    getTodayDoses,
    logDose,
} = require("./medicine.controller");

const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

// DrugDB search (public external info)
router.get("/search", searchMedicines);

// DrugDB medicine details (public external info)
router.get("/drug/:sctId", getMedicineDetails);

// Today's scheduled doses for the authenticated user
router.get("/today", authMiddleware, getTodayDoses);

// User-scoped medicine CRUD (must come before "/:id")
router.get("/", authMiddleware, getMedicines);
router.post("/", authMiddleware, createMedicine);
router.get("/:id", authMiddleware, getMedicine);
router.put("/:id", authMiddleware, updateMedicine);
router.delete("/:id", authMiddleware, deleteMedicine);

// Mark a dose as taken / skipped / missed
router.post("/today/:scheduleId/log", authMiddleware, logDose);

module.exports = router;
