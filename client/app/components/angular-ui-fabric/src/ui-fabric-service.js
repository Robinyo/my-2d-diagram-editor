(function() {

  'use strict';

  angular.module('ui.fabric')
    .service('fabricService',
      function () {

        var service = this;

        const CANVAS_WIDTH = 800;
        const CANVAS_HEIGHT = 600;

        const RECT_WIDTH = 300;
        const RECT_HEIGHT = 300;

        var canvasDefaults = {
          backgroundColor: '#ffffff',
          selection: true,
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          originalWidth: CANVAS_WIDTH,
          originalHeight: CANVAS_HEIGHT,
          grid: {
            show: true,
            snapTo: true
          }
        };

        var objectDefaults = {
          rotatingPointOffset: 40,
          padding: 0,
          borderColor: 'rgba(102,153,255,0.75)',
          cornerColor: 'rgba(102,153,255,0.5)',
          cornerSize: 10,
          transparentCorners: true,
          hasRotatingPoint: true,
          centerTransform: true
        };

        var rectDefaults = angular.extend({
          left: 0,
          top: 0,
          width: RECT_WIDTH,
          height: RECT_HEIGHT,
          fill: 'LIGHTGRAY',
          opacity: 0.7
        }, objectDefaults);

        service.getCanvasDefaults = function() {
          return canvasDefaults;
        };

        service.getRectDefaults = function() {
          return rectDefaults;
        };

      });

})();

// LIGHTGRAY  #D3D3D3  RGB(211, 211, 211)
