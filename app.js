const express           = require("express"),
  app                   = express(),
  bodyParser            = require("body-parser"),
  mongoose              = require("mongoose"),
  methodOverride        = require("method-override"),
  flash                 = require("connect-flash"),
  passport              = require("passport"),
  localStrategy         = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  seed                  = require("./seed"),
  // Routes
  campRoutes            = require('./routes/campgrounds'),
  commentRoutes         = require('./routes/comments'),
  indexRoutes           = require('./routes/index');

// seed(); //seed the database

//App configuration
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(flash());

//Connecting to my database - demo
mongoose.connect(process.env.db_URL);
const Comment = require("./models/comments");
const Camp = require("./models/campgrounds");
const User = require("./models/user");

//Passport configuration
app.use(require("express-session")({
  secret: process.env.sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//User Data
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Routes
app.use(campRoutes);
app.use(commentRoutes);
app.use('/', indexRoutes);

// Server
app.listen(process.env.PORT, process.env.IP, () => {
  console.log('YelpCamp server has started');
  console.log('Preview your app at: ' + process.env.preview_URL);
});
