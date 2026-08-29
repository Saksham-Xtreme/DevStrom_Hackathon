const drugService = require("../../infrastructure/drugs/drug.services");

const searchMedicines = async (req, res, next) => {
    try {
        const { q, limit } = req.query;

        const result = await drugService.searchMedicines(
            q,
            Number(limit) || 10
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getMedicineDetails = async (req, res, next) => {
    try {
        const { sctId } = req.params;

        const medicine = await drugService.getMedicineDetails(sctId);

        res.json({
            success: true,
            data: medicine,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchMedicines,
    getMedicineDetails,
};