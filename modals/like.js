const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		//tis defines the object id of the liked object
		likeable: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			refPath: 'onModal'
		},
		//this field is used to describe the type of the liked object as it is a dynamic reference
		onModal: {
			type: String,
			required: true,
			enum: [ 'Post, Comment' ]
		}
	},
	{
		timestamps: true
	}
);

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
