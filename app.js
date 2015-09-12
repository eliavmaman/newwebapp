var express = require('express'),
  path = require('path'),
//favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
//db = require('./model/db'),
  mongoose = require('mongoose'),
  User = require('./model/user'),
  routes = require('./routes/index'),
  users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


var db = mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/nodewebapp');
//var db = mongoose.createConnection('mongodb://localhost/nodewebapp');
//var User = db.model('user');

app.set('db', db);
app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function(req, res, next) {
  // Handle the get for this route
});

app.post('/', function(req, res, next) {
  // Handle the post for this route
});


app.post('/login', function (req, res, next) {
  console.log("post login : " + req.body);

  User.findOne({userName: req.body.userName, password: req.body.password}).then(function (user) {
    res.status(200).send(user);
  });

});

app.post('/signup', function (req, res, next) {
  console.log("post signup : " + JSON.stringify(req.body));
  var user = new User();
  user.userName = req.body.userName;
  user.password = req.body.password;

  console.log(JSON.stringify(user));
  user.save(function (err) {
    if (err) return next(err);
    res.json({message: 'Success!'});
  });
  //memo.save(function(err) {
  //  if(err) return next(err);
  //  res.json({ message : 'Success!'});
  //});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
