const Comment = require('../modals/comment');

const Post = require('../modals/post');

const commentMailer = require('../mailers/comments_mailer');

const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');

module.exports.create = async function(req, res) {
	try {
		let post = await Post.findById(req.body.post);
		if (post) {
			let comment = await Comment.create({
				content: req.body.content,
				user: req.user._id,
				post: req.body.post
			});
			post.comments.push(comment);
			post.save();

			comment = await comment.populate('user', 'name email').execPopulate();
			// commentMailer.newComment(comment);
			// let job = queue.create('comments', comment).save(function(err) {
			// 	if (err) {
			// 		console.log('Error in creating the queue', err);
			// 		return;
			// 	}
			// 	console.log('job enqued', job.id);
			// });

			if (req.xhr) {
				return res.status(200).json({
					data: {
						comment: comment
					},
					message: 'Comment Created!'
				});
			}
			req.flash('success', 'Comment Created');
			return res.redirect('/');
		} else {
			req.flash('error', 'Unable to find the associated post');
			console.log('post not found');
			return res.redirect('back');
		}
	} catch (err) {
		console.log(err);
		req.flash('error', err);
		return res.redirect('back');
	}
};

module.exports.destroy = async function(req, res) {
	try {
		let comment = await Comment.findById(req.params.id);
		let postId = comment.post;
		if (req.user.id == comment.user) {
			comment.remove();
			await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
			if (req.xhr) {
				return res.status(200).json({
					data: {
						comment_id: req.params.id
					},
					message: 'Post Deleted'
				});
			}
			req.flash('success', 'Comment Deleted');
			return res.redirect('back');
		} else if (true) {
			let post = await Post.findById(postId);
			if (post.user == req.user.id) {
				comment.remove();
				await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
				if (req.xhr) {
					return res.status(200).json({
						data: {
							comment_id: req.params.id
						},
						message: 'Post Deleted'
					});
				}
				req.flash('success', 'Comment Deleted');
				return res.redirect('back');
			} else {
				req.flash('error', 'User not authorized');
				console.log('User not found');
				return res.redirect('back');
			}
		}
	} catch (err) {
		console.log(err);
		req.flash('error', err);
		return res.redirect('back');
	}
};
