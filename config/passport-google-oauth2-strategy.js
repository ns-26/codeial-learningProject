const passport = require("passport");

const googleStrategy = require("passport-google-oauth").OAuth2Strategy;

const crypto = require("crypto");

const User = require("../modals/user");
//tell passport to use a new strategy for google login
const env = require("./environment");

passport.use(
  new googleStrategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: env.google_callback_url,
    }, //profile contains all the profile info , done is passports callback
    function (accessToken, refreshToken, profile, done) {
      //google provides access tokens those can be used and refreshed upom expire
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("Error in google Strategy Passport", err);
          return;
        }
        console.log(profile);
        if (user) {
          //if found set this user as req.user
          return done(null, user);
        } else {
          // if no user exists in the database then create one user using the info available
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            },
            function (err, user) {
              if (err) {
                console.log(
                  "Error in creating user google Strategy Passport",
                  err
                );
                return;
              }
              // setting up the newly created user
              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
