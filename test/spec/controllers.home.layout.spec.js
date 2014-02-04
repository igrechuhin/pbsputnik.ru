/*globals describe, it, beforeEach */
define(function (require) {
    'use strict';

    var $        = require('jquery'),
        _        = require('underscore'),
        layout   = require('controllers/home/layout'),

        HomeView = require('views/HomePageView'),
        homeView = new HomeView({ el: $('.container') });

    describe('Test controllers/home/layout', function () {

        var screens = [
                { minWidth: 320,  columns: 4,   margin: 0  },
                { minWidth: 480,  columns: 6,   margin: 5  },
                { minWidth: 800,  columns: 7,   margin: 10 },
                { minWidth: 1024, columns: 8,   margin: 10 },
                { minWidth: 1280, columns: 9,   margin: 15 },
                { minWidth: 1430, columns: 10,  margin: 15 }
            ],
            gridConfig = {
                // Data from model
                languages: [ 'ru', 'en' ],

                grid: {
                    screens: screens,

                    size: {
                        max: 160,
                        'default': 137
                    },

                    wideColumns: {
                        total: 10,
                        forSmallBoxes: 2
                    },

                    gap: 6
                },

                // Data from controllers/home
                $header:     $('#Header', homeView.el),
                $grid:       $('#Grid', homeView.el),

                updateRoute:    function (/* route */) {},
                loadProject:    function (/* gridData, activeBox, activeProject */) {},
                showPage:       function () {},
                updateLanguage: function (/* language */) {},

                // Custom path
                section: undefined,
                place: undefined
            };

        it('type should be an object', function () {
            layout.should.be.an('object');
        });

        describe('function "init"', function () {

            it('present', function () {
                layout.should.have.property('init').be.a('function');
            });

            describe('call', function () {

                beforeEach(function () {
                    gridConfig.grid.screens = _.shuffle(screens);
                });

                //Need loop. Why not?
                screens.forEach(function () {

                    it('check screens are sorted', function () {

                        layout.init(gridConfig);

                        for (var i = screens.length - 1; i >= 0; i -= 1) {
                            screens[i].should.equal(gridConfig.grid.screens[i]);
                        }

                    });

                });
            });
        });

        describe('function "setData"', function () {

            it('present', function () {
                layout.should.have.property('setData').be.a('function');
            });

        });

        describe('function "clearGrid"', function () {

            it('present', function () {
                layout.should.have.property('clearGrid').be.a('function');
            });

        });

        describe('function "run"', function () {

            it('present', function () {
                layout.should.have.property('run').be.a('function');
            });

        });

    });

});
