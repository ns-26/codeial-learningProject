const express = require("express"),
  app = express(),
  port = 8000,
  env = require("./config/environment"),
  logger = require("morgan"),
  path = require("path"),
  db = require("./config/mongoose"),
  expressLayouts = require("express-ejs-layouts"),
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  passport = require("passport"),
  passportLocal = require("./config/passport_local_stratergy"),
  passportJWT = require("./config/passport_jwt_strategy"),
  passportGoogle = require("./config/passport-google-oauth2-strategy"),
  mongoStore = require("connect-mongo")(session), //storing the session where the connect needs to work
  sassMiddleware = require("node-sass-middleware"),
  flash = require("connect-flash"),
  customMware = require("./config/middleware");
require("./config/view_helpers")(app);

// socket config (chat server)
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is listening on port 5000");

if (env.name == "development") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "/scss"),
      dest: path.join(__dirname, env.asset_path, "/css"),
      debug: true,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}

//form controller
app.use(express.urlencoded({ extended: true }));

//cookie settings
app.use(cookieParser());

//setting up uploads
app.use("/uploads", express.static(__dirname + "/uploads"));

//static files
app.use(express.static(env.asset_path));

app.use(logger(env.morgan.mode, env.morgan.options));

//express layout
app.use(expressLayouts);
//extract styles and scripts fron sub pages
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//mongostore is used to store the session cookie

app.use(
  session({
    name: "codeial",
    //change the secret before before deployment in production

    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new mongoStore(
      {
        mongooseConnection: db,
        autoReconnect: "disabled",
      },
      function (err) {
        console.log(err || "connect mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//flash uses  cookies and express sessions as locals
app.use(flash());

app.use(customMware.setFlash);

//use express router
app.use("/", require("./routes"));

//port config
app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server:${err}`);
  }
  console.log(`Port is running on :${port}`);
});
