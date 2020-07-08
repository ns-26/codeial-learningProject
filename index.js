const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport_local_stratergy');
const mongoStore = require('connect-mongo')(session); //storing the session where the connect needs to work
const sassMiddleware = require('node-sass-middleware');

app.use(
	sassMiddleware({
		src: './assets/scss',
		dest: './assets/css',
		debug: true,
		outputStyle: 'extended',
		prefix: '/css'
	})
);

//form controller
app.use(express.urlencoded({ extended: true }));

//cookie settings
app.use(cookieParser());

//static files
app.use(express.static('./assets'));

//express layout
app.use(expressLayouts);
//extract styles and scripts fron sub pages
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//mongostore is used to store the session cookie

app.use(
	session({
		name: 'codeial',
		//change the secret before before deployment in production

		secret: 'blahsomething',
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 1000 * 60 * 100
		},
		store: new mongoStore(
			{
				mongooseConnection: db,
				autoReconnect: 'disabled'
			},
			function(err) {
				console.log(err || 'connect mongodb setup ok');
			}
		)
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//use express router
app.use('/', require('./routes'));

//port config
app.listen(port, function(err) {
	if (err) {
		console.log(`Error in running the server:${err}`);
	}
	console.log(`Port is running on :${port}`);
});
