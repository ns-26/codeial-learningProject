// import schema
const User = require('../modals/user');

const path = require('path');

const fs = require('fs');

//render the profile page
module.exports.profile = function(req, res) {
	User.findById(req.params.id, function(err, user) {
		return res.render('user_profile', {
			title: 'Codeial | Profile Page',
			profile_user: user
		});
	});
};

module.exports.update = async function(req, res) {
	try {
		if (req.user.id == req.params.id) {
			let user = await User.findById(req.params.id);
			User.uploadedAvatar(req, res, function(err) {
				if (err) {
					console.log('Multer Error', err);
					req.flash('error', 'Error in the uploaded file');
					res.redirect('back');
				}
				user.name = req.body.name;
				user.email = req.body.email;
				if (req.file) {
					if (user.avatar) {
						if (fs.existsSync(path.join(__dirname, '..', 'user.avatar'))) {
							fs.unlinkSync(path.join(__dirname, '..', 'user.avatar'));
						}
					}

					console.log(req.file);
					//this is saving the path of the uploaded file into the avatar field of the user
					user.avatar = User.avatarPath + '/' + req.file.filename;
				}
				user.save();
				return res.redirect('/');
			});
		} else {
			return res.status(401).send('Unauthorized');
		}
	} catch (error) {
		req.flash('error', 'User Not Updated');
		console.log(error);
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
