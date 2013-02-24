/**
 * View module.
 */
define(['require', 'jquery', 'underscore'], function (require, $, _) {
    'use strict';
    return function (options) {
        if (options === undefined) {
            options = {};
        }

        var exports = {},
            tplCache = {},
            elCache = {},
            defaultTarget =  options.defaultTarget || '#main-content',
            titlePrepend = options.titlePrepend || 'alsilog',
            titleSep = options.titleSep || ' | ';


        var getTemplate = function (name, callback) {
            if (tplCache[name] === undefined) {
                require(['text!templates/' + name + '.html'], function (html) {
                    tplCache[name] = _.template(html);
                    callback(tplCache[name]);
                });
            } else {
                callback(tplCache[name]);
            }
        };

        var getEl = function (el) {
            if (elCache[el] === undefined) {
                elCache[el] = $(el);
            }
            return elCache[el];
        };

        exports.render = function (view, target, data) {
            if (target === undefined) {
                target = defaultTarget;
            }
            getTemplate(view, function (template) {
                var $el = getEl(target);
                if (data.title !== undefined) {
                    document.title = titlePrepend + titleSep + data.title;
                } else {
                    document.title = titlePrepend;
                }

                $el.fadeOut('fast', function () {
                    $el.html(template(data));
                    $el.fadeIn('fast');
                });
            });
        };
        return exports;
    };
});
