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

module.exports.destroy = function(req, res) {
	Comment.findById(req.params.id, function(err, comment) {
		let postId = comment.post;
		if (err) {
			console.log('comment does not exist');
			return res.redirect('back');
		} else if (req.user.id == comment.user) {
			comment.remove();
			Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } }, function(err, post) {
				if (err) {
					console.log('error in deleting the post');
					return res.redirect('back');
				}
				return res.redirect('back');
			});
		} else if (true) {
			Post.findById(postId, function(err, post) {
				if (err) {
					console.log('post not found');
				} else if (post.user == req.user.id) {
					comment.remove();
					Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } }, function(err, post) {
						if (err) {
							console.log('error in deleting the post');
							return res.redirect('back');
						}
						return res.redirect('back');
					});
				}
			});
		} else {
			return res.redirect('back');
		}
	});
};
