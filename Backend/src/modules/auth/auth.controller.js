const { generateToken } = require("../../utils/jwt");
const authService = require("./auth.services");

const getCurrentUser = async (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
};

const googleCallback = (req, res) => {
    const token = generateToken(req.user);

    const clientUrl =
        req.query.state ||
        process.env.CLIENT_URL ||
        "http://localhost:5174";

    const sanitizedClientUrl = clientUrl.replace(/\/$/, "");

    const redirectUrl =
        `${sanitizedClientUrl}/dashboard` +
        `?oauth_success=true` +
        `&token=${encodeURIComponent(token)}`;

    res.redirect(redirectUrl);
};

module.exports = {
    getCurrentUser,
    googleCallback,
};