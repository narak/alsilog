/*
	Common configurations used throughout the application.
*/

if (process.env.NODE_ENV == 'production') {
	var env = JSON.parse(process.env.VCAP_SERVICES),
	// appfog env
	    afEnv = env['mysql-5.1'][0]['credentials'];

	exports.db = {
		lib	 	: 'mysql-lib',
		hostname    : afEnv.hostname,
		port 	 	: afEnv.port,
		username    : afEnv.username,
		password 	: afEnv.password,
		database 	: 'alsilog_site'
	};
	exports.locals = {
		title: 'Home',
		baseUrl: 'http://alsilog.com'
	};
} else {
	exports.db = {
		lib	 	: 'mysql-lib',
		hostname 	: 'localhost',
		port		: '3306',
		username 	: 'alsilog',
		password 	: 'alsilog',
		database	: 'alsilog'
	};
	exports.locals = {
	    title: 'Home',
	    baseUrl: 'http://localhost:3000'
	};
}

exports.templates = {
	single		: 'single',
	blog		: 'blog',
	index		: 'index',
	notFound	: '404',
	admin		: 'admin'
};

exports.dateFormat = 'd S mmmm, yyyy at H:MM';