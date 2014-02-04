/*globals describe, it */
define(function (require) {
    'use strict';

    var $   = require('jquery'),
        _   = require('underscore'),
        BOX = require('utils/boxsupport');

    describe('Check utils/boxsupport function', function () {

        var limit = 10,
            colsMin, colsMax, cols, obj;

        describe('checkBox', function () {

            it('present', function () {

                BOX.should.have.property('checkBox').be.a('function');

            });

            describe('run', function () {

                function checkBox () {
                    BOX.checkBox(obj);
                }


                it('properties present', function () {
                    obj = {
                        // 'colsMin': colsMin,
                        'colsMax': limit,
                        'cols': limit
                    };
                    checkBox.should.Throw('colsMin property is absent');

                    obj = {
                        'colsMin': limit,
                        // 'colsMax': colsMax,
                        'cols': limit
                    };
                    checkBox.should.Throw('colsMax property is absent');

                    obj = {
                        'colsMin': limit,
                        'colsMax': limit
                        // 'cols': cols
                    };
                    checkBox.should.Throw('cols property is absent');
                });

                it('limits', function () {

                    var error = 'invalid element size';

                    for (colsMin = -limit; colsMin <= limit; colsMin += 1) {
                        for (colsMax = -limit; colsMax <= limit; colsMax += 1) {
                            for (cols = -limit; cols <= limit; cols += 1) {
                                obj = {
                                    'colsMin': colsMin,
                                    'colsMax': colsMax,
                                    'cols': cols
                                };

                                if (colsMin <= cols && cols <= colsMax && colsMin >= 1 && colsMax >= 1) {
                                    checkBox.should.not.Throw(error);
                                } else {
                                    checkBox.should.Throw(error);
                                }
                            }
                        }
                    }

                });

            });

        });

        describe('isBoxFixed', function () {

            it('present', function () {

                BOX.should.have.property('isBoxFixed').be.a('function');

            });

            it('run', function () {

                for (colsMin = 1; colsMin <= limit; colsMin += 1) {
                    for (colsMax = colsMin; colsMax <= limit; colsMax += 1) {
                        obj = {
                            'colsMin': colsMin,
                            'colsMax': colsMax,
                            'cols': (colsMin + colsMax)/2
                        };
                        BOX.isBoxFixed(obj).should.equal(colsMin === colsMax);
                    }
                }

            });

        });

        describe('expandBox & collapseBox & isBoxExpanded', function () {

            it('present', function () {

                BOX.should.have.property('expandBox').be.a('function');
                BOX.should.have.property('collapseBox').be.a('function');
                BOX.should.have.property('isBoxExpanded').be.a('function');

            });

            describe('run', function () {
                var testCases = [
                    { 'colsMin': 1,     'colsMax': limit, 'cols': limit,   'caseResult': true  },
                    { 'colsMin': 1,     'colsMax': limit, 'cols': limit/2, 'caseResult': false },
                    { 'colsMin': 1,     'colsMax': limit, 'cols': 1,       'caseResult': false },
                    { 'colsMin': 1,     'colsMax': 1,     'cols': 1,       'caseResult': false },
                    { 'colsMin': limit, 'colsMax': limit, 'cols': limit,   'caseResult': false }
                ];

                testCases.forEach(function (testCase) {
                    it('testCase: ' + testCase, function () {
                        BOX.isBoxExpanded(testCase).should.equal(testCase.caseResult);
                    });
                });

                it('collapseBox', function () {
                    var obj = {
                        'colsMin': 1,
                        'colsMax': limit,
                        'cols': limit
                    };

                    BOX.isBoxExpanded(obj).should.equal(true);
                    BOX.collapseBox(obj);
                    BOX.isBoxExpanded(obj).should.equal(false);
                    obj.cols.should.equal(obj.colsMin);
                    obj.cols.should.equal(obj.rows);
                    obj.isActive.should.equal(false);
                });

                it('expandBox', function () {
                    var obj = {
                        'colsMin': 1,
                        'colsMax': limit,
                        'cols': limit/2
                    };

                    BOX.isBoxExpanded(obj).should.equal(false);
                    BOX.expandBox(obj);
                    BOX.isBoxExpanded(obj).should.equal(true);
                    obj.cols.should.equal(obj.colsMax);
                    obj.cols.should.equal(obj.rows);
                    obj.isActive.should.equal(true);
                });

            });

        });

        describe('isBoxSmall', function () {

            it('present', function () {

                BOX.should.have.property('isBoxSmall').be.a('function');

            });

            it('run', function () {

                for (colsMin = 1; colsMin <= limit; colsMin += 1) {
                    for (colsMax = colsMin; colsMax <= limit; colsMax += 1) {
                        obj = {
                            'colsMin': colsMin,
                            'colsMax': colsMax,
                            'cols': (colsMin + colsMax)/2
                        };
                        BOX.isBoxSmall(obj).should.equal(colsMin === 1);
                    }
                }

            });

        });

        describe('index2id & id2index', function () {

            it('present', function () {

                BOX.should.have.property('index2id').be.a('function');
                BOX.should.have.property('id2index').be.a('function');

            });

            it('run', function () {

                for (var index = 0; index <= limit; index += 1) {
                    BOX.index2id(index).should.be.a('string');
                    BOX.id2index(BOX.index2id(index)).should.be.a('number').and.equal(index);
                }

            });

        });

        describe('id2selector', function () {

            it('present', function () {

                BOX.should.have.property('id2selector').be.a('function');

            });

            it('run', function () {
                var index, testSelector;

                for (index = 0; index <= limit; index += 1) {
                    testSelector = _.uniqueId('Box-');
                    BOX.id2selector(testSelector).should.be.a('string').and.equal('#'+testSelector);
                }

            });

        });

        describe('$boxIndex', function () {

            it('present', function () {

                BOX.should.have.property('$boxIndex').be.a('function');

            });

            it('run', function () {
                var index, testElement;

                for (index = 0; index <= limit; index += 1) {
                    testElement = $('<div/>', {
                        id: 'Box-' + index
                    });

                    BOX.$boxIndex(testElement).should.be.a('number').and.equal(index);
                }

            });

        });

        describe('box2Selector', function () {

            it('present', function () {

                BOX.should.have.property('box2Selector').be.a('function');

            });

            it('run', function () {
                var index,
                    testElement = {};

                for (index = 0; index <= limit; index += 1) {
                    testElement.id = index;

                    BOX.box2Selector(testElement).should.be.a('string').and.equal('#Box-' + index);
                }

            });

        });

    });

});
