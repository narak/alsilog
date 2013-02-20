var conf = require('../config'),
	db = require('../' + conf.db['mysql'].lib),
	view = require('../view-util'),
	alsiDate = require('../public/javascripts/date'),
	// Markdown parser.
	marked = require('marked');

exports.index = function(req, res, next) {
	db.findAllBlogs(function(content) {
		for (var i = 0; i < content.length; i++) {
			content[i].date = alsiDate.formatDate(conf.dateFormat, content[i].timestamp);
		}
		view.render(req, res, conf.templates.index, {content: content});
	}, next);
};

exports.slug = function(req, res, next) {
	db.getBySlug(req.params.slug, function(content) {
		content.content = marked(content.content);
		content.date = alsiDate.formatDate(conf.dateFormat, content.timestamp);
		// Type relates directly to the template used.
		view.render(req, res, conf.templates[content.type], content);
	}, next);
};