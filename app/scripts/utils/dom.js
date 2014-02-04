define(function (require) {
    'use strict';

    var $ = require('jquery');

    return {

        $window: $(window),
        $doc:    $(window.document),
        $html:   $(window.document.documentElement),
        $head:   $(window.document.getElementsByTagName('head')[0]),
        $body:   $(window.document.body),

        loadScript: function (url) {

            //Unload if script is loaded
            $('script[src="' + url + '"]').remove();

            this.$head.append($('<script>').attr({
                src: url,
                type: 'text/javascript',
                async: true
            }));
        }

    };
});
