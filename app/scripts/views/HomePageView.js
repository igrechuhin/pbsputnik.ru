define(function (require) {
    'use strict';

    var Backbone = require('backbone'),
        _        = require('underscore'),
        tpl      = require('text!tpl/Home.html');

    return Backbone.View.extend({

        template: _.template(tpl),

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        }

    });
});
