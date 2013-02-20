exports.render = function(req, res, name, content) {
	if (req.headers.accept.indexOf('json') != -1) {
		res.json({
			content: content,
			view: name
		});
	} else {
		res.render(name, content);	
	}
};