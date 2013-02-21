
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    RedisStore = require('connect-redis')(express),
    redis = require("redis").createClient(),

    view = require('./view-util'),
    conf = require('./config'),
    content = require('./routes/content'),
    admin = require('./routes/admin'),
    auth = require('./auth');

var app = express();

// Setting up the defaults.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: "aef61884dffcfe026143916ac5ec1c88223670f6",
  cookie: {httpOnly: true, secure: true},
  store: new RedisStore({
    host: conf.db['redis'].hostname,
    port: conf.db['redis'].port,
    client: redis
  })
}));
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler());
app.locals(conf.locals);

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

// Error handling.
// This handles 404 because its the default route handler. If non of the other routes
// match, this handler is called and it assumes 404.
app.use(function (req, res, next) {
  res.status(404);
  view.render(req, res, conf.templates.notFound, { error: 'Page Not Found', url: req.url });
});

// Method signature that invokes error handler.
app.use(function (err, req, res, next) {
  console.log('Ooh la la... an error!');
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

if (!module.parent) {
  app.listen(process.env.VCAP_APP_PORT || 3000);
  console.log('Express started on port 3000');
}