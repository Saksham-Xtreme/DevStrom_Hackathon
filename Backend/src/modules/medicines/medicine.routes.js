const express = require("express");

const {
    searchMedicines,
    getMedicineDetails,
} = require("./medicine.controller");

const router = express.Router();

router.get("/search", searchMedicines);

router.get(
    "/drug/:sctId",
    getMedicineDetails
);

module.exports = router;
