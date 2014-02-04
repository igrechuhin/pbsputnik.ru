require.config({

    paths: {
        jquery:     '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore/underscore',
        text:       '../bower_components/requirejs-text/text'
    },

    shim: {
        underscore: {
            exports: '_'
        },
        jquery: {
            exports: '$'
        }
    }
});

require(['jquery', 'underscore', 'utils/dom', 'text!tpl/Issuu.html'], function ($, _, DOM, tpl) {
    'use strict';

    DOM.$doc.ready(function() {
        function parseParameters (str) {
            var parameters = str.match(/([^=&?]+)=([^&]+)/g),
                i, keyValuePair,
                options = {};
            for (i = parameters.length - 1; i >= 0; i -= 1) {
                keyValuePair = parameters[i].split('=');
                options[keyValuePair[0]] = keyValuePair[1];
            }
            return options;
        }

        var options = parseParameters(document.location.search),

            template = _.template(tpl);

        DOM.$body.html(template({bookID: options.bookID}));
    });

});
