
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    RedisStore = require('connect-redis')(express),
    redis = require("redis").createClient(),

    conf = require('./config'),
    content = require('./routes/content'),
    admin = require('./routes/admin'),
    auth = require('./auth');

var app = express();

// Overloading app.render.
app.renderSimple = app.render;
app.render = function(name, options, fn) {
  console.log('Rendering: ' + name);
  app.renderSimple(name, options, fn)
};

// Setting up the defaults.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: "aef61884dffcfe026143916ac5ec1c88223670f6",
  store: new RedisStore({
    host: conf.db['redis'].hostname,
    port: conf.db['redis'].port,
    client: redis
  })
}));
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
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
// Admin routes
app.post('/admin/login', auth.loginUser);
app.get('/admin/logout', auth.logoutUser);

// Check if logged in on all admin/* routes.
app.all('/admin*', auth.requireLogin);
app.all('/admin', admin.index);
app.get('/admin/:slug', admin.slug);

if (!module.parent) {
  app.listen(process.env.VCAP_APP_PORT || 3000);
  console.log('Express started on port 3000');
}