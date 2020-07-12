// import schema
const User = require('../modals/user');

//render the profile page
module.exports.profile = function(req, res) {
	User.findById(req.params.id, function(err, user) {
		return res.render('user_profile', {
			title: 'Codeial | Profile Page',
			profile_user: user
		});
	});
};

module.exports.update = function(req, res) {
	if (req.user.id == req.params.id) {
		User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
			if (err) {
				req.flash('error', 'Error in Updating');
				console.log('error in updating the users values');
				return res.redirect('back');
			}
			req.flash('success', 'Updated!');
			return res.redirect('/');
		});
	} else {
		return res.status(401).send('Unauthorized');
	}
};

//render the sign in page
module.exports.signIn = function(req, res) {
	if (req.isAuthenticated()) {
		return res.redirect('/users/profile');
	}
	return res.render('user_sign_in', {
		title: 'Sign In'
	});
};
//render the sign up page
module.exports.signUp = function(req, res) {
	if (req.isAuthenticated()) {
		return res.redirect('/users/profile');
	}
	return res.render('user_sign_up', {
		title: 'Codeial | Sign Up'
	});
};
//sign up a user
module.exports.create = function(req, res) {
	if (req.body.password != req.body.confirm_password) {
		return res.redirect('back');
	}
	User.findOne({ email: req.body.email }, function(err, user) {
		if (err) {
			req.flash('error', 'Email already taken');
			console.log('error in finding user in signing up');
			return;
		}
		if (!user) {
			User.create(req.body, function(err, user) {
				if (err) {
					req.flash('error', 'Sorry! Unable to create user');
					console.log('error in creating user while signing up');
					return;
				}
				req.flash('success', 'User signed up successfully');
				return res.redirect('/users/sign-in');
			});
		} else {
			return res.redirect('back');
		}
	});
};
//sign in user
module.exports.createSession = function(req, res) {
	req.flash('success', 'Logged In Successfully');
	return res.redirect('/');
};

module.exports.destroySession = function(req, res) {
	req.flash('success', 'You have logged out');
	req.logout();
	return res.redirect('/');
};
