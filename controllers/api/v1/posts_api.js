const Post = require('../../../modals/post');

module.exports.index = async function(req, res) {
	try {
		let posts = await Post.find({}).sort('-createdAt').populate('user').populate({
			path: 'comments',
			populate: {
				path: 'user'
			}
		});
		res.status(200).json({
			message: 'lists of posts',
			posts: posts
		});
	} catch (error) {
		console.log(error);
		req.status(500).json({
			message: 'Internal Server Error'
		});
	}
};
