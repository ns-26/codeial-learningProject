const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	token: {
		type: String,
		required: true
	},
	isValid: {
		type: Boolean,
		required: true
	}
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
