(function() {

  'use strict';

  /*
   * Declare a new module called 'ui.fabric', and list its dependencies.
   * Modules serve as containers to help you organise code within your AngularJS application.
   * Modules can contain sub-modules, making it easy to compose functionality as needed.
   */

  angular.module('ui.fabric', [])
    .factory('fabric', fabric);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  fabric.$inject = ['$log', 'fabricCanvas', 'fabricService', 'fabricWindow', 'fabricShape', 'fabricText'];

  function fabric($log, fabricCanvas, fabricService, fabricWindow, fabricShape, fabricText) {

    var service = this;

    service.canvas = null;
    service.canvasDefaults = null;

    service.verticalGridLinesGroup = {};
    service.horizontalGridLinesGroup = {};
    service.verticalGridLines = [];
    service.horizontalGridLines = [];

    $log.info('fabric');

    service.init = function () {

      $log.info('fabric - init()');

      service.canvasDefaults = fabricService.getCanvasDefaults();
    };

    //
    // Canvas
    //

    service.getCanvas = function () {

      $log.info('fabric - getCanvas()');

      service.canvas = fabricCanvas.getCanvas();
      service.configCanvasListeners();

      return service.canvas;
    };

    //
    // Grid
    //

    service.showGrid = function() {

      $log.info('fabric - drawGrid()');

      var grid = service.canvasDefaults.grid.size;
      var width = service.canvasDefaults.width;
      var height = service.canvasDefaults.height;

      $log.info('width: ' + service.canvasDefaults.width);
      $log.info('height: ' + service.canvasDefaults.height);

      // draw the Vertical lines
      var i = 0;
      for (var x = 0.5; x < width; x += grid) {
        service.verticalGridLines[i++] = fabricShape.gridLine([ x, 0.5, x, width],
          { stroke: '#ccc', selectable: false });
      }

      // draw the Horizontal lines
      i = 0;
      for (var y = 0.5; y < height; y += grid) {
        service.horizontalGridLines[i++] = fabricShape.gridLine([ 0.5, y, height, y],
          { stroke: '#ccc', selectable: false });
      }

      service.verticalGridLinesGroup = service.createGroup(service.verticalGridLines,
        { selectable: false }, false);
      service.verticalGridLinesGroup.sendToBack();
      service.horizontalGridLinesGroup = service.createGroup(service.horizontalGridLines,
        { selectable: false }, false);
      service.horizontalGridLinesGroup.sendToBack();

      // Why did we start x and y at 0.5? Why not 0?
      // See: http://diveintohtml5.info/canvas.html

      service.canvas.deactivateAll().renderAll();
    };

    service.hideGrid = function() {

      $log.info('fabric - hideGrid()');

      service.removeGroup(service.verticalGridLinesGroup, false);
      service.removeGroup(service.horizontalGridLinesGroup, true);
    };

    //
    // Shapes
    //

    var addObjectToCanvas = function(object, render) {

      if (service.canvas === null) {
        $log.error('You must call getCanvas() before you try to add shapes to a canvas.');
        service.getCanvas();
      }

      service.canvas.add(object);

      if (render) {
        service.canvas.renderAll();
      }

      return object;
    };

    service.removeActiveObjectFromCanvas = function() {
      var activeObject = service.canvas.getActiveObject();
      service.canvas.remove(activeObject);
      service.canvas.renderAll();
    };

    /**
     * @name addRect
     * @desc Creates a new Rect and adds it to the canvas
     * @param {Object} [options] A configuration object, defaults to FabricConstants.rectDefaults
     * @return {Object} Returns the new Rect object
     */
    service.addRect = function(options) {

      $log.info('fabric - addRect()');

      return addObjectToCanvas(fabricShape.rect(options));
    };

    //
    // Text
    //

    service.addText = function(text, options) {

      $log.info('fabric - addText()');

      $log.info('fabric - addText() - options.fontSize: ' + options.fontSize);

      return addObjectToCanvas(fabricText.text(text, options));
    };

    //
    // Groups
    //

    service.createGroup = function(objects, options, render) {

      $log.info('fabric - createGroup()');

      var object = new fabricWindow.Group(objects, options);

      $log.info('fabric - createGroup() - render: ' + render.toLocaleString());

      return addObjectToCanvas(object, render);
    };

    service.removeGroup = function(object, render) {

      $log.info('fabric - removeGroup()');

      service.canvas.remove(object);

      $log.info('fabric - removeGroup() - render: ' + render.toLocaleString());

      if (render) {
        service.canvas.renderAll();
      }
    };

    service.toggleSnapToGrid = function() {
      service.canvasDefaults.grid.snapTo = !service.canvasDefaults.grid.snapTo;
    };

    service.configCanvasListeners = function() {

      //
      // Snap to grid
      //

      service.canvas.on('object:moving', function(options) {

        if (service.canvasDefaults.grid.snapTo) {

          // $log.info('canvas.on(object:moving)');

          options.target.set({
            left: Math.round(options.target.left /
              service.canvasDefaults.grid.size) * service.canvasDefaults.grid.size,
            top: Math.round(options.target.top /
              service.canvasDefaults.grid.size) * service.canvasDefaults.grid.size
          });
        }
      });

    };

    service.init();

    return service;

  }

})();


