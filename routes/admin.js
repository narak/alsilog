var conf = require('../config'),
	db = require('../' + conf.db['mysql'].lib),
	view = require('../view-util'),
	alsiDate = require('../public/javascripts/date');

exports.index = function(req, res) {
	db.findAllBlogs(function(content) {
		for (var i = 0; i < content.length; i++) {
			content[i].date = alsiDate.formatDate(conf.dateFormat, content[i].timestamp);
		}
		view.render(req, res, conf.templates.admin, {content: content});
	});
};

exports.slug = function(req, res, next) {
	db.getBySlug(req.params.slug, function(content) {
		content.date = alsiDate.formatDate(conf.dateFormat, content.timestamp);
		// Type relates directly to the template used.
		view.render(req, res, conf.templates.pageEdit, content);
	}, next);
};