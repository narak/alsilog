require(['require', 'jquery', 'marked'], function (require, $, marked) {
    'use strict';

    $(function () {
        var $mainContent = $('#main-content');

        (function () {
            // Mark down.
            var $markThis = $('blockquote.marked', $mainContent);
            var mdText = $markThis[0].innerHTML;
            //$markThis[0].innerHTML = marked(mdText);
            $markThis.on('dblclick', function () {
                $(this).attr('contenteditable', true);
            });
            $markThis.on('blur', function () {
                $(this).attr('contenteditable', false);
            });

        })();
    });
});
