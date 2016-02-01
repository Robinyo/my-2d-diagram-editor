(function() {

  'use strict';

  angular.module('ui.fabric')
    .service('fabricConfig', fabricConfig);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  // fabricConfig.$inject = [''];

  function fabricConfig() {

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

    const CORNER_SIZE = 10;
    const ROTATING_POINT_OFFSET = 40;

    const STROKE_WIDTH = 1;

    const RECT_WIDTH = 300;
    const RECT_HEIGHT = 300;

    const FONT_SIZE = 12;
    const FONT_WEIGHT = 'normal';
    const FONT_FAMILY = 'Tahoma';

    const ARROW_HEAD_LENGTH = 15;

    var canvasDefaults = {
      backgroundColor: '#ffffff',
      grid: {
        show: true,
        size: GRID_SIZE,
        snapTo: false
      },
      height: CANVAS_HEIGHT,
      originalHeight: CANVAS_HEIGHT,
      originalWidth: CANVAS_WIDTH,
      selection: true,
      width: CANVAS_WIDTH
    };

    var objectDefaults = {
      borderColor: 'rgba(102,153,255,0.75)',
      centerTransform: true,
      cornerColor: 'rgba(102,153,255,0.5)',
      cornerSize: CORNER_SIZE,
      hasBorders: true,
      hasRotatingPoint: true,
      padding: 0,
      rotatingPointOffset: ROTATING_POINT_OFFSET,
      selectable: true,
      transparentCorners: true
    };

    var lineDefaults = angular.extend({
      stroke: 'BLACK',
      strokeWidth: STROKE_WIDTH
    }, objectDefaults);

    var rectDefaults = angular.extend({
      fill: 'GRAY',
      height: RECT_HEIGHT,
      left: GRID_SIZE,
      opacity: 0.7,
      top: GRID_SIZE,
      width: RECT_WIDTH
    }, objectDefaults);

    var triangleDefaults = angular.extend({
      // angle: angle,
      fill: 'BLUE',
      height: GRID_SIZE,
      left: GRID_SIZE,
      originX: 'center',
      originY: 'center',
      top: GRID_SIZE,
      width: GRID_SIZE
    }, objectDefaults);

    var textDefaults = angular.extend({
      fill: 'BLACK',
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZE,
      fontWeight: FONT_WEIGHT,
      left: GRID_SIZE,
      originX: 'left',
      originY: 'top',
      scaleX: 1,
      scaleY: 1,
      textAlign: 'left',
      top: GRID_SIZE
    }, objectDefaults);

    var gridLineDefaults = {
      stroke: 'LIGHTGRAY'
    };

    var controlDefaults = {
      selectable: true,
      stroke: 'LIGHTBLUE',
      strokeWidth: STROKE_WIDTH
    };

    //
    // Connectors (a line) are not selectable (but the arrows on either end are).
    //

    var connectorDefaults = {
      selectable: false,
      stroke: 'BLACK',
      strokeWidth: 2 // STROKE_WIDTH
    };

    //
    // Arrows (a triangle)
    //

    var arrowDefaults = angular.extend({
      // angle: angle,
      fill: 'BLACK',
      hasControls: false,
      height: ARROW_HEAD_LENGTH,
      left: GRID_SIZE,
      originX: 'center',
      originY: 'center',
      top: GRID_SIZE,
      width: ARROW_HEAD_LENGTH
    }, objectDefaults);

    arrowDefaults.hasRotatingPoint = false;
    arrowDefaults.selectable = false;

    //
    // RectWithText (a Node or a Container)
    //

    const RECT_WITH_TEXT_FONT_SIZE = 18;
    const RECT_WITH_TEXT_FONT_WEIGHT = 'normal';
    const RECT_WITH_TEXT_WIDTH = 100;
    const RECT_WITH_TEXT_HEIGHT = 100;

    var rectWithTextDefaults = angular.extend({
      fillStyle: 'BLACK',
      fontFamily: FONT_FAMILY,
      fontSize: RECT_WITH_TEXT_FONT_SIZE,
      fontWeight: RECT_WITH_TEXT_FONT_WEIGHT,
      originX: 'left',
      originY: 'top',
      scaleX: 1,
      scaleY: 1,
      textAlign: 'center',
      textBaseline: 'middle'  // top, bottom, middle, alphabetic, hanging
    }, rectDefaults);

    rectWithTextDefaults.width = RECT_WITH_TEXT_WIDTH;
    rectWithTextDefaults.height = RECT_WITH_TEXT_HEIGHT;

    service.getCanvasDefaults = function() {
      return canvasDefaults;
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

    service.getGridLineDefaults = function() {
      return gridLineDefaults;
    };

    service.getControlDefaults = function() {
      return controlDefaults;
    };

    service.getConnectorDefaults = function() {
      return connectorDefaults;
    };

    service.getArrowDefaults = function() {
      return arrowDefaults;
    };

    service.getRectWithTextDefaults = function() {
      return rectWithTextDefaults;
    };

    return service;

  }

})();

// LIGHTGRAY  #D3D3D3  RGB(211, 211, 211)

// http://htmlcolorcodes.com/color-names/
