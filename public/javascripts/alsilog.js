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
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var state = History.getState(); // Note: We are using History.getState() instead of event.state
        History.log(state.data, state.title, state.url);
        ajaxify(state.data);
    });

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

	var ajaxify = function(state) {
		$.getJSON(state.url, function(data) {
			view.render(state.type, state.target, data);
		});
		return false;
	};

    $(function() {
    	$(document).on('click', 'a.ajaxify', function(e) {
    		e.preventDefault();
    		var $this = $(this);
    		var state = {
    			url: $this.attr('href'),
    			type: $this.data('type'),
    			target: $this.data('target')
    		};
			History.pushState(state, $this.attr('title'), state.url);
    	});
    });
});