define(function (require) {
    'use strict';

    require('jquery');

    var _        = require('underscore'),
        Backbone = require('backbone'),

        template = _.template(require('text!tpl/Header.html')),

        that,

        $languages;

    return Backbone.View.extend({

        initialize: function (options) {
            that = this;
            that.options = options;
        },

        render: function (config) {
            that.$el.html(template({
                activeLanguage: config.activeLanguage,
                languages: that.options.languages,

                sections: config.sections
            }));

            $languages = that.$el.children('.languages');

            return that;
        },

        setHomeState: function (speed) {
            that.$el.hide()
                    .removeClass()
                    .addClass('home');

            setTimeout(function () {
                that.$el.fadeIn(speed);
            }, speed);
        },

        setProjectState: function (speed) {
            that.$el.hide()
                    .removeClass()
                    .addClass('project');

            setTimeout(function () {
                that.$el.fadeIn(speed);
            }, speed);
        }
    });
});
