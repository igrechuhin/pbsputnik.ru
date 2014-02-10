/* global googleAnalytics */
define(function (require) {
    'use strict';

    require('jquery');
    require('bootstrap/transition');
    require('bootstrap/collapse');
    require('fitvids');
    require('typeahead');

    var _        = require('underscore'),
        Backbone = require('backbone'),
        Galleria = require('galleria'),
        DOM      = require('utils/dom'),
        isMobile = require('utils/ismobile'),

        tpls = {
            'publishing': require('text!tpl/Projects/Publishing.html'),
            'design':     require('text!tpl/Projects/Design.html'),
            'media':      require('text!tpl/Projects/Media.html'),
            'expo':       require('text!tpl/Projects/Expo.html'),
            // 'promotion':  require('text!tpl/Projects/Promotion.html'),

            'about':      require('text!tpl/Projects/About.html'),
            'contact':    require('text!tpl/Projects/Contact.html'),

            'izdatelskaya-deyatelnost': require('text!tpl/Projects/Publishing.html'),
            'dizayn':     require('text!tpl/Projects/Design.html')
        },

        navigationTemplate = _.template(require('text!tpl/Projects/_Navigation.html')),

        gridData,
        searchString,
        searchData,
        searchLimit,
        activeBox,
        activeProject,

        $body = $('body, html'),

        $images,
        $video,
        $navigation,
        $issuu;

    function scrollTop (value) {
        $body.animate({'scrollTop': value}, 'fast', 'swing');
    }

    function getNavigationTop (navigationHeight) {
        if (window.innerHeight && navigationHeight) {
            return window.scrollY + (window.innerHeight - navigationHeight) / 2;
        }
        return window.scrollY + 111 + 70; //see _navigation.scss (top: $container-position-top + 70px;)
    }

    function processVideo ($video) {
        if ($video && $video.fitVids) {
            $video.fitVids();
        }
    }

    function processImages ($images) {
        if ($images && $images.length) {
            $images.galleria({
                responsive: true,
                height: 0.67,
                dataSource: activeProject.images,
                // fullscreenDoubleTap: false,
                // lightbox: true,
                //imageCrop: 'landscape',
                //imageMargin: 35,
                debug: false // debug is now off for deployment
            });
        }
    }

    function processNavigation ($navigation, $view) {
        function processSearch () {
            if (isMobile.any() === false) {
                var $input = $navigation.children('input'),
                    searchTemplate = _.template(require('text!tpl/Projects/_Search.html'));

                $input.attr('placeholder', searchString);

                $input.typeahead({
                    name: 'projects',
                    local: searchData,
                    template: searchTemplate,
                    limit: searchLimit
                });

                $input.on('typeahead:selected', function (object, datum) {
                    $view.trigger('search', datum);
                });
            }
        }
        if ($navigation) {
            $navigation.removeClass('animate').html(navigationTemplate({
                gridData:      gridData,
                activeBox:     activeBox,
                activeProject: activeProject
            }));

            _.delay(function () {
                var $arrowUp         = $navigation.children('#ArrowUp'),
                    $pagination      = $navigation.children('.pagination'),
                    $paginationDots  = $pagination.children(),
                    $projects        = $navigation.children('.projects'),
                    isArrowVisible   = false,
                    threshold        = 111,
                    navigationHeight = $navigation.height();

                $navigation.css({
                    'top': getNavigationTop(navigationHeight)
                }).addClass('animate');

                processSearch();

                $pagination.click(function (event) {
                    var $target = $(event.target),
                        paginationSpeed = 200;
                    if ($target.hasClass('active') === false) {
                        $paginationDots.removeClass('active');
                        $target.addClass('active');

                        $projects.slideUp(paginationSpeed)
                                 .filter('#' + event.target.id).slideDown(paginationSpeed);

                        googleAnalytics('send', {
                            'hitType': 'event',
                            'eventCategory': 'views/ProjectView',
                            'eventAction': 'click',
                            'eventLabel': '.pagination'
                        });
                    }
                });

                $arrowUp.click(function () {
                    scrollTop(0);
                    googleAnalytics('send', {
                        'hitType': 'event',
                        'eventCategory': 'views/ProjectView',
                        'eventAction': 'click',
                        'eventLabel': '#ArrowUp'
                    });
                });

                DOM.$window.scroll(function () {
                    $navigation.css({
                        'top': getNavigationTop(navigationHeight)
                    });
                    if (isArrowVisible) {
                        if (window.scrollY < threshold) {
                            $arrowUp.fadeOut();
                            isArrowVisible = false;
                        }
                    } else {
                        if (window.scrollY > threshold) {
                            $arrowUp.fadeIn();
                            isArrowVisible = true;
                        }
                    }
                });
            }, 500);
        }
    }

    function processISSUU ($issuu) {
        if ($issuu) {
            _.delay(function () {
                $issuu.removeClass('hide');
            }, 1000);
        }
    }

    return Backbone.View.extend({

        render: function (config) {
            var projectClass = config.activeBox.path,
                template     = _.template(tpls[projectClass]);

            if (activeProject !== config.activeProject) {
                gridData      = config.gridData;
                searchString  = config.searchString;
                searchData    = config.searchData;
                searchLimit   = config.searchLimit;
                activeBox     = config.activeBox;
                activeProject = config.activeProject;

                this.$el.html(template({project: activeProject}))
                        .removeClass()
                        .addClass(projectClass);
            }

            return this;
        },

        load: function () {
            $images     = this.$el.children('.images');
            $video      = this.$el.children('.video');
            $navigation = this.$el.children('nav');
            $issuu      = this.$el.children('.issuu');

            scrollTop(0);

            processVideo($video);
            processImages($images);
            processNavigation($navigation, this);
            processISSUU($issuu);
        },

        unload: function () {
            if ($images && $images.length) {
                Galleria.get().forEach(function (gallery) {
                    gallery.destroy();
                });
            }
            if ($navigation) {
                $navigation.removeClass('animate');
                if (isMobile.any() === false) {
                    $navigation.children('input').typeahead('destroy');
                }
            }
            if ($issuu) {
                $issuu.addClass('hide');
            }
        }
    });
});
