define(function (require) {
    'use strict';

    var _      = require('underscore'),

        BOX    = require('utils/boxsupport'),

        Bitmap = require('./grid/bitmap'),

        data;

    function getSmallCells(placeData) {
        return placeData.filter(function (element) {
            return BOX.isBoxFixed(element) && BOX.isBoxSmall(element);
        });
    }

    return {
        setData: function (newData) {
            newData.forEach(function (element) {

                element.rows = element.cols; // Initial setup. Every box should be at least square row height. Will be updated on draw

                if (BOX.isBoxExpanded(element) && !BOX.isBoxFixed(element)) {
                    element.isActive = true;
                    element.isSmall = false;
                } else if (BOX.isBoxSmall(element) && BOX.isBoxFixed(element)) {
                    element.isActive = false;
                    element.isSmall = true;
                } else {
                    element.isActive = false;
                    element.isSmall = false;
                }
            });
            data = newData.sort(function (a, b) { return a.id - b.id; });
        },

        getData: function () {
            return data;
        },

        getContentBoxes: function () {
            return data.filter(function (box) {
                return !BOX.isBoxSmall(box);
            });
        },

        getActiveBox: function () {
            return _.find(data, function (box) {
                        return box.isActive;
                    });
        },

        setActiveBox: function (box) {
            box = BOX.$box2box(data, box);
            if (box.isActive) {
                return false;
            } else {
                data.forEach(function (element) {
                    BOX[(box === element) ? 'expandBox' : 'collapseBox'](element);
                });
                return true;
            }
        },

        calc: function (params) {
            var columns         = params.columns,
                isWideScreen    = (columns >= params.wideColumns.total),

                newBitmap       = new Bitmap(columns),

                selectedElement = this.getActiveBox(),
                placeData       = _.without(data, selectedElement),
                smallCells      = isWideScreen ? getSmallCells(placeData) : [];

            newBitmap.place({
                element:         selectedElement
            });

            smallCells.forEach(function (element) {
                newBitmap.place({
                    element: element,
                    specialColumns: params.wideColumns.forSmallBoxes
                });
            });

            _.difference(placeData, smallCells).forEach(function (element) {
                newBitmap.place({element: element});
            });

            return data;
        }
    };
});
