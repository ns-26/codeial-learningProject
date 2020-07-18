const nodeMailer = require('../config/nodemailer');
//another way of exporting a method  other way was module.exports.newComment
exports.newComment = (comment) => {
	let htmlString = nodeMailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs');
	nodeMailer.transporter.sendMail(
		{
			from: 'navdeepsingh.26.2000@gmail.com',
			to: comment.user.email,
			subject: 'New Comment Published',
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
