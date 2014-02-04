define(function (require) {
    'use strict';

    var _   = require('underscore'),
        BOX = require('utils/boxsupport');

    return function (columns) {

        var map = [];

        function getValue(row, col) {
            return map[row * columns + col];
        }

        function setValue(row, col, val) {
            map[row * columns + col] = val;
        }

        function findPlace(request) {
            function placeLoop(limits, rowsFirst) {
                var row0 = Math.max(limits.rowStart, 0),
                    row1,
                    row,

                    col0 = limits.colStart,
                    col1 = limits.colEnd,
                    col,

                    rowsFirstPlace;

                for (row = row0; _.isUndefined(rowsFirstPlace); row += 1) {
                    for (col = col0; col <= col1; col += 1) {
                        if (checkPlace(row, col)) {
                            if (rowsFirst) {
                                takePlace(row, col);
                                return {
                                    row: row,
                                    column: col
                                };
                            } else if (_.isUndefined(rowsFirstPlace)){
                                row1 = 3*row;
                                rowsFirstPlace = {
                                    row: row,
                                    col: col,
                                    distance: row*row + col*col
                                };
                            }
                        }
                    }
                }

                for (col = col0; col <= col1; col += 1) {
                    for (row = row0; row <= row1; row += 1) {
                        if (checkPlace(row, col)) {
                            if (rowsFirstPlace.distance < (row*row + col*col)) {
                                row = rowsFirstPlace.row;
                                col = rowsFirstPlace.col;
                            }
                            takePlace(row, col);
                            return {
                                row: row,
                                column: col
                            };
                        }
                    }
                }
            }

            function checkPlace(row, col) {
                if (row < 0 || col < 0 || col > cEnd) {
                    return false;
                }
                var rLast =  row + element.rows,
                    cLast = col + element.cols,

                    rEl, cEl;

                for (rEl = row; rEl < rLast; rEl += 1) {
                    for (cEl = col; cEl < cLast; cEl += 1) {
                        if (!_.isUndefined(getValue(rEl, cEl))) {
                            return false;
                        }
                    }
                }

                return true;
            }

            function takePlace(row, col) {
                var rLast =  row + element.rows,
                    cLast = col + element.cols,

                    rEl, cEl;

                for (rEl = row; rEl < rLast; rEl += 1) {
                    for (cEl = col; cEl < cLast; cEl += 1) {
                        setValue(rEl, cEl, element.id);
                    }
                }
            }

            var element = request.element,

                cEnd = columns - element.cols;

            if (!_.isUndefined(element.place) && BOX.isBoxExpanded(element) && element.place.row < element.rows) {
                // try keep inplace
                if (!_.isUndefined(element.placeOnResize) && element.placeOnResize === true) {
                    element.placeOnResize = false;
                    return placeLoop({
                        rowStart: element.place.row,
                        colStart: element.place.column,
                        colEnd: element.place.column
                    }, false);
                }

                element.placeOnResize = true;
                return placeLoop({
                    rowStart: element.place.row - Math.floor(element.rows / 2),
                    colStart: element.place.column - (element.colsMax - element.colsMin),
                    colEnd: element.place.column
                }, false);
            }

            element.placeOnResize = false;
            return placeLoop({
                rowStart: 0,
                colStart: _.isUndefined(request.specialColumns) ? 0 : columns - request.specialColumns,
                colEnd: cEnd
            }, BOX.isBoxSmall(element));
        }

        return {
            place: function (request) {
                var newPlace = findPlace(request);
                request.element.place = newPlace;
            }
        };
    };
});
