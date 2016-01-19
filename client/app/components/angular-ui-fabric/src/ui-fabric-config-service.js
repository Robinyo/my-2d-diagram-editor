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

    const GRID_SIZE = 50;

    // const LINE_WIDTH = 4;
    const STROKE_WIDTH = 1;

    const RECT_WIDTH = 300;
    const RECT_HEIGHT = 300;

    const FONT_SIZE = 12;
    const FONT_WEIGHT = 'normal';

    const ARROW_HEAD_LENGTH = 15;

    var canvasDefaults = {
      backgroundColor: '#ffffff',
      selection: true,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      originalWidth: CANVAS_WIDTH,
      originalHeight: CANVAS_HEIGHT,
      grid: {
        show: true,
        size: GRID_SIZE,
        snapTo: false
      }
    };

    var objectDefaults = {
      selectable: true,
      rotatingPointOffset: 40,
      padding: 0,
      borderColor: 'rgba(102,153,255,0.75)',
      cornerColor: 'rgba(102,153,255,0.5)',
      cornerSize: 10,
      transparentCorners: true,
      hasBorders: true,
      hasRotatingPoint: true,
      centerTransform: true
    };

    var gridLineDefaults = {
      stroke: 'LIGHTGRAY'
    };

    var lineDefaults = {
      selectable: true,
      stroke: 'BLACK',
      strokeWidth: STROKE_WIDTH
    };

    var controlDefaults = {
      selectable: true,
      stroke: 'LIGHTBLUE',
      strokeWidth: STROKE_WIDTH
    };

    var rectDefaults = angular.extend({
      left: GRID_SIZE,
      top: GRID_SIZE,
      width: RECT_WIDTH,
      height: RECT_HEIGHT,
      fill: 'GRAY',
      opacity: 0.7
    }, objectDefaults);

    var triangleDefaults = angular.extend({
      // angle: angle,
      fill: 'BLACK',
      top: GRID_SIZE,
      left: GRID_SIZE,
      height: ARROW_HEAD_LENGTH,
      width: ARROW_HEAD_LENGTH,
      originX: 'center',
      originY: 'center',
      selectable: true
    }, objectDefaults);

    var textDefaults = angular.extend({
      left: GRID_SIZE,
      top: GRID_SIZE,
      originX: 'left',
      originY: 'top',
      scaleX: 1,
      scaleY: 1,
      fontFamily: 'Tahoma',
      fontSize: FONT_SIZE,
      fontWeight: FONT_WEIGHT,
      fill: 'BLACK',
      textAlign: 'left'
    }, objectDefaults);

    service.getCanvasDefaults = function() {
      return canvasDefaults;
    };

    service.getGridLineDefaults = function() {
      return gridLineDefaults;
    };

    service.getControlDefaults = function() {
      return controlDefaults;
    };

    service.getLineDefaults = function() {
      return lineDefaults;
    };

    service.getRectDefaults = function() {
      return rectDefaults;
    };

    service.getTriangleDefaults = function() {
      return triangleDefaults;
    };

    service.getTextDefaults = function() {
      return textDefaults;
    };

    return service;

  }

})();

// LIGHTGRAY  #D3D3D3  RGB(211, 211, 211)

// http://htmlcolorcodes.com/color-names/
