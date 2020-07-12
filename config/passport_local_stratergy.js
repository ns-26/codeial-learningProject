const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../modals/user');

//authentication using passport and find a user and establish its identity
passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passReqToCallback: true
		},
		function(req, email, password, done) {
			User.findOne({ email: email }, function(err, user) {
				if (err) {
					req.flash('error', err);
					console.log('error in finding user  --> Passport');
					return done(err);
				}
				if (!user || user.password != password) {
					req.flash('error', 'Invalid username or password');
					console.log('invalid username or password');
					return done(err, false);
				}
				return done(null, user);
			});
		}
	)
);

//serialise the user to decide which key to keep in the cookie
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

//deserialising the user from the key the cookies
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		if (err) {
			console.log('error in finding user -->  Passport');
			done(err);
		}
		return done(null, user);
	});
});
//check if the user is authenticated
passport.checkAuthentication = function(req, res, next) {
	//if the user is signed in then pass the request to the function (controllers action)
	if (req.isAuthenticated()) {
		return next();
	}
	//if user is not signed in
	return res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = function(req, res, next) {
	if (req.isAuthenticated()) {
		//req.user contains the current signed in user from session cookie and we are just sending the user from requests to response
		res.locals.user = req.user;
	}
	return next();
};

module.exports = passport;
