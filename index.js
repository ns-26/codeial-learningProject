const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

//use express router
app.use('/', require('./routes'));

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//port config
app.listen(port, function(err) {
	if (err) {
		console.log(`Error in running the server:${err}`);
	}
	console.log(`Port is running on :${port}`);
});
