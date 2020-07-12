const Post = require('../modals/post');

const Comment = require('../modals/comment');
const { response } = require('express');

module.exports.create = async function(req, res) {
	try {
		let post = await Post.create({
			content: req.body.content,
			user: req.user._id
		});
		if (req.xhr) {
			return res.status(200).json({
				data: {
					post: post
				},
				message: 'Post Created!'
			});
		}
		req.flash('success', 'Post Published');
		return res.redirect('back');
	} catch (err) {
		req.flash('error', err);
		console.log('error in creating a post');
		return res.redirect('back');
	}
};

module.exports.destroy = async function(req, res) {
	try {
		let post = await Post.findById(req.params.id);
		if (post.user == req.user.id) {
			//.id means converting the object id to string
			post.remove();
			await Comment.deleteMany({
				post: req.params.id
			});
			req.flash('success', 'Post Deleted');
			return res.redirect('back');
		} else {
			console.log('User mismatch');
			return res.redirect('back');
		}
	} catch (err) {
		req.flash('error', err);
		console.log(err);
		return res.redirect('/');
	}
};
