(function() {

  'use strict';

  angular.module('ui.fabric')
    .service('fabricService', fabricService);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  // fabricService.$inject = [''];

  function fabricService() {

    var service = this;

    // 'Portrait (8.5 x 11)'
    // 'Landscape (11 x 8.5)'

    const PORTRAIT_WIDTH = 1510;
    const PORTRAIT_HEIGHT = 1947;
    const LANDSCAPE_WIDTH = 1510;
    const LANDSCAPE_HEIGHT = 1947;

    const CANVAS_WIDTH = LANDSCAPE_WIDTH;
    const CANVAS_HEIGHT = LANDSCAPE_HEIGHT;

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

    return service;

  }

})();

// LIGHTGRAY  #D3D3D3  RGB(211, 211, 211)
