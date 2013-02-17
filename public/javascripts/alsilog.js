require.config({
	baseUrl: "javascripts",
	paths: {
	    "underscore": "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore"
	},
	shim: {
    	underscore: {
  			exports: '_'
    	}
	}
});

require(['require', 'jquery', 'underscore'], function(require, $, _) {
	// Template tag for _.
	_.templateSettings = {
	    interpolate: /\{\{\=(.+?)\}\}/gim,
	    evaluate: /\{\{(.+?)\}\}/gim
	};

	var view = (function() {
		var exports = {},
			tplCache = {},
			elCache = {},
			defaultTarget = '#main-content';
		var getTemplate = function(name, callback) {
			if (typeof tplCache[name] === 'undefined') {
				require(['text!templates/' + name + '.html'], function(html) {
					tplCache[name] = _.template(html);
					callback(tplCache[name]);
				});
			} else {
				callback(tplCache[name]);
			}
		};

		var getEl = function(el) {
			if (typeof elCache[el] === 'undefined') {
				elCache[el] = $(el);
			}
			return elCache[el];
		};

		exports.render = function(view, target, data) {
			if (typeof target === 'undefined') {
				target = defaultTarget;
			}
			getTemplate(view, function(template) {
				var $el = getEl(target);
				$el.fadeOut('fast', function() {
					getEl(target).html(template(data));
					$el.fadeIn('fast');
				});
			});
		};

		return exports;
	})();

    $(function() {
    	$(document).on('click', 'a.ajaxify', function(e) {
    		e.preventDefault();
    		var $this = $(this);
    		$.getJSON($this.attr('href'), function(data) {
    			view.render($this.data('type'), $this.data('target'), data);
    		});
			return false;
    	});
    });
});