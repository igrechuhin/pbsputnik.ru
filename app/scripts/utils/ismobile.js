define(function () {
    'use strict';

    var android    = navigator.userAgent.match(/Android/i) ? true : false,
        blackBerry = navigator.userAgent.match(/BlackBerry/i) ? true : false,
        iOS        = navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false,
        opera      = navigator.userAgent.match(/Opera Mini/i) ? true : false,
        windows    = navigator.userAgent.match(/IEMobile/i) ? true : false,
        any        = android || blackBerry || iOS || opera || windows;

    return {
        android: function () {
            return android;
        },

        blackBerry: function () {
            return blackBerry;
        },

        iOS: function () {
            return iOS;
        },

        opera: function () {
            return opera;
        },

        windows: function () {
            return windows;
        },

        any: function () {
            return any;
        }
    };
});
