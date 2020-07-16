const Post = require('../../../modals/post');

const Comment = require('../../../modals/comment');

module.exports.index = async function(req, res) {
	try {
		let posts = await Post.find({})
			.sort('-createdAt')
			.populate({
				path: 'user',
				select: {
					password: 0,
					__v: 0
				}
			})
			.select({
				__v: 0
			})
			.populate({
				path: 'comments',
				select: {
					__v: 0
				},
				populate: {
					path: 'user',
					select: {
						password: 0,
						__v: 0
					}
				}
			});
		// return res.send(data);
		res.status(200).json({
			message: 'lists of posts',
			posts: posts
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};

module.exports.destroy = async function(req, res) {
	try {
		let post = await Post.findById(req.params.id);
		// if (post.user == req.user.id) {
		//.id means converting the object id to string
		post.remove();
		await Comment.deleteMany({
			post: req.params.id
		});
		return res.status(200).json({
			message: 'Post and associated Comments deleted successfully'
		});
		// } else {
		// 	console.log('User mismatch');
		// 	return res.redirect('back');
		// }
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};
