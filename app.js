var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var tasksRouter = require('./routes/tasks');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended :false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get("/scripts.js", function(request, response) {
  response.sendFile(__dirname + "/public/javascripts/scripts.js");
  });

// passport
var SQLiteStore = require('connect-sqlite3')(session);
app.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
app.use(passport.authenticate('session'));


app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);
// http://expressjs.com/en/starter/basic-routing.html

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;