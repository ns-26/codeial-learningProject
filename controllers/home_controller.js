const Post = require('../modals/post');

const User = require('../modals/user');

module.exports.home = async function(req, res) {
	// console.log(req.cookies);
	// res.cookie('user_id', 25);
	// console.log(res.cookie);

	// Post.find({}, function(err, posts) {
	// 	return res.render('home', {
	// 		title: 'Codeial | Home',
	// 		posts: posts
	// 	});
	// });

	//populate the comments of the entire user

	try {
		let posts = await Post.find({}).sort('-createdAt').populate('user').populate({
			path: 'comments',
			options: { sort: '-createdAt' },
			populate: {
				path: 'user'
			}
		});
		let users = await User.find({});

		return res.render('home', {
			title: 'Codeial | Home',
			posts: posts,
			all_users: users
		});
	} catch (err) {
		console.log(err);
		return res.redirect('back');
	}
};
