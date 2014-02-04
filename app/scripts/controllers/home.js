/* global googleAnalytics */
define(function (require) {
    'use strict';

    function updateRoute (route) {
        gridConfig.section = route.section;
        gridConfig.place = route.place;

        var path = ['#!/', gridConfig.language],
            rest = path.length,
            nbsp = new RegExp('&nbsp;', 'g'),
            pathString,
            header, description,
            pageTitle;

        if (!_.isUndefined(gridConfig.section)) {
            rest += 1;
            path.push('/', gridConfig.section);
            if (!_.isUndefined(gridConfig.place)) {
                path.push('/', gridConfig.place);
            }
        }

        pathString = path.join('');
        header = headers[_.rest(path,rest).join('')];
        description = descriptions[_.rest(path,rest).join('')];
        pageTitle = gridConfig.title[gridConfig.language] + (header === '' ? '' : ' - ' + header);

        _.defer(function () {
            gridConfig.router.navigate(pathString, { trigger: false });

            showPage();

            googleAnalytics('send', 'pageview', {
                'page': '/' + pathString,
                'title': pageTitle
            });

            document.title = pageTitle.replace(nbsp, ' ');
            $metaDescription.attr('content',
                (header + (description === '' ? '' : '. ' + description)).replace(nbsp, ' ')
            );
        });
    }

    function loadProject (gridData, activeBox, activeProject) {
        var config = {
            gridData:      gridData,

            searchString:  gridConfig.search[gridConfig.language],
            searchData:    Models.searchData(),
            searchLimit:   gridConfig.searchLimit,

            activeBox:     activeBox,
            activeProject: activeProject
        };

        projectView.render(config);
        footerView.render({
            title: gridConfig.title[gridConfig.language ],
            footer: gridConfig.footer[gridConfig.language ]
        });
    }

    function showPage () {
        if (_.isUndefined(gridConfig.place)) {
            if (parallax[pages.home] !== parallax.current) {
                headerView.setHomeState(parallax.speed);
                parallax[pages.home].top(function () {
                    $body.animate({'scrollTop': 0}, 'fast', 'swing');
                });
            }
        } else {
            headerView.setProjectState(parallax.speed);
            if (parallax[pages.project] === parallax.current) {
                projectView.load();
            } else {
                parallax[pages.project].bottom(_.delay(function () {
                    projectView.load();
                }, 200));
            }
        }
    }

    function linkHandler () {
        projectView.unload();
        Layout.run();
    }

    function languageChangeHandler (language) {
        Layout.clearGrid();
        loadData(language).done(Layout.run);
    }

    var $           = require('jquery'),
        _           = require('underscore'),

        Models      = require('models/section'),

        // DOM         = require('utils/dom'),
        parallax    = require('utils/parallax'),
        isMobile    = require('utils/ismobile'),

        HomeView    = require('views/HomePageView'),
        HeaderView  = require('views/HeaderView'),
        FooterView  = require('views/FooterView'),
        ProjectView = require('views/ProjectView'),

        Layout      = require('./home/layout'),

        modelConfig = new Models.gridConfig(),
        modelData   = new Models.gridData(),

        homeView    = new HomeView({ el: $('.container') }),
        headerView,
        footerView,
        projectView,

        gridConfig = {
            $grid:       $('#Grid', homeView.el),

            updateRoute: updateRoute,
            loadProject: loadProject
        },

        pages = {
            home:    'Home',
            project: 'Project'
        },

        headers = {},
        descriptions = {},

        $body = $('body,html'),

        $metaDescription = $('meta[name=description]');

    function sortProjects (data) {
        data.forEach(function (element) {
            element.content.sort(function (a, b) { return b.id - a.id; });
        });
    }

    function parseHeadersAndDescriptions (data) {
        _.each(data, function (section) {
            headers[section.path] = section.header;
            descriptions[section.path] = '';
            _.each(section.content, function (project) {
                var key = [section.path, '/', project.path].join('');
                headers[key] = section.header + (project.headerShort === '' ? '' : ' - ' + project.headerShort);
                descriptions[key] = project.descriptionShort;
            });
        });
    }

    function loadData (language) {
        var deferred = $.Deferred();

        modelData.fetch({reset: true, data: {'language': language}}).done(function (data) {
            gridConfig.language = language;
            sortProjects(data);
            parseHeadersAndDescriptions(data);
            Layout.setData(data);

            headerView.render({
                activeLanguage: gridConfig.language,
                sections: data
            });

            deferred.resolve();
        }).fail(function () {
            console.error('Unable to fetch grid data');
            googleAnalytics('send', 'exception', {
                'exFatal': true
            });
        });

        return deferred.promise();
    }

    projectView = new ProjectView({
        el: $('#Content', homeView.el),
        events: {
            'click nav .projects li:not(.active)': function (event) {
                gridConfig.place = $(event.target).data('place');
                linkHandler();
                googleAnalytics('send', {
                    'hitType': 'event',
                    'eventCategory': 'views/ProjectView',
                    'eventAction': 'click',
                    'eventLabel': 'nav .projects li:not(.active)'
                });
            },
            'click nav .sections li:not(.active)': function (event) {
                gridConfig.section = $(event.target).data('section');
                gridConfig.place = $(event.target).data('place');
                linkHandler();
                googleAnalytics('send', {
                    'hitType': 'event',
                    'eventCategory': 'views/ProjectView',
                    'eventAction': 'click',
                    'eventLabel': 'nav .sections li:not(.active)'
                });
            },
            'click a': function () {
                linkHandler();
                googleAnalytics('send', {
                    'hitType': 'event',
                    'eventCategory': 'views/ProjectView',
                    'eventAction': 'click',
                    'eventLabel': 'a'
                });
            }
        }
    });

    projectView.on('search', function (event) {
        gridConfig.section = event.section;
        gridConfig.place = event.place;
        linkHandler();
        googleAnalytics('send', {
            'hitType': 'event',
            'eventCategory': 'views/ProjectView',
            'eventAction': 'search',
            'eventLabel': event.sectionName + ' ' + event.headerName
        });
    });

    footerView = new FooterView({ el: $('#Footer', homeView.el) });

    (function addPages2Parallax () {
        parallax.speed = isMobile.any() ? 900 : 700;
        parallax.add(homeView.$el.children('#' + pages.home))
                .add(homeView.$el.children('#' + pages.project));
    }());

    return {
        run: function (config) {
            $.extend(true, gridConfig, config);
            gridConfig.section = config.section;
            gridConfig.place = config.place;

            modelConfig.fetch({reset: true}).done(function (config) {
                $.extend(true, gridConfig, config);

                headerView = new HeaderView({
                    el: $('#Header', homeView.el),

                    events: {
                        'click .logo': function () {
                            gridConfig.section = undefined;
                            gridConfig.place = undefined;
                            linkHandler();
                            googleAnalytics('send', {
                                'hitType': 'event',
                                'eventCategory': 'views/HeaderView',
                                'eventAction': 'click',
                                'eventLabel': '.logo'
                            });
                        },

                        'click nav .sections li': function (event) {
                            gridConfig.section = $(event.target).data('section');
                            gridConfig.place = $(event.target).data('place');
                            linkHandler();
                            googleAnalytics('send', {
                                'hitType': 'event',
                                'eventCategory': 'views/HeaderView',
                                'eventAction': 'click',
                                'eventLabel': 'nav .sections li'
                            });
                        },

                        'click .languages :not(.active,.separator)': function (event) {
                            languageChangeHandler($(event.target).data('language'));
                            googleAnalytics('send', {
                                'hitType': 'event',
                                'eventCategory': 'views/HeaderView',
                                'eventAction': 'click',
                                'eventLabel': '.languages :not(.active,.separator)'
                            });
                        }
                    },

                    languages: gridConfig.languages
                });

                Layout.init(gridConfig);

                languageChangeHandler(gridConfig.language || gridConfig.languages[0]);
            }).fail(function () {
                console.error('Unable to fetch config');
                googleAnalytics('send', 'exception', {
                    'exFatal': true
                });
            });
        }
    };
});
