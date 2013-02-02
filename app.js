
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    conf = require('./config'),
    content = require('./routes/content');

var app = express();

// Setting up the defaults.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler());
app.locals(conf.locals);

// Error handling.
// This handles 404 because its the default route handler. If non of the other routes
// match, this handler is called and it assumes 404.
app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render(conf.templates.notFound, { url: req.url });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// Method signature that invokes error handler.
/*app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.render('500', { error: err, title: err });
});*/

// Routes
app.get('/', content.index);
// Url slug passed to route.
app.get('/:slug', content.slug);

/*app.get('/404', function(req, res, next){
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});
app.get('/403', function(req, res, next){
  // trigger a 403 error
  var err = new Error('not allowed!');
  err.status = 403;
  next(err);
});
app.get('/500', function(req, res, next){
  // trigger a generic (500) error
  next(new Error('keyboard cat!'));
});*/

if (!module.parent) {
  app.listen(process.env.VCAP_APP_PORT || 3000);
  console.log('Express started on port 3000');
}