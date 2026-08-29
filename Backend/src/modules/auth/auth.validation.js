const validateClientUrl = (clientUrl) => {
    if (!clientUrl) {
        return process.env.CLIENT_URL || "http://localhost:5174";
    }

    try {
        const url = new URL(clientUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("Invalid client URL");
        }

        return url.origin;
    } catch (error) {
        throw new Error("Invalid client URL");
    }
};

module.exports = {
    validateClientUrl
};