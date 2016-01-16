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

    service.activeObject = null;
    service.selectedObject = null;

    service.connectorMode = false;

    $log.info('fabric');

    service.init = function () {

      $log.info('fabric - init()');

      service.canvasDefaults = fabricService.getCanvasDefaults();
      service.controlDefaults = fabricService.getControlDefaults();
    };

    service.setConnectorMode = function (mode) {

      $log.info('fabric - setConnectorMode(): ' + mode);

      // mode = mode || true;
      service.connectorMode = mode;
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

      $log.info('fabric - showGrid()');

      var grid = service.canvasDefaults.grid.size;
      var width = service.canvasDefaults.width;
      var height = service.canvasDefaults.height;

      // $log.info('width: ' + service.canvasDefaults.width);
      // $log.info('height: ' + service.canvasDefaults.height);

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

      $log.info('fabric - showGrid() - deactivateAll().renderAll()');
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

      render = render || false;

      if (service.canvas === null) {
        $log.error('You must call getCanvas() before you try to add shapes to a canvas.');
        service.getCanvas();
      }

      service.canvas.add(object);
      // service.setObjectZoom(object);
      // service.canvas.setActiveObject(object);
      object.bringToFront();

      $log.info('fabric - addObjectToCanvas() - render: ' + render.toLocaleString());

      if (render !== false) {
        $log.info('fabric - addObjectToCanvas() - renderAll');
        service.canvas.renderAll();
      }

      return object;
    };

    var removeObjectFromCanvas = function(object, render) {

      service.canvas.remove(object);

      $log.info('fabric - removeObjectFromCanvas() - render: ' + render.toLocaleString());

      if (render) {
        $log.info('fabric - removeObjectFromCanvas() - renderAll');
        service.canvas.renderAll();
      }
    };

    service.removeActiveObjectFromCanvas = function() {

      $log.info('fabric - removeActiveObjectFromCanvas()');

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
    service.addRect = function(options, render) {

      $log.info('fabric - addRect()');

      return addObjectToCanvas(fabricShape.rect(options), render);
    };

    //
    // Line
    //

    service.addLine = function(points, options, render) {

      $log.info('fabric - addLine()');

      return addObjectToCanvas(fabricShape.line(points, options), render);
    };

    //
    // Text
    //

    service.addText = function(text, options, render) {

      $log.info('fabric - addText()');

      return addObjectToCanvas(fabricText.text(text, options), render);
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
      removeObjectFromCanvas(object, render);
    };

    //
    // Grid
    //

    service.toggleSnapToGrid = function() {
      service.canvasDefaults.grid.snapTo = !service.canvasDefaults.grid.snapTo;
    };

    //
    // Listeners
    //

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

      service.canvas.on('selection:cleared', function(element) {

        $log.info('selection:cleared');

        service.activeObject = null;

      });

      service.canvas.on('mouse:over', function(element) {

        // $log.info('mouse:over');

        if (service.connectorMode) {

          if (element.target.type === 'node') {

            service.selectedObject = element.target;

            if (!service.activeObject) {
              service.activeObject = service.canvas.getActiveObject();
            }

            if (service.activeObject) {
              service.activeObject.set('active', false);
            }

            service.selectedObject.set('active', true);

            service.canvas.renderAll();
          }
        }
      });

      service.canvas.on('mouse:out', function(element) {

        // $log.info('mouse:out');

        if (service.connectorMode) {

          if (element.target.type === 'node') {

            if (service.selectedObject) {
              // canvas.item(canvas._objects.length-1).set('active',true);
              service.selectedObject.set('active', false);

              service.selectedObject = null;

              if (service.activeObject) {
                service.activeObject.set('active', true);
                service.canvas._activeObject = service.activeObject;
              }

              // canvas.setActiveObject(canvas._objects[canvas._objects.length-1]);
              service.canvas.renderAll();
            }
          }
        }
      });

    };

    service.init();

    return service;

  }

})();

