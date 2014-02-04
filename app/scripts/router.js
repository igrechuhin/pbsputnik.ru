define(function (require) {
    'use strict';

    function makePath (value) {
        return _.isNull(value) ? undefined : value;
    }

    var _          = require('underscore'),
        Backbone   = require('backbone'),

        controller = require('controllers/home');

    return Backbone.Router.extend({
        routes: {
            '(!)(/:language)(/:section)(/:place)': 'openSection'
        },

        openSection: function (language, section, place) {
            controller.run({
                router:   this,
                language: makePath(language),
                section:  makePath(section),
                place:    makePath(place)
            });
        }
    });
});
