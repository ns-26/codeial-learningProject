const Like = require('../modals/like');

const Post = require('../modals/post');

const Comment = require('../modals/comment');

module.exports.toggleLike = async function(req, res) {
	try {
		//likes/toggle/?id=dfads&type=Post
		let likeable;
		let deleted = false;

		if (req.query.type == 'Post') {
			likeable = await Post.findById(req.query.id).populate('likes');
		} else if (req.query.type == 'Comment') {
			likeable = await Comment.findById(req.query.id).populate('likes');
		} else {
			return res.status(404).json({
				message: 'Not Found'
			});
		}
		//check if a like already exists
		let existingLike = await Like.findOne({
			likeable: req.query.id,
			onModel: req.query.type,
			user: req.user._id
		});
		//if a like already exists then delete it
		if (existingLike) {
			likeable.likes.pull(existingLike._id);
			likeable.save();

			existingLike.remove();
			deleted = true;
		} else {
			let newLike = await Like.create({
				user: req.user._id,
				likeable: req.query.id,
				onModel: req.query.type
			});
			likeable.likes.push(newLike._id);
			likeable.save();
		}
		return res.status(200).json({
			message: 'reqeust successful',
			data: {
				deleted: deleted
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};
