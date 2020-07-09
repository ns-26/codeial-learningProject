const Post = require('../modals/post');

module.exports.home = function(req, res) {
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
	Post.find({}).populate('user').exec(function(err, posts) {
		if (err) {
			console.log("Some error finding the posts and populating it with user's info");
		}
		return res.render('home', {
			title: 'Codeial | Home',
			posts: posts
		});
	});
};
