var conf = require('../config'),
	db = require('../' + conf.db['mysql'].lib),
	alsiDate = require('../public/javascripts/date');

exports.index = function(req, res) {
	db.findAllBlogs(function(content) {
		for (var i = 0; i < content.length; i++) {
			content[i].date = alsiDate.formatDate(conf.dateFormat, content[i].timestamp);
		}
		res.render(conf.templates.admin, {content: content});
	});
};

exports.slug = function(req, res, next) {
	db.getBySlug(req.params.slug, function(content) {
		content.date = alsiDate.formatDate(conf.dateFormat, content.timestamp);
		// Type relates directly to the template used.
		res.render(conf.templates.pageEdit, content);
	}, next);
};