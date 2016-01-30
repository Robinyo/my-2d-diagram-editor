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

  fabric.$inject = ['$log', 'fabricCanvas', 'fabricConfig', 'fabricWindow', 'fabricShape', 'fabricText', 'fabricUtils'];

  function fabric($log, fabricCanvas, fabricConfig, fabricWindow, fabricShape, fabricText, fabricUtils) {

    var service = this;

    const FROM_ARROW_FILL = 'RED';
    const TO_ARROW_FILL = 'GREEN';

    service.canvas = null;

    service.canvasDefaults = null;
    service.controlDefaults = null;
    service.rectDefaults = null;
    service.connectorDefaults = null;
    service.arrowDefaults = null;

    service.verticalGridLinesGroup = {};
    service.horizontalGridLinesGroup = {};
    service.verticalGridLines = [];
    service.horizontalGridLines = [];

    service.connectorMode = false;
    service.activeObject = null;
    service.selectedObject = null;
    service.connectorLine = null;
    service.connectorLineFromPort = null;
    service.isMouseDown = false;
    service.fromObject = null;

    $log.info('ui-fabric');

    service.init = function () {

      $log.info('fabric - init()');

      service.canvasDefaults = fabricConfig.getCanvasDefaults();
      service.controlDefaults = fabricConfig.getControlDefaults();
      service.rectDefaults = fabricConfig.getRectDefaults();
      service.connectorDefaults = fabricConfig.getConnectorDefaults();
      service.arrowDefaults = fabricConfig.getArrowDefaults();
    };

    service.setConnectorMode = function (mode) {

      $log.info('fabric - setConnectorMode(): ' + mode);

      service.connectorMode = mode;
      service.canvas.selection = !mode;
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

    service.showGrid = function(show) {

      var grid = service.canvasDefaults.grid.size;
      var width = service.canvasDefaults.width;
      var height = service.canvasDefaults.height;

      // $log.info('width: ' + service.canvasDefaults.width);
      // $log.info('height: ' + service.canvasDefaults.height);

      if (show) {

        $log.info('fabric - showGrid(true)');

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

      } else {

        $log.info('fabric - showGrid(false)');

        service.removeGroup(service.verticalGridLinesGroup, false);
        service.removeGroup(service.horizontalGridLinesGroup, true);
      }
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

      // $log.info('fabric - addObjectToCanvas() - render: ' + render.toLocaleString());

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

      var object = service.canvas.getActiveObject();
      if (object) {
        service.canvas.remove(object);
        service.canvas.renderAll();
      }
    };

    service.bringForward = function() {

      $log.info('fabric - bringForward()');

      var object = service.canvas.getActiveObject();
      if (object) {
        service.canvas.bringForward(object);
        service.canvas.renderAll();
      }
    };

    service.bringToFront = function() {

      $log.info('fabric - bringToFront()');

      var object = service.canvas.getActiveObject();
      if (object) {
        service.canvas.bringToFront(object);
        service.canvas.renderAll();
      }
    };

    service.sendBackward = function() {

      $log.info('fabric - sendBackward()');

      var object = service.canvas.getActiveObject();
      if (object) {
        service.canvas.sendBackwards(object);
        service.canvas.renderAll();
      }
    };

    service.sendToBack = function() {

      $log.info('fabric - sendToBack()');

      var object = service.canvas.getActiveObject();
      if (object) {
        service.canvas.sendToBack(object);
        service.canvas.renderAll();
      }
    };

    //
    // Rect
    //

    /**
     * @name addRect
     * @desc Creates a new Rect and adds it to the canvas
     * @param {Object} [options] A configuration object, defaults to service.rectDefaults
     * @param {Boolean} [render] When true, service.canvas.renderAll() is invoked
     * @return {Object} Returns the new Rect object
     */
    service.addRect = function(options, render) {

      $log.info('fabric - addRect()');

      return addObjectToCanvas(fabricShape.rect(options), render);
    };

    service.addRectWithText = function(text, options, render) {

      $log.info('fabric - addRectWithText()');

      return addObjectToCanvas(fabricShape.rectWithText(text, options), render);
    };

    //
    // Triangle
    //

    /**
     * @name addTriangle
     * @desc Creates a new Triangle and adds it to the canvas
     * @param {Object} [options] A configuration object, defaults to service.triangleDefaults
     * @param {Boolean} [render] When true, service.canvas.renderAll() is invoked
     * @return {Object} Returns the new Triangle object
     */
    service.addTriangle = function(options, render) {

      $log.info('fabric - addTriangle()');

      return addObjectToCanvas(fabricShape.triangle(options), render);
    };

    //
    // Arrow
    // See: https://en.wikipedia.org/wiki/Atan2 and
    //      http://gamedev.stackexchange.com/questions/14602/what-are-atan-and-atan2-used-for-in-games
    //

    service.createArrow = function(points, options) {

      var x1 = points[0];
      var y1 = points[1];
      var x2 = points[2];
      var y2 = points[3];

      options = options || service.arrowDefaults;

      var dx = x2 - x1;
      var dy = y2 - y1;

      var angle = Math.atan2(dy, dx);
      angle *= 180 / Math.PI;
      angle += 90;

      options.angle = angle;
      options.top = y2;
      options.left = x2;

      // TODO - http://fabricjs.com/fabric-intro-part-3/#subclassing

      var object = service.addTriangle(options);
      object.set('type', 'arrow');
      object.index = 0;
      object.object = {};
      object.otherObject = {};
      object.isFromArrow = true;
      object.port = 'mt';
      object.line = {};

      return object;
    };

    service.moveFromArrows = function(object, portCenter, index) {

      $log.info('moveFromArrows()');

      removeObjectFromCanvas(object.connectors.fromArrow[index], false);
      removeObjectFromCanvas(object.connectors.toArrow[index], false);

      var x1 = portCenter.x1;
      var y1 = portCenter.y1;
      var x2 = object.connectors.fromLine[index].x2;
      var y2 = object.connectors.fromLine[index].y2;

      // object <-- toArrow -- connector -- fromArrow --> otherObject
      // one arrow is adjacent to the object <--, the other faces away from --> the object

      var otherObject = object.connectors.otherObject[index];

      var fromArrow = service.createArrow([ x1, y1, x2, y2 ]);
      fromArrow.index = index;
      fromArrow.object = object;
      fromArrow.otherObject = otherObject;
      fromArrow.isFromArrow = true;
      fromArrow.port = fromArrow.object.connectors.toPort[index];
      fromArrow.line = fromArrow.object.connectors.fromLine[index];

      var toArrow = service.createArrow([ x2, y2, x1, y1 ]);
      toArrow.index = fromArrow.index;
      toArrow.object = fromArrow.object;
      toArrow.otherObject = fromArrow.otherObject;
      toArrow.isFromArrow = false;
      toArrow.port = fromArrow.object.connectors.fromPort[index];
      toArrow.line = fromArrow.line;

      object.connectors.fromArrow[index] = fromArrow;
      object.connectors.toArrow[index] = toArrow;

      otherObject.connectors.fromArrow[index] = fromArrow;
      otherObject.connectors.toArrow[index] = toArrow;
    };

    service.moveToArrows = function(object, portCenter, index) {

      $log.info('moveToArrows()');

      removeObjectFromCanvas(object.connectors.fromArrow[index], false);
      removeObjectFromCanvas(object.connectors.toArrow[index], false);

      var x1 = portCenter.x2;
      var y1 = portCenter.y2;
      var x2 = object.connectors.toLine[index].x1;
      var y2 = object.connectors.toLine[index].y1;

      // object <-- toArrow -- connector -- fromArrow --> otherObject
      // one arrow is adjacent to the object <--, the other faces away from --> the object

      var otherObject = object.connectors.otherObject[index];

      //
      // object and otherObject are reversed for the toLine
      //

      var fromArrow = service.createArrow([ x2, y2, x1, y1 ]);
      fromArrow.index = index;
      fromArrow.object = otherObject;
      fromArrow.otherObject = object;
      fromArrow.isFromArrow = true;
      fromArrow.port = object.connectors.toPort[index];
      fromArrow.line = object.connectors.toLine[index];

      var toArrow = service.createArrow([ x1, y1, x2, y2  ]);
      toArrow.index = fromArrow.index;
      toArrow.object = fromArrow.object;
      toArrow.otherObject = fromArrow.otherObject;
      toArrow.isFromArrow = false;
      toArrow.port = object.connectors.fromPort[index];
      toArrow.line = fromArrow.line;

      object.connectors.fromArrow[index] = fromArrow;
      object.connectors.toArrow[index] = toArrow;

      otherObject.connectors.fromArrow[index] = fromArrow;
      otherObject.connectors.toArrow[index] = toArrow;
    };

    //
    // Line
    //

    /**
     * @name addLine
     * @desc Creates a new Line and adds it to the canvas
     * @param {Array} [points] Array of points, e.g., [0, 0, 0, 0]
     * @param {Object} [options] A configuration object, defaults to service.lineDefaults
     * @param {Boolean} [render] When true, service.canvas.renderAll() is invoked
     * @return {Object} Returns the new Line object
     */
    service.addLine = function(points, options, render) {

      $log.info('fabric - addLine()');

      return addObjectToCanvas(fabricShape.line(points, options), render);
    };

    //
    // Text
    //

    /**
     * @name addText
     * @desc Creates a new Line and adds it to the canvas
     * @param {Object} [options] A configuration object, defaults to service.textDefaults
     * @param {Boolean} [render] When true, service.canvas.renderAll() is invoked
     * @return {Object} Returns the new Text object
     */
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

    service.snapToGrid = function(snapTo) {
      service.canvasDefaults.grid.snapTo = snapTo;
    };

    //
    // Listeners
    //

    service.configCanvasListeners = function() {

      //
      // Object
      //

      service.canvas.on('object:moving', function(options) {

        $log.info('object:moving');

        var object = options.target;

        //
        // If the Object being moved has Connectors, we need to update their position.
        //
        if (object.connectors) {

          var portCenter = null;
          var i = null;

          if (object.connectors.fromLine.length) {

            $log.info('object:moving - object.connectors.fromLine.length: ' + object.connectors.fromLine.length);

            i = 0;
            object.connectors.fromLine.forEach(function(line) {
              portCenter = fabricUtils.getPortCenterPoint(object, object.connectors.fromPort[i]);
              line.set({'x1': portCenter.x1, 'y1': portCenter.y1});

              service.moveFromArrows(object, portCenter, i);
              i++;
            });
          }

          if (object.connectors.toLine.length) {

            $log.info('object:moving - object.connectors.toLine.length: ' + object.connectors.toLine.length);

            i = 0;
            object.connectors.toLine.forEach(function(line) {
              portCenter = fabricUtils.getPortCenterPoint(object, object.connectors.toPort[i]);
              // portCenter = fabricUtils.getPortCenterPoint(object.connectors.otherObject[i], object.connectors.toPort[i]);
              line.set({'x2': portCenter.x2, 'y2': portCenter.y2});

              service.moveToArrows(object, portCenter, i);
              i++;
            });
          }

          service.canvas.renderAll();
        }

        //
        // Snap to grid
        //

        if (service.canvasDefaults.grid.snapTo) {
          object.set({
            left: Math.round(options.target.left /
            service.canvasDefaults.grid.size) * service.canvasDefaults.grid.size,
            top: Math.round(options.target.top /
            service.canvasDefaults.grid.size) * service.canvasDefaults.grid.size
          });
        }

      });

      //
      // Mouse
      //

      service.canvas.on('mouse:move', function(options){

        // $log.info('mouse:move');

        if (!service.isMouseDown) return;

        if (service.connectorMode) {
          var pointer = service.canvas.getPointer(options.e);

          service.connectorLine.set({ x2: pointer.x, y2: pointer.y });
          service.canvas.renderAll();
        }
      });

      service.canvas.on('mouse:down', function(options){

        $log.info('mouse:down');

        //
        // Connector Mode
        //

        if (service.connectorMode) {

          if (service.selectedObject) {

            service.fromObject = service.selectedObject;

            var points = null;

            if (service.fromObject.__corner === undefined) {
              $log.info('mouse:down - service.fromObject.__corner === undefined');
              return;
            }

            service.isMouseDown = true;

            points = fabricUtils.findTargetPort(service.fromObject);
            service.connectorLineFromPort = service.fromObject.__corner;

            // $log.info('mouse:down - points: ' + JSON.stringify(['e', points], null, '\t'));

            var connectorOptions = service.connectorDefaults;

            service.connectorLine = service.addLine(points, connectorOptions);
          }

          return;
        }

        //
        // Pointer Mode
        //

        if (options.target) {
          if (options.target.type === 'arrow') {
            $log.info('mouse:down - options.target.type === arrow');
          }
        }

      });

      service.canvas.on('mouse:up', function(options){

        $log.info('mouse:up');

        var portCenter = null;

        //
        // Connector Mode
        //

        if (service.connectorMode) {

          service.isMouseDown = false;

          //
          // If we're over (mouse:over) a Shape that supports connections.
          //
          if (service.selectedObject) {

            if (service.selectedObject.__corner === undefined) {
              if (service.connectorLine) {
                $log.info('mouse:up - removeObjectFromCanvas()');
                removeObjectFromCanvas(service.connectorLine, false);
              }

              // service.canvas.renderAll();
              return;
            }

            //
            // End of the line (from --> to)
            //

            var toPort = service.selectedObject.__corner;
            var arrowOptions = service.arrowDefaults;

            $log.info('mouse:up - toPort: ' + toPort);

            portCenter = fabricUtils.getPortCenterPoint(service.selectedObject, toPort);
            service.connectorLine.set({ x2: portCenter.x2, y2: portCenter.y2 });

            //
            // Create the 'from' arrow
            //

            // service.fromObject <-- toArrow -- connector -- fromArrow --> service.selectedObject

            arrowOptions.fill = FROM_ARROW_FILL;
            var fromArrow = service.createArrow([service.connectorLine.left,
              service.connectorLine.top, portCenter.x2, portCenter.y2], arrowOptions);
            fromArrow.object = service.fromObject;
            fromArrow.otherObject = service.selectedObject;
            fromArrow.isFromArrow = true;
            fromArrow.port = toPort;
            fromArrow.line = service.connectorLine;

            //
            // Create the 'to' arrow
            //

            arrowOptions.fill = TO_ARROW_FILL;
            var toArrow = service.createArrow([portCenter.x2, portCenter.y2,
              service.connectorLine.left, service.connectorLine.top], arrowOptions);
            toArrow.object = fromArrow.object;
            toArrow.otherObject = fromArrow.otherObject;
            toArrow.isFromArrow = false;
            toArrow.port = service.connectorLineFromPort;
            toArrow.line = fromArrow.line;

            var index = service.fromObject.connectors.fromPort.length;
            fromArrow.index = index;
            toArrow.index = index;

            //
            // The 'from' and 'to' objects need to know about each other so that if one of them
            // is moved it can update the connectors line co-ordinates and arrows.
            //

            service.fromObject.connectors.fromPort.push(service.connectorLineFromPort);
            service.fromObject.connectors.fromArrow.push(fromArrow);
            service.fromObject.connectors.toPort.push(toPort);
            service.fromObject.connectors.toArrow.push(toArrow);
            service.fromObject.connectors.otherObject.push(service.selectedObject);

            service.fromObject.connectors.fromLine.push(service.connectorLine);
            service.selectedObject.connectors.toLine.push(service.connectorLine);

            service.selectedObject.connectors.fromPort.push(service.connectorLineFromPort);
            service.selectedObject.connectors.fromArrow.push(fromArrow);
            service.selectedObject.connectors.toPort.push(toPort);
            service.selectedObject.connectors.toArrow.push(toArrow);
            service.selectedObject.connectors.otherObject.push(service.fromObject);

            // $log.info('service.fromObject.connectors: ' + JSON.stringify(['e', service.fromObject.connectors], null, '\t'));
            // $log.info('service.selectedObject.connectors: ' + JSON.stringify(['e', service.selectedObject.connectors], null, '\t'));

            arrowOptions.fill = 'BLACK';

            service.connectorLineFromPort = null;
            service.connectorLine = null;

          } else {

            if (service.connectorLine) {

              $log.info('mouse:up - removeObjectFromCanvas()');

              removeObjectFromCanvas(service.connectorLine, false);
            }
          }

          service.canvas.renderAll();
          return;
        }

        //
        // Pointer Mode
        //

        if (options.target) {

          if (options.target.type === 'arrow') {

            var arrow = options.target;
            var nextPort = fabricUtils.getNextTargetPort(arrow.port);

            arrow.port = nextPort;

            if (arrow.isFromArrow) {

              portCenter =  fabricUtils.getPortCenterPoint(arrow.otherObject, nextPort);

              arrow.object.connectors.toPort[arrow.index] = arrow.port;
              arrow.otherObject.connectors.fromPort[arrow.index] = arrow.port;
              arrow.line.x2 = portCenter.x2;
              arrow.line.y2 = portCenter.y2;

              $log.info('mouse:up - arrow.otherObject.name: ' + arrow.otherObject.name);
              $log.info('mouse:up - fromArrow - arrow.line x2: ' + arrow.line.x2 + ' y2: ' + arrow.line.y2);

            } else {

              portCenter =  fabricUtils.getPortCenterPoint(arrow.object, nextPort);

              arrow.object.connectors.toPort[arrow.index] = arrow.port;
              arrow.otherObject.connectors.fromPort[arrow.index] = arrow.port;
              arrow.line.x1 = portCenter.x1;
              arrow.line.y1 = portCenter.y1;

              $log.info('mouse:up - arrow.object.name: ' + arrow.object.name);
              $log.info('mouse:up - toArrow - arrow.line x1: ' + arrow.line.x1 + ' y1: ' + arrow.line.y1);
            }

            service.canvas.renderAll();

          } // end if (options.target.type === 'arrow')

        } // end if (options.target)

      });

      service.canvas.on('mouse:over', function(element) {

        // $log.info('mouse:over');

        //
        // Connector Mode
        //

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
            service.selectedObject.set('selectable', false);
            service.selectedObject.set('hasRotatingPoint', false);
            service.selectedObject.set('hasBorders', false);
            service.selectedObject.set('cornerSize', service.rectDefaults.cornerSize * 2);
            service.selectedObject.set('transparentCorners', false);
            service.selectedObject.setControlsVisibility({ tl: false, tr: false, br: false, bl: false });

            service.canvas.renderAll();
            return;
          }

          return;

        } // end if (service.connectorMode)

        //
        // Pointer Mode
        //

        if (element.target.type === 'arrow') {
          element.target.hoverCursor = 'pointer';
          element.target.setFill('BLUE');
          service.canvas.renderAll();
          // return;
        }

      });

      service.canvas.on('mouse:out', function(element) {

        // $log.info('mouse:out');

        //
        // Connector Mode
        //

        if (service.connectorMode) {

          if (element.target.type === 'node') {

            if (service.selectedObject) {

              service.selectedObject.set('active', false);
              service.selectedObject.set('selectable', true);
              service.selectedObject.set('hasRotatingPoint', true);
              service.selectedObject.set('hasBorders', service.rectDefaults.hasBorders);
              service.selectedObject.set('cornerSize', service.rectDefaults.cornerSize);
              service.selectedObject.set('transparentCorners', service.rectDefaults.transparentCorners);
              service.selectedObject.setControlsVisibility({ tl: true, tr: true, br: true, bl: true });

              service.selectedObject = null;

              if (service.activeObject) {
                service.activeObject.set('active', true);
                service.canvas._activeObject = service.activeObject;
              }

              service.canvas.renderAll();
              return;
            }

            return;

          }

          return;

        } // end if (service.connectorMode)

        //
        // Pointer Mode
        //

        if (element.target.type === 'arrow') {

          var arrow = element.target;
          var fill = TO_ARROW_FILL;

          if (arrow.isFromArrow) {
            fill = FROM_ARROW_FILL;
          }

          arrow.setFill(fill);
          service.canvas.renderAll();
          // return;
        }

      });

      service.canvas.on('object:selected', function(element) {

        $log.info('object:selected');

        if (service.connectorMode) {

          if (element.target.type === 'node') {

            $log.info('object:selected - element.target.type === node');

            service.selectedObject = element.target;
            service.activeObject = service.selectedObject;
            service.selectedObject.set('selectable', true);
            service.selectedObject.set('hasRotatingPoint', true);
            service.selectedObject.set('hasBorders', service.rectDefaults.hasBorders);
            service.selectedObject.set('cornerSize', service.rectDefaults.cornerSize);
            service.selectedObject.set('transparentCorners', service.rectDefaults.transparentCorners);
            service.selectedObject.setControlsVisibility({ tl: true, tr: true, br: true, bl: true });

            service.canvas.renderAll();
          }
        }
      });

      service.canvas.on('selection:cleared', function(element) {
        $log.info('selection:cleared');
        service.activeObject = null;
      });

    };

    service.init();

    return service;

  }

})();

// service.selectedObject.set('cornerColor', service.rectDefaults.cornerColor);

// arrow.line.set({ x2: portCenter.x2, y2: portCenter.y2 });

// $log.info('mouse:up - arrow - isFromArrow: ' + arrow.isFromArrow);
// $log.info('mouse:up - arrow: ' + JSON.stringify(['e', arrow], null, '\t'));
// $log.info('mouse:up - arrow.line: ' + JSON.stringify(['e', arrow.line], null, '\t'));
