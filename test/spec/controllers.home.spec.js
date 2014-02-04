/*globals describe, it */
define(function (require) {
    'use strict';

    var controller = require('controllers/home');

    describe('Test controllers/home', function () {

        it('type should be an object', function () {
            controller.should.be.an('object');
        });

        it('should have function "run"', function () {
            controller.should.have.property('run').be.a('function');
        });
    });
});
