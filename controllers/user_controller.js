// import schema
const User = require('../modals/user');

//render the profile page
module.exports.profile = function(req, res) {
	return res.render('user_profile', {
		title: 'Codeial | Profile Page'
	});
};
//render the sign in page
module.exports.signIn = function(req, res) {
	return res.render('user_sign_in', {
		title: 'Sign In'
	});
};
//render the sign up page
module.exports.signUp = function(req, res) {
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
			console.log('error in finding user in signing up');
			return;
		}
		if (!user) {
			User.create(req.body, function(err, user) {
				if (err) {
					console.log('error in creating user while signing up');
					return;
				}
				return res.redirect('/users/sign-in');
			});
		} else {
			return res.redirect('back');
		}
	});
};
//sign in user
module.exports.createSession = function(req, res) {
	return res.end('<h1>Yup</h1>');
};
