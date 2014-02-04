/*globals describe, it */
require(['router'], function (Router) {
    'use strict';
    describe('Test router configuration', function () {

        describe('Router', function () {
            var router = new Router();

            it('type should be an object', function () {
                router.should.be.an('object');
            });

            it('should have routes handler', function () {
                router.should.have.property('routes');
                router.should.have.property('openSection').be.a('function');
            });
        });
    });
});