/*

 // var rectDefaults = angular.copy(fabricService.getRectDefaults());
 // var objectControls = null;
 // const LINE_WIDTH = 1;

 service.objectControls = false;
 service.controlDefaults = null;
 service.controlsGroup = {};
 service.controlLines = [];

 // $log.info('element: ' + JSON.stringify(['e', element], null, '\t'));

 // drawControls(element);

 // eraseControls(element);

//
// Controls
//

var drawControls = function(element) {
  drawObjectControls(element);
};

var eraseControls = function(element) {
  eraseObjectControls(element);
};

var drawObjectControls = function(element) {

  $log.info('fabric - drawObjectControls()');

  $log.info('element: ' + JSON.stringify(['e', element], null, '\t'));

  if (service.objectControls === false) {

    $log.info('service.objectControls === false');

    var topLeft = {x: element.target.left - 2, y: element.target.top - 2};
    var topRight = {x: element.target.top + element.target.width, y: element.target.top - 2};
    var bottomLeft = {x: element.target.left - 2, y: element.target.top + element.target.height};
    var bottomRight = {x: element.target.top + element.target.width, y: element.target.top + element.target.height};

    var i = 0;
    service.controlLines[i++] = fabricShape.line([ topLeft.x, topLeft.y, topRight.x, topRight.y],
      service.controlDefaults);
    service.controlLines[i++] = fabricShape.line([ topRight.x, topRight.y, bottomRight.x, bottomRight.y],
      service.controlDefaults);
    service.controlLines[i++] = fabricShape.line([ bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y],
      service.controlDefaults);
    service.controlLines[i++] = fabricShape.line([ bottomLeft.x, bottomLeft.y, topLeft.x, topLeft.y],
      service.controlDefaults);

    service.controlsGroup = service.createGroup(service.controlLines, { selectable: false }, false);

    service.objectControls = true;

    // top-left
    // top-right
    // bottom-left
    // bottom-right

  }

};

var eraseObjectControls = function(element) {

  $log.info('fabric - eraseObjectControls()');

  if (service.objectControls === true) {

    $log.info('service.objectControls === true');

    service.removeGroup(service.controlsGroup, true)

    service.objectControls = false;
  }
};

 // element.target.setFill('red');
 // service.canvas.renderAll();


 // element.target.setFill('green');
 // service.canvas.renderAll();

 rectDefaults.strokeWidth = 5;

 rectDefaults.left = element.target.left - (rectDefaults.strokeWidth + 1);
 rectDefaults.top = element.target.top - (rectDefaults.strokeWidth + 1);
 rectDefaults.width = element.target.width + (2 * rectDefaults.strokeWidth);
 rectDefaults.height = element.target.height + (2 * rectDefaults.strokeWidth);
 rectDefaults.fill = 'none';
 rectDefaults.stroke = 'rgba(100,200,200,0.5)';
 rectDefaults.opacity = 0.5;

 // $log.info('rectDefaults: ' + JSON.stringify(['e', rectDefaults], null, '\t'));

 objectControls = service.addRect(rectDefaults, false);

if (object.left === canvasDefaults.grid.size || object.top === canvasDefaults.grid.size) {
  $log.info('fabric - addObjectToCanvas() - centerObject()');
  fabricWindow.centerObject();
}

// $log.info('mouse:over - element.target: ' + JSON.stringify(['e', element.target], null, '\t'));

 rectDefaults.left = 50 - (rectDefaults.strokeWidth + 1);
 rectDefaults.top = 50 - (rectDefaults.strokeWidth + 1);
 rectDefaults.width = 300 + (2 * rectDefaults.strokeWidth);
 rectDefaults.height = 300 + (2 * rectDefaults.strokeWidth);

 var activeGroup = this.getActiveGroup();

 if (activeGroup) {
 drawGroupControls();
 } else {
 drawObjectControls();
 }

 */
