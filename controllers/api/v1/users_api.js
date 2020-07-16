const User = require('../../../modals/user');

const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req, res) {
	try {
		let user = await User.findOne({ email: req.body.email });
		if (!user || user.password != req.body.password) {
			res.status(422).json({
				message: 'Invalid Username or password'
			});
		}
		return res.status(200).json({
			message: 'Sign In successful token generated not to be shared',
			data: {
				token: jwt.sign(user.toJSON(), 'codeial', { expiresIn: '1000000' })
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};
