const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");

console.log("🔵 Loading passport configuration...");
console.log("🔵 GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID);
console.log("🔵 GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("🔵 GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },

        async (accessToken, refreshToken, profile, done) => {
            console.log("\n================ GOOGLE STRATEGY ================");
            console.log("✅ Google strategy was reached");
            console.log("Google profile ID:", profile?.id);
            console.log("Google display name:", profile?.displayName);
            console.log(
                "Google email:",
                profile?.emails?.[0]?.value
            );

            try {
                const email = profile?.emails?.[0]?.value;

                if (!email) {
                    console.log("❌ No email returned by Google");
                    return done(new Error("Google account has no email"));
                }

                console.log("🔎 Searching for existing user...");

                let user = await User.findOne({
                    googleId: profile.id,
                });

                console.log(
                    "User found by googleId:",
                    !!user
                );

                if (!user) {
                    console.log("🔎 Searching by email...");

                    user = await User.findOne({
                        email: email.toLowerCase(),
                    });

                    console.log(
                        "User found by email:",
                        !!user
                    );
                }

                if (!user) {
                    console.log("🆕 Creating new user...");

                    user = await User.create({
                        email: email.toLowerCase(),
                        name: profile.displayName,
                        googleId: profile.id,
                        authProvider: "google",
                        emailVerified: true,
                        profileImage:
                            profile.photos?.[0]?.value || null,
                        lastLoginAt: new Date(),
                    });

                    console.log(
                        "✅ New user created:",
                        user._id
                    );
                } else {
                    console.log(
                        "👤 Existing user:",
                        user._id
                    );

                    user.googleId = profile.id;
                    user.authProvider = "google";
                    user.emailVerified = true;
                    user.lastLoginAt = new Date();

                    await user.save();

                    console.log("✅ Existing user updated");
                }

                console.log("✅ Passport authentication successful");
                console.log("================================================\n");

                return done(null, user);

            } catch (error) {
                console.error("\n❌ GOOGLE STRATEGY ERROR");
                console.error(error);
                console.error("================================================\n");

                return done(error);
            }
        }
    )
);

module.exports = passport;