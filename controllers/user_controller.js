// import schema
const User = require('../modals/user');

const path = require('path');

const fs = require('fs');

const Token = require('../modals/tokens');

const crypto = require('crypto');

const passwordResetMailer = require('../mailers/password_reset_mailer');

const passwordResetWorker = require('../workers/password_reset_worker');

const queue = require('../config/kue');

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

module.exports.forgotPassword = (req, res) => {
	return res.render('password_reset_email', {
		title: 'Forgot Password'
	});
};

module.exports.generateToken = async function(req, res) {
	try {
		let user = await User.findOne({ email: req.body.email });
		let token = await Token.create({
			user: user._id,
			token: crypto.randomBytes(20).toString('hex'),
			isValid: true
		});
		token = await token.populate('user', 'email').execPopulate();
		let job = queue.create('password', token).priority('high').save(function(err) {
			if (err) {
				console.log('Error in creating the queue', err);
				return;
			}
			console.log('job enqued', job.id);
		});
		return res.render('password_reset_token', {
			title: 'Forgot Password'
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};

module.exports.resetPassword = async function(req, res) {
	try {
		let accessToken = req.query.accesstoken;

		let token = await Token.findOne({ token: accessToken });

		if (token.isValid) {
			return res.render('password_reset_new', {
				title: 'Reset Password',
				token: token
			});
		} else {
			return res.status(401).json({
				message: 'Unauthorised'
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};

module.exports.newPassword = async function(req, res) {
	try {
		let accessToken = req.query.accesstoken;

		let token = await Token.findOne({ token: accessToken });

		if (token.isValid) {
			if (req.body.password == req.body.confirm_password) {
				let user = await User.findOne(token.user);
				user.password = req.body.password;
				user.save();
				token.isValid = false;
				token.save();
				return res.redirect('/');
			} else {
				return res.status(400).json({
					message: 'Wrong password'
				});
			}
		} else {
			return res.status(401).json({
				message: 'Unauthorised'
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};
