define(function (require) {
    'use strict';

    // require('jquery');

    var _        = require('underscore'),
        Backbone = require('backbone'),

        template = _.template(require('text!tpl/Projects/Footer.html'));

    return Backbone.View.extend({

        render: function (config) {
            this.$el.html(template({
                title: config.title,
                footer: config.footer
            }));

            return this;
        }
    });
});
