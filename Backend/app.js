const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://localhost:5174"
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});