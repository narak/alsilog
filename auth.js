
var conf = require('./config'),
	db = require('./' + conf.db['mysql'].lib);

exports.requireLogin = function(req, res, next) {
	console.info("Requiring login.")
	if (req.session.isLoggedIn == true &&
		req.session.email.length > 0) {
		next();
	} else {
	    res.render(conf.templates.login);
	}
};

exports.loginUser = function(req, res) {
	console.info("Login user.")
	db.loginUser(
		req.body.email, req.body.password,
		function(user) {
			req.session.email = user.email;
			req.session.isLoggedIn = true;
			res.redirect('/admin');
		},
		function() {
			res.render(conf.templates.login, {error: 'INVALID_USER_PASS'});
		}
	);
};

exports.logoutUser = function(req, res) {
	console.info("Logout user.")
	req.session.destroy();
	res.redirect('/admin');
};