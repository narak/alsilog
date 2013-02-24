require.config({
    baseUrl: '../javascripts',
    paths: {
        'underscore': 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore',
        'history': 'vendor/history',
        'view': 'lib/view',
    },
    shim: {
        'underscore': {
            exports: '_',
            init: function () {
                _.templateSettings = {
                    interpolate: /\{\{\=(.+?)\}\}/gim,
                    evaluate: /\{\{(.+?)\}\}/gim
                };
                return _;
            }
        },
        'history': {
            exports: 'History'
        }
    }
});

require(['require', 'jquery', 'underscore', 'history', 'view'], function (require, $, _, History, View) {
    'use strict';

    // Template tag for _.
    _.templateSettings = {
        interpolate: /\{\{\=(.+?)\}\}/gim,
        evaluate: /\{\{(.+?)\}\}/gim
    };

    // Bind to StateChange Event
    History.Adapter.bind(window, 'statechange', function () {
        var state = History.getState();
        ajaxify(state.url, state.data);
    });

    var view = View();

    var urlDataCache = {};
    var ajaxify = function (url, state) {
        if (urlDataCache[url] === undefined) {
            $.getJSON(url, function (data) {
                urlDataCache[url] = data;
                view.render(data.view, state.target, data.content);
            });
        } else {
            var data = urlDataCache[url];
            view.render(data.view, state.target, data.content);
        }
    };

    $(function () {
        $(document).on('click', 'a.ajaxify', function (e) {
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
