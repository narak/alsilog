exports.render = function(req, res, name, content) {
	console.log(req.headers);
	if (req.headers.accept.indexOf('json') != -1) {
		res.json(content);
	} else {
		res.render(name, content);	
	}
};