require("dotenv").config();

const app = require("../app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(
            `Server running on http://localhost:${PORT}`
        );
    });
};

startServer();