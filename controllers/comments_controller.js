const Comment = require('../modals/comment');

const Post = require('../modals/post');

module.exports.create = function(req, res) {
	Post.findById(req.body.post, function(err, post) {
		if (err) {
			console.log('Error in finding the post');
		}
		if (post) {
			Comment.create(
				{
					content: req.body.content,
					user: req.user._id,
					post: req.body.post
				},
				function(err, comment) {
					if (err) {
						console.log('error in creating a comment');
					}
					post.comments.push(comment);
					post.save();
					res.redirect('/');
				}
			);
		}
	});
};
