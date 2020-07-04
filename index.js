const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');

//express layout
app.use(expressLayouts);
//extract styles and scripts fron sub pages
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//use express router
app.use('/', require('./routes'));

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//static files
app.use(express.static('./assets'));

//port config
app.listen(port, function(err) {
	if (err) {
		console.log(`Error in running the server:${err}`);
	}
	console.log(`Port is running on :${port}`);
});
