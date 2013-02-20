require.config({
	baseUrl: "javascripts",
	paths: {
	    "underscore": "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore"
	},
	shim: {
    	underscore: {
  			exports: '_'
    	},
    	history: {
    		exports: 'History'
    	}
	}
});

require(['require', 'jquery', 'underscore', 'history'], function(require, $, _, History) {
	// Template tag for _.
	_.templateSettings = {
	    interpolate: /\{\{\=(.+?)\}\}/gim,
	    evaluate: /\{\{(.+?)\}\}/gim
	};

	// Bind to StateChange Event
    History.Adapter.bind(window,'statechange',function() {
        var state = History.getState();
        ajaxify(state.url, state.data);
    });

	var view = (function() {
		var exports = {},
			tplCache = {},
			elCache = {},
			defaultTarget = '#main-content',
			titlePrepend = 'alsilog',
			titleSep = ' | ';
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
					if (typeof data.title !== 'undefined') {
						document.title = titlePrepend + titleSep + data.title;
					} else {
						document.title = titlePrepend;
					}
					getEl(target).html(template(data));
					$el.fadeIn('fast');
				});
			});
		};

		return exports;
	})();

	var urlDataCache = {};
	var ajaxify = function(url, state) {
		if (typeof urlDataCache[url] === 'undefined') {
			$.getJSON(url, function(data) {
				urlDataCache[url] = data;
				view.render(data.view, state.target, data.content);
			});
		} else {
			var data = urlDataCache[url];
			view.render(data.view, state.target, data.content);
		}
	};

    $(function() {
    	$(document).on('click', 'a.ajaxify', function(e) {
    		e.preventDefault();
    		var $this = $(this);
    		var state = {
    			type: $this.data('type'),
    			target: $this.data('target')
    		};
			History.pushState(state, $this.attr('title'), $this.attr('href'));
    	});
    });
});