const axios = require("axios");

const DRUGDB_BASE_URL = process.env.DRUGDB_BASE_URL;

const drugdbClient = axios.create({
    baseURL: DRUGDB_BASE_URL,
    timeout: 10000,
});

const searchMedicines = async ({
    query,
    limit = 10,
}) => {
    const response = await drugdbClient.get("/search", {
        params: {
            q: query,
            type: "medicine",
            limit,
        },
    });

    return response.data;
};

const searchMedicineFull = async (query) => {
    const response = await drugdbClient.get("/search", {
        params: {
            q: query,
            detail: "full",
        },
    });

    return response.data;
};

const getMedicine = async (sctId) => {
    const response = await drugdbClient.get(
        `/dis/medicine/${sctId}`
    );

    return response.data;
};

const getGeneric = async (sctId) => {
    const response = await drugdbClient.get(
        `/dis/generic/${sctId}`
    );

    return response.data;
};

const getSubstance = async (sctId) => {
    const response = await drugdbClient.get(
        `/dis/substance/${sctId}`
    );

    return response.data;
};
console.log("DrugDB URL:", process.env.DRUGDB_BASE_URL);

module.exports = {
    searchMedicines,
    searchMedicineFull,
    getMedicine,
    getGeneric,
    getSubstance,
};