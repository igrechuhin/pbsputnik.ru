define(function () {
    'use strict';

    var _ = require('underscore'),

        boxIdPrefix = 'Box-';

    return {
        checkBox: function (element) {
            if (!element.hasOwnProperty('colsMin')) {
                throw new TypeError('colsMin property is absent');
            }

            if (!element.hasOwnProperty('colsMax')) {
                throw new TypeError('colsMax property is absent');
            }

            if (!element.hasOwnProperty('cols')) {
                throw new TypeError('cols property is absent');
            }

            var c = element.cols;

            if (element.colsMin < 1 ||c < element.colsMin || c > element.colsMax) {
                throw new RangeError('invalid element size');
            }
        },

        isBoxFixed: function (element) {
            this.checkBox(element);
            return element.colsMin === element.colsMax;
        },

        isBoxExpanded: function (element) {
            this.checkBox(element);
            return !this.isBoxFixed(element) && element.cols === element.colsMax;
        },

        isBoxSmall: function (element) {
            return element.colsMin === 1;
        },

        collapseBox: function (element) {
            element.cols = element.colsMin;
            element.rows = element.cols;
            element.isActive = false;
        },

        expandBox: function (element) {
            element.cols = element.colsMax;
            element.rows = element.cols;
            element.isActive = true;
        },

        index2id: function (index) {
            return boxIdPrefix.concat(index);
        },

        id2index: function (id) {
            return parseInt(id.replace(boxIdPrefix, ''), 10);
        },

        id2selector: function (selector) {
            return '#'.concat(selector);
        },

        $boxIndex: function ($box) {
            return this.id2index($box.attr('id'));
        },

        box2Selector: function (box) {
            return this.id2selector(this.index2id(box.id));
        },

        $box2box: function (boxes, box) {
            if (box instanceof jQuery) {
                var boxIndex = this.$boxIndex(box);
                box = _.find(boxes, function (box) { return box.id === boxIndex; });
            }
            return box;
        }

    };
});
