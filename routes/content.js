
var conf = require('../config'),
	db = require('../' + conf.db.lib),
	// Markdown parser.
	marked = require('marked');

exports.index = function(req, res) {
	db.findAllBlogs(function(content) {
		res.render(conf.templates.index, {content: content});
	});
};

exports.slug = function(req, res, next) {
	db.getBySlug(req.params.slug, function(content) {
		content.content = marked(content.content);
		// Type relates directly to the template used.
		res.render(conf.templates[content.type], content);
	}, next);
};