const passport = require("passport");

const googleAuth = (req, res, next) => {
    const clientUrl =
        req.query.client_url ||
        req.headers.referer ||
        "http://localhost:5174";

    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: clientUrl,
    })(req, res, next);
};

const googleCallback = passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/login-failed",
});

module.exports = {
    googleAuth,
    googleCallback,
};