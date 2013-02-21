require.config({
    baseUrl: '../javascripts',
    paths: {
        'underscore': 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore',
        'marked': 'vendor/marked',
        'history': 'vendor/history',
        'date': 'lib/date',
        'page-edit': 'lib/page-edit',
        'view': 'lib/view',
        'boostrap': 'vendor/bootstrap'
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

require(['require', 'jquery', 'underscore', 'history', 'view', 'boostrap'], function (require, $, _, History, View) {
    'use strict';

    // Bind to StateChange Event
    History.Adapter.bind(window, 'statechange', function () {
        var state = History.getState();
        ajaxify(state.url, state.data);
    });

    var urlDataCache = {};
    var view;
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
        view = View();
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
