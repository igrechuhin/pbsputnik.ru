/* global googleAnalytics */
define(function (require) {
    'use strict';

    var $          = require('jquery'),
        _          = require('underscore'),

        DOM        = require('utils/dom'),

        GridView   = require('views/SectionGridView'),

        grid       = require('./grid'),

        boxes,

        projectSkipClasses = [
            'projectsheader',
            'description',
            'header',
            'content'
        ],

        gridView,

        sectionConfig,

        screenIndex,

        activeBox,
        activeProject;

    function updateScreenIndex () {
        var width = DOM.$window.width();
        screenIndex = 0;
        sectionConfig.grid.screens.forEach(function (element, index) {
            screenIndex = (width >= element.minWidth) ? index : screenIndex;
        });
    }

    function screenColumns () {
        return sectionConfig.grid.screens[screenIndex].columns;
    }

    function gridCalc () {
        boxes = grid.calc({
            columns:       screenColumns(),
            wideColumns:   sectionConfig.grid.wideColumns,
            smallCellSize: sectionConfig.box.small
        });
    }

    function gridCalcAndRender (recalc) {
        if (recalc) {
            updateScreenIndex();
            gridCalc();
        }
        gridView.render({
            boxes:       boxes,
            screenIndex: screenIndex
        });
    }

    function gridBoxClickHandler (event) {
        var $box = $(event.currentTarget);
        if (grid.setActiveBox($box)) {
            activeBox = grid.getActiveBox();
            if (activeBox.isSmall) {
                activeProject = activeBox.content[0];
                sectionConfig.updateRoute(makePath());
                sectionConfig.loadProject(grid.getData(), activeBox, activeProject);
            } else {
                sectionConfig.updateRoute(makePath());
                gridCalcAndRender(true);
            }
        }

        googleAnalytics('send', {
            'hitType': 'event',
            'eventCategory': 'home/layout',
            'eventAction': 'click',
            'eventLabel': '.gridbox.inactivebox'
        });
    }

    function projectClickHandler (event) {
        var $target = $(event.target),
            projectHeader,
            index;

        for (index = projectSkipClasses.length - 1; index >= 0; index -= 1) {
            if ($target.hasClass(projectSkipClasses[index])) {
                return;
            }
        }

        projectHeader = (($target.parent().hasClass('projectslist')) ?
                            $target : $(event.currentTarget).find('.headerShort')).html();

        activeProject = _.find(activeBox.content, function (project) {
            return project.headerShort === projectHeader;
        });

        sectionConfig.updateRoute(makePath());
        sectionConfig.loadProject(grid.getData(), activeBox, activeProject);

        googleAnalytics('send', {
            'hitType': 'event',
            'eventCategory': 'home/layout',
            'eventAction': 'click',
            'eventLabel': '.gridbox:not(.inactivebox)'
        });
    }

    function gridBoxWindowResizeHandler () {
        DOM.$window.resize(_.debounce(function () {
            if (_.isUndefined(activeProject)) {
                var oldScreenIndex = screenIndex;
                updateScreenIndex();
                gridCalcAndRender(oldScreenIndex !== screenIndex);
            }
        }, 100));
    }

    function makePath () {
        return {
            section: activeBox.path,
            place: !_.isUndefined(activeProject) ? activeProject.path : undefined
        };
    }

    return {
        init: function (config) {
            sectionConfig = config;


            sectionConfig.grid.screens = sectionConfig.grid.screens.sort(function (a, b) { return a.minWidth - b.minWidth; });

            updateScreenIndex();

            gridBoxWindowResizeHandler();

            gridView = new GridView({
                el: sectionConfig.$grid,

                events: {
                    'click .gridbox.inactivebox':       gridBoxClickHandler,
                    'click .gridbox:not(.inactivebox)': projectClickHandler
                },

                config: sectionConfig,

                gridBoxClass:     'gridbox',
                inactiveBoxClass: 'inactivebox',
                smallBoxClass:    'smallbox',

                gridCalcAndRender: gridCalcAndRender
            });
        },

        setData: grid.setData,

        clearGrid: function () {
            gridView.$el.empty();
        },

        run: function () {
            activeBox = _.find(grid.getData(), function (box) {
                            return box.path === sectionConfig.section;
                        });

            if (_.isUndefined(activeBox)) {
                activeBox = grid.getActiveBox();
                if (activeBox.isSmall) {
                    activeBox = grid.getData()[0];
                }
            }

            grid.setActiveBox(activeBox);

            activeProject = _.find(activeBox.content, function (project) {
                                return project.path === sectionConfig.place;
                            });

            sectionConfig.updateRoute(makePath());

            if (_.isUndefined(activeProject)) {
                gridCalcAndRender(true);
            } else {
                sectionConfig.loadProject(grid.getData(), activeBox, activeProject);
            }
        }
    };
});
