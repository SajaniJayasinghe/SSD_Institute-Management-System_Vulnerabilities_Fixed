// passport-config.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/RD_models/student");

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { name, emails, photos, displayName } = profile;

      const user = await User.findOne({ email: emails[0].value });

      if (!user) {
        const newUser = new User({
        googleId: profile.id,
        studentName:displayName,
        email: emails[0].value,
        });

        await newUser
          .save()
          .then((user) => {
            return done(null, user);
          })
          .catch((err) => {
            return done(err);
          });
      } else {
        return done(null, user);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
