const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(
                        new Error("Google account has no email")
                    );
                }

                let user = await User.findOne({
                    googleId: profile.id
                });

                if (!user) {
                    user = await User.findOne({
                        email: email.toLowerCase()
                    });
                }

                if (!user) {
                    user = await User.create({
                        email: email.toLowerCase(),
                        name: profile.displayName,
                        profileImage: profile.photos?.[0]?.value || null,
                        authProvider: "google",
                        googleId: profile.id,
                        emailVerified: true,
                        lastLoginAt: new Date()
                    });
                } else {
                    user.googleId = profile.id;
                    user.authProvider = "google";
                    user.emailVerified = true;
                    user.lastLoginAt = new Date();

                    await user.save();
                }

                return done(null, user);

            } catch (error) {
                return done(error);
            }
        }
    )
);

module.exports = passport;