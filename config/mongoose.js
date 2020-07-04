const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codeial');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Something went wrong with the db'));

db.once('open', function() {
	console.log('Database successfully connected and running');
});
