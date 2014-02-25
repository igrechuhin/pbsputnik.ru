define(function (require) {
    'use strict';

    var $        = require('jquery'),
        _        = require('underscore'),
        Backbone = require('backbone'),

        language,
        gridConfig,
        gridData;

    $.jStorage = require('jStorage');

    function createSearchData (languageData, language) {
        function addSpaces (string) {
            return string.replace(/<\/p>/g,' <\/p>')
                    .replace(/<\/a>/g,' <\/a>');
        }
        var dataset = [];
        languageData.forEach(function (section) {
            section.content.forEach(function (project) {
                var header = (project.headerShort !== '' ?
                                project.headerShort : project.headerLong)
                                .replace(/&nbsp;/g,' '),
                    // images = project.images,
                    // image,

                    searchtext = $('<div/>').html(project.headerShort)
                                .append(' ').append(addSpaces(project.headerLong))
                                // .append(' ').append(addSpaces(project.descriptionLong))
                                // .append(' ').append(addSpaces(project.descriptionShort))
                                // .append(' ').append(addSpaces(project.customer))
                                .text(),
                    tokens;
                // if (images && images.length) {
                //     image = images[0].thumb !== '' ?
                //                 images[0].thumb : images[0].image;
                // }

                searchtext = searchtext.replace(/[,\/#«»!$%\^&\*;:{}=_`~()]/g,'')
                            .replace(/\.\s/g,' ')
                            .replace(/\.$/g,'')
                            .replace(/\s.{1,2}\s/g,' ')
                            .replace(/\s{2,}/g,' ')
                            .toLowerCase();
                tokens = searchtext.match(/\S+\s*/g);//.sort();
                tokens.forEach(function (token, index, tokens) { tokens[index] = token.replace(/\s/g,''); });
                tokens = _.uniq(tokens);//, true);

                dataset.push({
                    sectionName: section.header,
                    headerName: header,
                    value: header,
                    // imageUrl: image,

                    section: section.path,
                    place:   project.path,

                    tokens: tokens
                });
            });
        });
        $.jStorage.set('search.' + language, dataset);
    }

    gridData = Backbone.Model.extend({

        sync: function (method, model, options) {
            language   = options.data.language;

            var that = this,
                args = arguments,
                deferred = $.Deferred(),
                localHash = $.jStorage.get('hash', ''),
                localData = $.jStorage.get('data.' + language, null);
            $.ajax('spedit/?q=jsonout/hash').done(function (hashData) {
                var hash = hashData.hash;
                if (localHash === hash) {
                    if (localData !== null) {
                        deferred.resolve(localData);
                    }
                }
                that.urlRoot = 'spedit/?q=jsonout/' + language;
                Backbone.sync.apply(that, args).done(function (data) {
                    var sections = data.data[language];

                    sections.forEach(function (section) {
                        // section.id = parseInt(section.id, 10);
                        // section.cols = parseInt(section.cols, 10);
                        // section.colsMin = parseInt(section.colsMin, 10);
                        // section.colsMax = parseInt(section.colsMax, 10);

                        var projects = section.content || [];
                        projects.forEach(function (project) {
                            // project.id = parseInt(project.id, 10);
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
                    createSearchData(sections, language);

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

        urlRoot : 'spedit/?q=jsonout/lang',

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
        // options.url = 'http://www.pbsputnik.ru/' + options.url;
        // options.url = 'http://www.kultbit.ru/' + options.url;
        options.url = 'http://www.kuli-byaka.ru/' + options.url;
    });

    return {
        gridData: gridData,
        gridConfig: gridConfig,

        searchData: function () {
            return $.jStorage.get('search.' + language, null);
        }
    };
});
