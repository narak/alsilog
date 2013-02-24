var alsi = alsi || {};

/*
Function that returns a formatted date string.
Recognises and keeps spaces, single quotes and slashes.
Formatting options:
	h - Hours.
	hh - Double digit hours. (For the sake of simplicity only 24 hour clock is supported.)
	a - am/pm
	A - AM/PM
	M - Minutes.
	MM - Double digit minutes.
	s - Seconds.
	ss - Double digit seconds.
	d - Day of the month.
	dd - Double digit day of the month.
	S - Day suffix st/nd/rd/th
	ddd - Three letter day name of the week.
	dddd - Full day name of the week.
	m - Number of the month.
	mm - Double digit number of the month.
	mmm - Three letter month name.
	mmmm - Full month name.
	yy - 2 digit year.
	yyyy - 4 digit year.
*/
(function() {
	'use strict';
	var mmm = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var mmmm = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var ddd = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	var dddd = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	var daySuffix = {
		1: 'st',
		2: 'nd',
		3: 'rd',
		21: 'st',
		22: 'nd',
		23: 'rd',
		31: 'st'
	};

	alsi.formatDate = function(format, date) {
		if (typeof format === 'undefined') {
			throw new Error('No date format specified.');
		}
		// Uses current date if date object is not set.
		if (typeof date === 'undefined') {
			date = new Date();
		} else if (!(date instanceof Date)) {
			throw new Error('Invalid date object.');
		}

		// Replacing all spaces with special characters so that they can be effectively put back in
		// during the processing.
		var escapedFormat = format.replace(/([ ,\\'-:\/@]){1}/g, '!$1!');

		// Split formatting string by ',' or ':' or '-'.
		var formatters = escapedFormat.split('!');

		// Character pointer to the format string to re-insert the delimiters.
		var charAt = 0;

		var output = '';
		var matched = true;
		for (var i=0; i<formatters.length; i++) {
			var formatter = formatters[i];
			charAt += formatter.length;
			switch(formatter) {
				case 'h':
				case 'H':
					var temp = date.getHours();
					temp = (formatter == 'H') ? temp :
							(temp > 11) ? temp - 12 : temp;
					output += new String(temp);
					break;

				case 'hh':
				case 'HH':
					var temp = date.getHours();
					temp = (formatter == 'HH') ? temp :
							(temp > 11) ? temp - 12 : temp;
					temp = new String(temp);
					if (temp.length == 1) {
						output += '0';
					}
					output += temp;
					break;

				case 'a':
				case 'A':
					var mer;
					var temp = date.getHours();
					var mer = (temp > 11) ? 'PM' : 'AM';
					var mer = (formatter == 'A') ? mer : mer.toLowerCase();
					output += mer;
					break;

				case 'M':
					output += new String(date.getMinutes());
					break;

				case 'MM':
					var temp = new String(date.getMinutes());
					if (temp.length == 1) {
						output += '0';
					}
					output += temp;
					break;

				case 's':
					output += new String(date.getSeconds());
					break;

				case 'ss':
					var temp = new String(date.getSeconds());
					if (temp.length == 1) {
						output += '0';
					}
					output += temp;
					break;

				case 'd':
					output += new String(date.getDate());
					break;

				case 'dd':
					var temp = new String(date.getDate());
					if (temp.length == 1) {
						output += '0';
					}
					output += temp;
					break;

				case 'S':
					var temp = date.getDate();
					var S = daySuffix[temp];
					S = (typeof S === 'undefined') ? 'th' : S;
					output = output.substring(0, output.length-1) + S;
					break;

				case 'ddd':
					output += ddd[date.getDay()];
					break;

				case 'dddd':
					output += dddd[date.getDay()];
					break;

				case 'm':
					output += new String(date.getMonth() + 1);
					break;

				case 'mm':
					var temp = new String(date.getMonth() + 1);
					if (temp.length == 1) {
						output += '0';
					}
					output += temp;
					break;

				case 'mmm':
					output += mmm[date.getMonth()];
					break;

				case 'mmmm':
					output += mmmm[date.getMonth()];
					break;

				case 'yyyy':
					output += new String(date.getFullYear());
					break;

				case 'yy':
					output += new String(date.getFullYear()).substring(2);
					break;

				default:
					output += formatter;
					break;
			}
		}
		return output;
	}
})();

// Make nodeNode module, if possible.
if (typeof exports == 'object' && exports) {
    exports.formatDate = alsi.formatDate;
}
