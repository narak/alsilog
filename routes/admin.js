var conf = require('../config'),
    db = require('../' + conf.db['mysql'].lib),
    view = require('../view-util'),
    alsiDate = require('../public/javascripts/lib/date');

exports.index = function(req, res, next) {
    db.findAllBlogs(function(content) {
        for (var i = 0; i < content.length; i++) {
            content[i].date = alsiDate.formatDate(conf.dateFormat, content[i].timestamp);
        }
        view.render(req, res, conf.templates.admin, {content: content});
    }), next;
};

exports.slug = function(req, res, next) {
    db.getBySlug(req.params.slug, function(content) {
        content.date = alsiDate.formatDate(conf.dateFormat, content.timestamp);
        // Type relates directly to the template used.
        view.json(req, res, conf.templates.pageEdit, content);
    }, next);
};
