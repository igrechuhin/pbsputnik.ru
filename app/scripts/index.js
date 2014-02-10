require.config({
    paths: {
        jquery:         '../bower_components/jquery/jquery',
        backbone:       '../bower_components/backbone/backbone',
        underscore:     '../bower_components/underscore/underscore',
        text:           '../bower_components/requirejs-text/text',
        bootstrap:      '../bower_components/sass-bootstrap/js',

        galleria:       '../bower_components/jquery-galleria/src/galleria',
        galleriaTheme:  '../bower_components/jquery-galleria/src/themes/classic/galleria.classic',

        jStorage:       '../bower_components/jstorage/jstorage',

        fitvids:        '../bower_components/FitVids/jquery.fitvids',

        typeahead:      '../bower_components/typeahead.js/dist/typeahead'
    },
    map: {
        '*': {
            'models/section': 'models/json/section'
            // 'models/section': 'models/memory/section'
        }
    },

    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        jquery: {
            exports: '$'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        galleria: {
            deps: ['jquery'],
            exports: 'Galleria'
        },
        galleriaTheme: {
            deps: ['galleria'],
            exports: 'GalleriaTheme'
        },
        jStorage: {
            exports: '$.jStorage'
        },
        fitvids: {
            exports: '$.fn.fitVids'
        }
    }
});

require([
        'backbone',
        'router',
        'galleria',
        'galleriaTheme'
    ], function (Backbone, Router) {
        'use strict';

        new Router();

        Backbone.history.start();

        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','googleAnalytics');

        // console.warn('Fix it before production');
        // googleAnalytics('create', 'UA-46702173-1', {
        //     'cookieDomain': 'none'
        // });
        googleAnalytics('create', 'UA-46702173-1', 'www.pbsputnik.ru');

        googleAnalytics('require', 'linkid', 'linkid.js');

        // console.warn('Fix <!--manifest="manifest.appcache"--> before production');
    });
