define(function (require) {
    'use strict';

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),

        BOX         = require('utils/boxsupport'),
        DOM         = require('utils/dom'),

        grid        = require('./grid'),

        template    = _.template(require('text!tpl/SectionGrid.html'));

    function updateGrid ($container, boxes, currentBoxSize, callback) {
        var needUpdate = false;
        boxes.forEach(function (box) {
            var $box         = $container.children(BOX.box2Selector(box)),
                $lastVisible = $box.children('article').children(':visible:last'),

                requiredHeight,
                requiredRows;

            if ($lastVisible.length === 0) {
                return;
            }

            requiredHeight = $lastVisible.position().top + $lastVisible.outerHeight(true);
            requiredRows = Math.ceil(requiredHeight / currentBoxSize);

            if (box.rows !== requiredRows) {
                if (!needUpdate) {
                    needUpdate = (requiredRows > box.cols);
                }
                box.rows = Math.max(requiredRows, box.cols);
            }
        });
        if (needUpdate) {
            callback(true);
        }
    }

    return Backbone.View.extend({

        initialize: function (options) {
            this.options = options;
        },

        render: function (data) {
            var inactiveBoxClass = this.options.inactiveBoxClass,
                smallBoxClass    = this.options.smallBoxClass,

                boxHeader  = this.options.config.box.header,
                boxContent = this.options.config.box.content,
                gridConfig = this.options.config.grid,

                columnsCount   = gridConfig.screens[data.screenIndex].columns,
                margin         = gridConfig.screens[data.screenIndex].margin,
                gap            = gridConfig.gap,
                maxBoxSize     = gridConfig.size.max,
                defaultBoxSize = gridConfig.size['default'],
                currentBoxSize = grid.boxSize(columnsCount, margin, gap, maxBoxSize),

                scaleFactor = Math.min(currentBoxSize / defaultBoxSize, 1),

                update = (this.$el.children().length !== 0),

                $container = (update) ? this.$el :
                                $(template({boxes: data.boxes})).filter('section.'.concat(this.options.gridBoxClass)),

                bgHeight   = 0,
                bgGridSize = grid.backgroundGridSize(columnsCount, margin, gap, maxBoxSize);

            if (update === false) {
                $('img', $container).hide().on('load', function () {
                    $(this).fadeIn().off('load');
                });
            }

            data.boxes.forEach(function (box) {
                var $box     = $container[(update) ? 'children' : 'filter'](BOX.box2Selector(box)),
                    $header  = $box.children('header'),
                    $content = $box.children('article'),

                    header          = BOX.isBoxSmall(box) ? boxHeader.small : boxHeader.normal,
                    headerFontSize  = Math.round(scaleFactor * header.fontSize),
                    contentFontSize = Math.max(Math.min(boxContent.fontScale * headerFontSize, boxContent.fontMax), boxContent.fontMin),

                    place = grid.place(box, columnsCount, margin, gap, maxBoxSize), // position
                    translate = 'translate(' + place.left + 'px, ' + place.top + 'px) scale(1) translateZ(0)',
                    boxCSS = {
                        '-webkit-transform': translate,
                        '-moz-transform'   : translate,
                        '-o-transform'     : translate,
                        'transform'        : translate,

                        'width' : place.width,
                        'height': place.height,

                        'margin': gap,

                        'font-size': Math.round(scaleFactor * header.fontSize)
                    },

                    headerHeight  = Math.round(scaleFactor * header.minHeight),
                    contentHeight = boxCSS.height - headerHeight - header['padding-top'] - header['padding-bottom'];

                $box.css(boxCSS)
                    [box.isActive ? 'removeClass' : 'addClass'](inactiveBoxClass)
                    [box.isSmall ? 'addClass' : 'removeClass'](smallBoxClass);
                $header.css({
                    'min-height': headerHeight,
                    'padding':    header['padding-top'] + 'px ' + header['padding-right'] + 'px ' + header['padding-bottom'] + 'px ' + header['padding-left'] + 'px'
                });

                $content.css({
                    'height':    contentHeight,
                    'font-size': contentFontSize
                });

                bgHeight = Math.max(bgHeight, place.top + place.height);
            });

            this.$el.parent().css({
                'background-size': bgGridSize + 'px ' + bgGridSize + 'px,' + bgGridSize + 'px ' + bgGridSize + 'px',
                'height':          Math.max(parseInt(this.$el.css('top'), 10) + bgHeight + 3*gap, DOM.$window.height())
            });

            if (!update) {
                this.$el.append($container);
            }

            _.delay(updateGrid, 500,
                this.$el, data.boxes, bgGridSize, this.options.gridCalcAndRender);

            return this;
        }
    });
});
