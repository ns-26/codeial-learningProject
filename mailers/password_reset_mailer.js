const nodeMailer = require('../config/nodemailer');
//another way of exporting a method  other way was module.exports.newComment
exports.newToken = (token) => {
	let htmlString = nodeMailer.renderTemplate({ token: token }, '/passwords/password_reset.ejs');
	nodeMailer.transporter.sendMail(
		{
			from: 'navdeepsingh.26.2000@gmail.com',
			to: token.user.email,
			subject: 'Reset Password',
			html: htmlString
		},
		(err, info) => {
			if (err) {
				console.log('error in sending mail', err);
				return;
			}
			console.log('mail delivered', info);
			return;
		}
	);
};
