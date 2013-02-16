
var conf = require('../config'),
	db = require('../' + conf.db['mysql'].lib),
	alsiDate = require('../public/javascripts/date');

exports.login = function(req, res) {
	res.render('admin');
};

exports.loginSubmit = function(req, res) {
	console.log('processing login');
	res.render('admin');
};