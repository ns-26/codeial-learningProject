const mongoose = require('mongoose');

var commentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true
		},
		//comment belongs to a user
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post'
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Like'
			}
		]
	},
	{
		timestamps: true
	}
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
