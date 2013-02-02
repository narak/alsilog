var mysql = require('mysql'),
	conf = require('./config');

var conn = mysql.createConnection({
	host:  conf.db.hostname,
	port: conf.db.port,
	user: conf.db.username,
	password: conf.db.password,
	database: conf.db.database
});

/*
	Get connection.
*/
exports.get = function() {
	return conn;
}

/*
	Callback is provided an array of all the entries.
*/
exports.findAll = function(callback, error) {
	conn.query(
		"SELECT * FROM content ORDER BY timestamp DESC LIMIT 0, 10",
		function(err, rows, fields) {
			if (err) throw err;
			if (rows.length > 0) {
				callback(rows);
			} else {
				error();
			}
		}
	);
};

/*
	Callback is provided an array of all the blog entries.
*/
exports.findAllBlogs = function(callback, error) {
	conn.query(
		"SELECT * FROM content WHERE type='blog' ORDER BY timestamp DESC LIMIT 0, 10",
		function(err, rows, fields) {
			if (err) throw err;
			if (rows.length > 0) {
				callback(rows);
			} else {
				error();
			}
		}
	);
};

/*
	Callback is provided the single entry for the slug.
*/
exports.getBySlug = function(slug, callback, error) {
	conn.query(
		"SELECT * FROM content WHERE ?",
		{
			slug: slug
		},
		function(err, rows, fields) {
			if (err) throw err;
			if (rows.length > 0) {
				callback(rows[0]);
			} else {
				error();
			}
		}
	);
};