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

            var deferred   = $.Deferred(),
                localHash  = $.jStorage.get('hash', ''),
                localData  = $.jStorage.get('data.' + language, null);

            $.ajax('hash.json').done(function (hash) {
                // console.warn('Fix it before production');
                if (localHash === hash) {
                    if (localData !== null) {
                        deferred.resolve(localData);
                    }
                } else {
                    $.jStorage.flush();
                }
                $.ajax('data.json').done(function (data) {
                    var languageData = data[language];

                    $.jStorage.set('hash', hash);
                    $.jStorage.set('data.' + language, languageData);
                    createSearchData(languageData, language);

                    if (deferred.state() === 'pending') {
                        deferred.resolve(languageData);
                    }
                }).fail(function () {
                    if (localData !== null) {
                        deferred.resolve(localData);
                    } else {
                        deferred.reject();
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

        sync: function () {
            var deferred = $.Deferred(),
                localConfig = $.jStorage.get('config', null);
            // console.warn('Fix it before production');
            if (localConfig !== null) {
                deferred.resolve(localConfig);
            }
            $.ajax('config.json').done(function (config) {
                $.jStorage.set('config', config);
                if (deferred.state() === 'pending') {
                    deferred.resolve(config);
                }
            }).fail(function () {
                if (deferred.state() === 'pending') {
                    deferred.reject();
                }
            });
            return deferred.promise();
        }
    });

    // $.ajaxPrefilter(function (options) {
        // console.log(options.url);
        // options.url = 'http://www.pbsputnik.ru/' + options.url;
        // options.url = 'http://www.kultbit.ru/' + options.url;
    // });

    return {
        gridConfig: gridConfig,
        gridData: gridData,

        searchData: function () {
            return $.jStorage.get('search.' + language, null);
        }
    };
});
