module.exports.index = function(req, res) {
	res.status(200).json({
		message: 'lists of posts',
		posts: []
	});
};
