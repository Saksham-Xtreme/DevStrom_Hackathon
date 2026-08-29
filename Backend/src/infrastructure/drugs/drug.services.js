const drugdb = require("./drugdb.adapter");

const searchMedicines = async (query, limit = 10) => {
    if (!query || query.trim().length < 2) {
        return {
            count: 0,
            results: [],
        };
    }

    const data = await drugdb.searchMedicines({
        query: query.trim(),
        limit,
    });

    return {
        count: data.count,
        total: data.total,
        results: data.results,
    };
};

const getMedicineDetails = async (sctId) => {
    return drugdb.getMedicine(sctId);
};

const getGenericDetails = async (sctId) => {
    return drugdb.getGeneric(sctId);
};

const getSubstanceDetails = async (sctId) => {
    return drugdb.getSubstance(sctId);
};

module.exports = {
    searchMedicines,
    getMedicineDetails,
    getGenericDetails,
    getSubstanceDetails,
};