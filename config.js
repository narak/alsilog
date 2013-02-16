/*
	Common configurations used throughout the application.
*/

if (process.env.NODE_ENV == 'production') {
	 // appfog environment variable
	var env = JSON.parse(process.env.VCAP_SERVICES),
	    mysqlAfEnv = env['mysql-5.1'][0]['credentials'],
	    redisAfEnv = env['redis-2.2'][0]['credentials'];
	exports.db = {};
	exports.db['mysql'] = {
		lib	 		: 'mysql-lib',
		hostname    : mysqlAfEnv.hostname,
		port 	 	: mysqlAfEnv.port,
		username    : mysqlAfEnv.username,
		password 	: mysqlAfEnv.password,
		database 	: 'alsilog_site'
	};
	exports.db['redis'] = {
		hostname    : redisAfEnv.hostname,
		port 	 	: redisAfEnv.port
	};
	exports.locals = {
		title: 'Home',
		baseUrl: 'http://alsilog.com'
	};
} else {
	exports.db = {};
	exports.db['mysql'] = {
		lib	 	: 'mysql-lib',
		hostname 	: 'localhost',
		port		: '3306',
		username 	: 'alsilog',
		password 	: 'alsilog',
		database	: 'alsilog'
	};
	exports.db['redis'] = {
		hostname    : 'localhost',
		port 	 	: '6379'
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
	admin		: 'admin',
	error 		: 'error',
	login 		: 'login',
	pageEdit	: 'page_edit'
};

exports.dateFormat = 'd S mmmm, yyyy at H:MM';