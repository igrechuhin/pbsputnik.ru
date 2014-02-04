/*globals describe, it, beforeEach */
define(function (require) {
    'use strict';

    var models = [],
        //languages = ['ru'],
        //languages = ['en'],
        languages = ['ru', 'en'],
        $         = require('jquery');

    $.jStorage = require('jStorage');

    models[0] = require('models/memory/section');
    //models[1] = require('models/json/section');


    describe('Model', function () {

        beforeEach(function(){
            $.jStorage.flush();
        });

        models.forEach(function (model) {

            describe('test', function () {

                describe('type', function () {

                    it('should be an object', function () {
                        model.should.be.an('object');

                        model.should.have.property('gridData');
                        model.should.have.property('gridConfig');
                    });
                });

                describe('config', function (done) {
                    var modelConfig = new model.gridConfig();

                    modelConfig.fetch({reset: true}).done(function (config) {

                        it('type', function () {
                            config.should.be.an('object');

                            config.should.have.property('languages').be.an('array').with.length(2);
                            config.should.have.property('grid').be.an('object');
                            config.should.have.property('box').be.an('object');
                        });

                        describe('grid', function () {

                            it('check', function () {
                                config.grid.should.have.property('screens').be.an('array');
                                config.grid.should.have.property('size').be.an('object');
                                config.grid.should.have.property('wideColumns').be.an('object');
                                config.grid.should.have.property('gap').be.a('number');
                            });
                            config.grid.screens.forEach(function (screen) {

                                it('screen', function () {
                                    screen.should.be.an('object');
                                    screen.should.have.property('minWidth').be.a('number');
                                    screen.should.have.property('columns').be.a('number');
                                    screen.should.have.property('margin').be.a('number');
                                });
                            });

                            it('size', function () {
                                config.grid.size.should.have.property('max').be.a('number');
                                config.grid.size.should.have.property('default').be.a('number');
                            });

                            it('wideColumns', function () {
                                config.grid.wideColumns.should.have.property('total').be.a('number');
                                config.grid.wideColumns.should.have.property('forSmallBoxes').be.a('number');
                            });
                        });

                        describe('box', function () {

                            it('check', function () {
                                config.box.should.have.property('small').be.an('object');
                                config.box.should.have.property('header').be.an('object');
                                config.box.should.have.property('content').be.an('object');
                            });

                            it('small', function () {
                                config.box.small.should.have.property('cols').be.a('number');
                                config.box.small.should.have.property('rows').be.a('number');
                            });

                            describe('header', function () {

                                it('check', function () {
                                    config.box.header.should.have.property('small').be.an('object');
                                    config.box.header.should.have.property('normal').be.an('object');
                                });

                                it('small', function () {
                                    config.box.header.small.should.have.property('fontSize').be.a('number');
                                    config.box.header.small.should.have.property('minHeight').be.a('number');
                                    config.box.header.small.should.have.property('padding-top').be.a('number');
                                    config.box.header.small.should.have.property('padding-right').be.a('number');
                                    config.box.header.small.should.have.property('padding-bottom').be.a('number');
                                    config.box.header.small.should.have.property('padding-left').be.a('number');
                                });

                                it('normal', function () {
                                    config.box.header.normal.should.have.property('fontSize').be.a('number');
                                    config.box.header.normal.should.have.property('minHeight').be.a('number');
                                    config.box.header.normal.should.have.property('padding-top').be.a('number');
                                    config.box.header.normal.should.have.property('padding-right').be.a('number');
                                    config.box.header.normal.should.have.property('padding-bottom').be.a('number');
                                    config.box.header.normal.should.have.property('padding-left').be.a('number');
                                });
                            });

                            it('content', function () {
                                config.box.content.should.have.property('fontScale').be.a('number');
                                config.box.content.should.have.property('fontMin').be.a('number');
                                config.box.content.should.have.property('fontMax').be.a('number');
                            });
                        });
                    }).fail(function (error) {
                        done(error);
                    });
                });


                describe('data', function () {
                    var modelData = new model.gridData();

                    languages.forEach(function printBr(language) {

                        describe('check ' + language + ' language', function (done) {
                            modelData.fetch({reset: true, data: {'language': language}}).done(function (data) {

                                it('type', function () {
                                    data.should.be.an('array');
                                });
                                data.forEach(function (section) {

                                    it('section with id: #' + section.id, function () {
                                        section.should.be.an('object');
                                        section.should.have.property('id').be.a('number');
                                        section.should.have.property('cols').be.a('number');
                                        section.should.have.property('colsMin').be.a('number');
                                        section.should.have.property('colsMax').be.a('number');
                                        section.should.have.property('path').be.a('string');
                                        section.should.have.property('header').be.a('string');
                                        section.should.have.property('projects').be.a('string');
                                        section.should.have.property('content').be.an('array');
                                    });

                                    describe('section.content aka project', function () {
                                        section.content.forEach(function (project) {

                                            it('project with id: #' + project.id, function () {
                                                project.should.be.an('object');
                                                project.should.have.property('id').be.a('number');
                                                project.should.have.property('path').be.a('string');
                                                project.should.have.property('headerShort').be.a('string');
                                                project.should.have.property('headerLong').be.a('string');
                                                project.should.have.property('customer').be.a('string');
                                                project.should.have.property('descriptionShort').be.a('string');
                                                project.should.have.property('descriptionLong').be.a('string');
                                                project.should.have.property('press').be.a('string');
                                                project.should.have.property('smi').be.an('array');
                                                project.should.have.property('images').be.an('array');
                                                project.should.have.property('issuu').be.an('array');
                                            });

                                            describe('project.smi', function () {
                                                project.smi.forEach(function (press) {

                                                    it('properties are present', function () {
                                                        press.should.be.an('object');
                                                        press.should.have.property('header').be.a('string');
                                                        press.should.have.property('teaser').be.a('string');
                                                        press.should.have.property('article').be.a('string');
                                                    });
                                                });
                                            });

                                            describe('project.images', function () {
                                                project.images.forEach(function (image) {

                                                    it('properties are present', function () {
                                                        image.should.be.an('object');
                                                        image.should.have.property('thumb').be.a('string');
                                                        image.should.have.property('image').be.a('string');
                                                        image.should.have.property('big').be.a('string');
                                                    });
                                                });
                                            });

                                            describe('project.issuu', function () {
                                                project.issuu.forEach(function (issuu) {

                                                    it('properties are present', function () {
                                                        issuu.should.be.an('object');
                                                        issuu.should.have.property('header').be.a('string');
                                                        issuu.should.have.property('embed').be.a('string');
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            }).fail(function (error) {
                                done(error);
                            });
                        });
                    });
                });
            });
        });
    });
});
