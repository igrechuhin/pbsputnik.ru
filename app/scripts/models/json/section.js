define(function (require) {
    'use strict';

    var $        = require('jquery'),
        _        = require('underscore'),
        Backbone = require('backbone'),

        gridData, gridConfig;

    $.jStorage = require('jStorage');

    gridData = Backbone.Model.extend({

        sync: function (method, model, options) {
            var that = this,
                args = arguments,
                language = options.data.language,
                deferred = $.Deferred(),
                localHash = $.jStorage.get('hash', ''),
                localData = $.jStorage.get('data.' + language, null);
            $.ajax('?q=jsonout/hash').done(function (hashData) {
                var hash = hashData.hash;
                if (localHash === hash) {
                    if (localData !== null) {
                        deferred.resolve(localData);
                    }
                }
                that.urlRoot = '?q=jsonout/' + language;
                Backbone.sync.apply(that, args).done(function (data) {
                    var sections = data.data[language];

                    sections.forEach(function (section) {
                        section.id = parseInt(section.id, 10);
                        section.cols = parseInt(section.cols, 10);
                        section.colsMin = parseInt(section.colsMin, 10);
                        section.colsMax = parseInt(section.colsMax, 10);

                        var projects = section.content || [];
                        projects.forEach(function (project) {
                            project.id = parseInt(project.id, 10);
                            project.path = project.path || '';
                            project.headerShort = project.headerShort || '';
                            project.headerLong = project.headerLong || '';
                            project.customer = project.customer || '';
                            project.descriptionShort = project.descriptionShort || '';
                            project.descriptionLong = project.descriptionLong || '';
                            project.press = project.press || '';
                        });
                        section.content = projects;
                    });

                    $.jStorage.set('hash', hash);
                    $.jStorage.set('data.' + language, sections);
                    if (deferred.state() === 'pending') {
                        deferred.resolve(sections);
                    }
                });
            }).fail(function () {
                if (localData !== null) {
                    deferred.resolve(localData);
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise();
        }
    });

    gridConfig = Backbone.Model.extend({

        urlRoot : '?q=jsonout/lang',

        sync: function () {
            var deferred = $.Deferred(),
                localConfig = $.jStorage.get('config', null);
            if (localConfig !== null) {
                deferred.resolve(localConfig);
            }
            $.when(Backbone.sync.apply(this, arguments), $.ajax('config.json')).done(function (language, configJSON) {
                var config = jQuery.parseJSON(configJSON[0]);
                config.languages = [];
                _.each(language[0].lang[1], function (value, key) {
                    if (key === 'ru') {
                        config.languages = ['ru'].concat(config.languages);
                    } else {
                        config.languages.push(key);
                    }
                });
                $.jStorage.set('config', config);
                if (deferred.state() === 'pending') {
                    deferred.resolve(config);
                }
            }).fail(function () {
                deferred.reject();
            });
            return deferred.promise();
        }
    });

    $.ajaxPrefilter(function (options) {
        options.url = 'http://www.pbsputnik.ru/' + options.url;
        //options.url = 'http://www.kultbit.ru/' + options.url;
    });

    return {
        gridData: gridData,
        gridConfig: gridConfig
    };
});
