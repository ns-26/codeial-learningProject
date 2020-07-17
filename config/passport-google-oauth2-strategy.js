const passport = require('passport');

const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');

const User = require('../modals/user');
//tell passport to use a new strategy for google login
passport.use(
	new googleStrategy(
		{
			clientID: '658321949336-ag6vqmf8ss399bdk6rjoua4rbpif9gjo.apps.googleusercontent.com',
			clientSecret: 'BVkKy73Xh5fl2-HhDaOLevjc',
			callbackURL: 'http://localhost:3000/users/auth/google/callback'
		}, //profile contains all the profile info , done is passports callback
		function(accessToken, refreshToken, profile, done) {
			//google provides access tokens those can be used and refreshed upom expire
			User.findOne({ email: profile.emails[0].value }).exec(function(err, user) {
				if (err) {
					console.log('Error in google Strategy Passport', err);
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
							password: crypto.randomBytes(20).toString('hex')
						},
						function(err, user) {
							if (err) {
								console.log('Error in creating user google Strategy Passport', err);
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
