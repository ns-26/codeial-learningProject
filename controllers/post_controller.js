const Post = require('../modals/post');

const Comment = require('../modals/comment');

module.exports.create = function(req, res) {
	Post.create(
		{
			content: req.body.content,
			user: req.user._id
		},
		function(err, post) {
			if (err) {
				console.log('error in creating a post');
				return;
			}
			return res.redirect('back');
		}
	);
};

module.exports.destroy = function(req, res) {
	Post.findById(req.params.id, function(err, post) {
		if (err) {
			console.log('error in finding the post');
			res.redirect('/');
		} else if (post.user == req.user.id) {
			//.id means converting the object id to string
			post.remove();
			Comment.deleteMany(
				{
					post: req.params.id
				},
				function(err) {
					return res.redirect('back');
				}
			);
		} else {
			console.log('User mismatch');
			return res.redirect('back');
		}
	});
};
