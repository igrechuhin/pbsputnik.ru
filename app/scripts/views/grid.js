define(function (require) {
    'use strict';

    var DOM = require('utils/dom');

    function lineOffset(lineNumber, boxSize, gap) {
        return lineNumber * (boxSize + 2 * gap);
    }

    function gridSize(scale, boxSize, gap) {
        return scale * boxSize + 2 * (scale - 1) * gap;
    }

    function boxSize(columnsCount, margin, gap, maxSize) {
        var wndWidth = DOM.$window.width(),
            size = Math.floor(((wndWidth - 2 * (margin + gap)) - 2 * (columnsCount - 1) * gap) / columnsCount);
        return Math.min(size, maxSize);
    }

    return {

        place: function (box, columnsCount, margin, gap, maxSize) {

            var size = boxSize(columnsCount, margin, gap, maxSize);

            return {
                'left': lineOffset(box.place.column, size, gap),
                'top':  lineOffset(box.place.row, size, gap),

                'width':  gridSize(box.cols, size, gap),
                'height': gridSize(box.rows, size, gap)
            };
        },

        boxSize: boxSize,

        backgroundGridSize: function (columnsCount, margin, gap, maxSize) {
            return lineOffset(1, boxSize(columnsCount, margin, gap, maxSize), gap);
        },

        languageOffsetLeft: function (columnsCount, margin, gap, maxSize) {
            return lineOffset(columnsCount - 1, boxSize(columnsCount, margin, gap, maxSize), gap) + margin;
        }
    };
});
