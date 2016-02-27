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

  fabric.$inject = ['$log', '$rootScope', 'fabricCanvas', 'fabricConfig', 'fabricWindow', 'fabricShape', 'fabricText', 'fabricUtils'];

  function fabric($log, $rootScope, fabricCanvas, fabricConfig, fabricWindow, fabricShape, fabricText, fabricUtils) {

    var service = this;

    // http://htmlcolorcodes.com/color-names/

    const DEFAULT_ARROW_FILL = 'BLACK';
    const FROM_ARROW_FILL = 'RED';  // 'RED'
    const TO_ARROW_FILL = 'GREEN';    // 'GREEN'
    const MOUSE_OVER_ARROW_FILL = 'LIME';

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
    service.connectorLineFromArrow = null;
    service.isMouseDown = false;
    service.fromObject = null;

    // service.formatShape = { show: false};

    $log.debug('ui-fabric');

    service.init = function () {

      $log.debug('fabric - init()');

      service.canvasDefaults = fabricConfig.getCanvasDefaults();
      service.controlDefaults = fabricConfig.getControlDefaults();
      service.rectDefaults = fabricConfig.getRectDefaults();
      service.connectorDefaults = fabricConfig.getConnectorDefaults();
      service.arrowDefaults = fabricConfig.getArrowDefaults();
    };

    service.setConnectorMode = function (mode) {

      $log.debug('fabric - setConnectorMode(): ' + mode);

      service.connectorMode = mode;
      service.canvas.selection = !mode;
    };

    //
    // Canvas
    //

    service.getCanvas = function () {

      $log.debug('fabric - getCanvas()');

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

      // $log.debug('width: ' + service.canvasDefaults.width);
      // $log.debug('height: ' + service.canvasDefaults.height);

      if (show) {

        $log.debug('fabric - showGrid(true)');

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

        $log.debug('fabric - showGrid() - deactivateAll().renderAll()');
        service.canvas.deactivateAll().renderAll();

      } else {

        $log.debug('fabric - showGrid(false)');

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

      // $log.debug('fabric - addObjectToCanvas() - render: ' + render.toLocaleString());

      if (render !== false) {
        $log.debug('fabric - addObjectToCanvas() - renderAll');
        service.canvas.renderAll();
      }

      return object;
    };

    var removeObjectFromCanvas = function(object, render) {

      service.canvas.remove(object);

      $log.debug('fabric - removeObjectFromCanvas() - render: ' + render.toLocaleString());

      if (render) {
        $log.debug('fabric - removeObjectFromCanvas() - renderAll');
        service.canvas.renderAll();
      }
    };

    service.getActiveObject = function() {

      $log.debug('fabric - getActiveObject()');

      return service.canvas.getActiveObject();

    };

    service.setActiveObject = function(object) {

      $log.debug('fabric - setActiveObject()');

      if (object) {
        service.canvas.setActiveObject(object);
        // service.canvas.renderAll();
      }
    };

    service.removeActiveObjectFromCanvas = function() {

      $log.debug('fabric - removeActiveObjectFromCanvas()');

      var object = service.canvas.getActiveObject();
      if (object) {
        service.canvas.remove(object);
        service.canvas.renderAll();
      }
    };

    service.bringForward = function() {

      $log.debug('fabric - bringForward()');

      var object = service.canvas.getActiveObject();
      if (object) {
        service.canvas.bringForward(object);
        service.canvas.renderAll();
      }
    };

    service.bringToFront = function() {

      $log.debug('fabric - bringToFront()');

      var object = service.canvas.getActiveObject();
      if (object) {
        service.canvas.bringToFront(object);
        service.canvas.renderAll();
      }
    };

    service.sendBackward = function() {

      $log.debug('fabric - sendBackward()');

      var object = service.canvas.getActiveObject();
      if (object) {
        service.canvas.sendBackwards(object);
        service.canvas.renderAll();
      }
    };

    service.sendToBack = function() {

      $log.debug('fabric - sendToBack()');

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

      $log.debug('fabric - addRect()');

      return addObjectToCanvas(fabricShape.rect(options), render);
    };

    /**
     * @name addRectWithText
     * @desc Creates a new Rect and adds it to the canvas
     * @param {String} [text] A string of text
     * @param {Object} [options] A configuration object, defaults to service.rectDefaults
     * @param {Boolean} [render] When true, service.canvas.renderAll() is invoked
     * @return {Object} Returns the new Rect object
     */
    service.addRectWithText = function(text, options, render) {

      $log.debug('fabric - addRectWithText()');

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

      $log.debug('fabric - addTriangle()');

      return addObjectToCanvas(fabricShape.triangle(options), render);
    };

    //
    // Arrow
    // See: https://en.wikipedia.org/wiki/Atan2 and
    //      http://gamedev.stackexchange.com/questions/14602/what-are-atan-and-atan2-used-for-in-games
    //

    service.createArrow = function(points, options) {

      // $log.debug('createArrow()');

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

      options.left = x2;
      options.top = y2;
      options.angle = angle;

      $log.debug('createArrow() - left: ' + options.left + ' top: ' + options.top + ' angle: ' + options.angle);

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

      $log.debug('moveFromArrows()');

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

      $log.debug('moveToArrows()');

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

      $log.debug('fabric - addLine()');

      return addObjectToCanvas(fabricShape.line(points, options), render);
    };

    //
    // Connector
    //

    /**
     * @name addConnector
     * @desc Creates a new Connector and adds it to the canvas
     * @param {Array} [points] Array of points, e.g., [0, 0, 0, 0]
     * @param {Object} [options] A configuration object, defaults to service.lineDefaults
     * @param {Boolean} [render] When true, service.canvas.renderAll() is invoked
     * @return {Object} Returns the new Connector object
     */
    service.addConnector = function(points, options, render) {

      $log.debug('fabric - addConnector()');

      return addObjectToCanvas(fabricShape.connector(points, options), render);
    };

    //
    // Text
    //

    /**
     * @name addText
     * @desc Creates a new Line and adds it to the canvas
     * @param {String} [text] A string of text
     * @param {Object} [options] A configuration object, defaults to service.textDefaults
     * @param {Boolean} [render] When true, service.canvas.renderAll() is invoked
     * @return {Object} Returns the new Text object
     */
    service.addText = function(text, options, render) {

      $log.debug('fabric - addText()');

      return addObjectToCanvas(fabricText.text(text, options), render);
    };

    //
    // Groups
    //

    service.createGroup = function(objects, options, render) {

      $log.debug('fabric - createGroup()');

      var object = new fabricWindow.Group(objects, options);

      $log.debug('fabric - createGroup() - render: ' + render.toLocaleString());

      return addObjectToCanvas(object, render);
    };

    service.removeGroup = function(object, render) {
      $log.debug('fabric - removeGroup()');
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

    // Object

    service.objectMovingListener = function(options) {

      $log.debug('objectMovingListener()');

      var object = options.target;

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

      //
      // If the Object being moved has Connectors, we need to update their position.
      //
      if (object.connectors) {

        $log.debug(object.text + ' is moving!');

        var portCenter = null;
        var i = null;

        if (object.connectors.fromLine.length) {

          $log.debug('objectMovingListener() - object.connectors.fromLine.length: ' + object.connectors.fromLine.length);

          i = 0;
          object.connectors.fromLine.forEach(function(line) {
            portCenter = fabricUtils.getPortCenterPoint(object, object.connectors.fromPort[i]);
            line.set({'x1': portCenter.x1, 'y1': portCenter.y1});

            service.moveFromArrows(object, portCenter, i);
            i++;
          });
        }

        if (object.connectors.toLine.length) {

          $log.debug('objectMovingListener() - object.connectors.toLine.length: ' + object.connectors.toLine.length);

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
    };

    // Mouse


    service.mouseMoveListener = function(options) {

      // $log.debug('mouseMoveListener()');

      if (!service.isMouseDown) return;

      if (service.connectorMode) {

        var pointer = service.canvas.getPointer(options.e);

        service.connectorLine.set({ x2: pointer.x, y2: pointer.y });
        service.canvas.renderAll();
      }
    };

    const CORNER_SIZE = 10;  // as per ui-fabric-config-service.js

    //
    // If we draw an arrow on the end of the line as we are dragging it then we need to offset it from the
    // actual position of the mouse pointer otherwise fabric.js thinks it is over ('mouse:over') the arrow.
    // TODO: Offset the x coordinate if the line is horizontal, the y coordinate if the line is vertical

    service.mouseMoveListenerWithArrow = function(options) {

      // $log.debug('mouseMoveListenerWithArrow()');

      if (!service.isMouseDown) return;

      if (service.connectorMode) {

        var pointer = service.canvas.getPointer(options.e);

        service.connectorLine.set({ x2: (pointer.x - CORNER_SIZE), y2: (pointer.y) });

        if (service.connectorLineFromArrow) {
          removeObjectFromCanvas(service.connectorLineFromArrow, false);
        }

        service.connectorLineFromArrow = service.createArrow([service.connectorLine.left,
          service.connectorLine.top, (pointer.x - CORNER_SIZE), (pointer.y)], service.arrowDefaults);

        service.canvas.renderAll();
      }
    };

    service.mouseDownListener = function(options) {

      $log.debug('mouseDownListener()');

      //
      // Connector Mode
      //

      if (service.connectorMode) {

        if (service.selectedObject) {

          service.fromObject = service.selectedObject;

          var points = null;

          //
          // Fabric "remembers" the last port you we're successfully over.
          // Which means you will only receive a __corner === 'undefined' once per object (node).
          //

          if (service.fromObject.__corner === undefined) {
            $log.debug('mouseDownListener() - service.fromObject.__corner === undefined');
            return;
          }

          service.isMouseDown = true;

          points = fabricUtils.findTargetPort(service.fromObject);
          service.connectorLineFromPort = service.fromObject.__corner;

          $log.debug('mouseDownListener() - points: ' + JSON.stringify(['e', points], null, '\t'));

          var connectorOptions = service.connectorDefaults;

          // service.connectorLine = service.addLine(points, connectorOptions);
          service.connectorLine = service.addConnector(points, connectorOptions);
        }

        return;
      }

      //
      // Pointer Mode
      //

      if (options.target) {
        if (options.target.type === 'arrow') {
          $log.debug('mouseDownListener() - options.target.type === arrow');
        }
      }

    };

    service.mouseUpListener = function(options) {

      $log.debug('mouseUpListener()');

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

          //
          // The from object and the to object must be different objects (nodes).
          //
          if (service.selectedObject === service.fromObject) {

            $log.debug('mouseUpListener() - service.selectedObject === service.fromObject');

            if (service.connectorLine) {
              removeObjectFromCanvas(service.connectorLine, false);
              if (service.connectorLineFromArrow) {
                removeObjectFromCanvas(service.connectorLineFromArrow, false);
              }
            }

            service.connectorLineFromArrow = null;
            service.connectorLineFromPort = null;
            service.connectorLine = null;

            return;
          }

          //
          // If we're not over a connection port, then we need to remove the connector (line) and return.
          //
          if (service.selectedObject.__corner === undefined) {

            if (service.connectorLine) {
              $log.debug('mouseUpListener() - removeObjectFromCanvas(service.connectorLine)');
              removeObjectFromCanvas(service.connectorLine, false);
              if (service.connectorLineFromArrow) {
                $log.debug('mouseUpListener() - removeObjectFromCanvas(service.connectorLineFromArrow)');
                removeObjectFromCanvas(service.connectorLineFromArrow, false);
              }
            }

            // service.canvas.renderAll();
            return;
          }

          // We're over a connection port, and the user has finished (mouse:up) drawing the connector (line).
          // object(fromPort) <-- toArrow -- connector -- fromArrow --> (toPort)otherObject
          // one arrow faces towards the object <--, the other faces away from --> the object

          var toPort = service.selectedObject.__corner;
          var arrowOptions = service.arrowDefaults;

          $log.debug('mouseUpListener() - toPort: ' + toPort);

          portCenter = fabricUtils.getPortCenterPoint(service.selectedObject, toPort);
          service.connectorLine.set({ x2: portCenter.x2, y2: portCenter.y2 });

          //
          // Create the 'from' arrow
          //

          // service.fromObject <-- toArrow -- connector -- fromArrow --> service.selectedObject

          $log.debug('mouseUpListener() - create fromArrow');

          arrowOptions.fill = FROM_ARROW_FILL;
          // var fromArrow = service.createArrow([service.connectorLine.left, service.connectorLine.top,
          //   portCenter.x2, portCenter.y2], arrowOptions);
          var fromArrow = service.createArrow([service.connectorLine.x1, service.connectorLine.y1,
            portCenter.x2, portCenter.y2], arrowOptions);
          fromArrow.object = service.fromObject;
          fromArrow.otherObject = service.selectedObject;
          fromArrow.isFromArrow = true;
          fromArrow.port = toPort;
          fromArrow.line = service.connectorLine;

          //
          // Create the 'to' arrow
          //

          $log.debug('mouseUpListener() - create toArrow');

          arrowOptions.fill = TO_ARROW_FILL;
          // var toArrow = service.createArrow([portCenter.x2, portCenter.y2,
          //   service.connectorLine.left, service.connectorLine.top], arrowOptions);
          var toArrow = service.createArrow([portCenter.x2, portCenter.y2,
            service.connectorLine.x1, service.connectorLine.y1], arrowOptions);
          toArrow.object = fromArrow.object;
          toArrow.otherObject = fromArrow.otherObject;
          toArrow.isFromArrow = false;
          toArrow.port = service.connectorLineFromPort;
          toArrow.line = fromArrow.line;

          //
          // Arrays in JavaScript are zero-based.
          //

          var index = service.fromObject.connectors.fromPort.length;

          if (index !== 0) {
            index = index - 1;
          }

          $log.debug('mouseUpListener() - index: ' + index);

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

          $log.info(service.fromObject.text + ' and ' + service.selectedObject.text + ' are connected!');

          // $log.debug('service.fromObject.connectors: ' + JSON.stringify(['e', service.fromObject.connectors], null, '\t'));
          // $log.debug('service.selectedObject.connectors: ' + JSON.stringify(['e', service.selectedObject.connectors], null, '\t'));

          arrowOptions.fill = DEFAULT_ARROW_FILL;

          if (service.connectorLineFromArrow) {
            $log.debug('mouse:up - removeObjectFromCanvas(service.connectorLineFromArrow)');
            removeObjectFromCanvas(service.connectorLineFromArrow, false);
          }

          service.connectorLineFromArrow = null;
          service.connectorLineFromPort = null;
          service.connectorLine = null;

        } else {  // if (service.selectedObject)

          if (service.connectorLine) {
            $log.debug('mouseUpListener() - removeObjectFromCanvas(service.connectorLine)');
            removeObjectFromCanvas(service.connectorLine, false);
            if (service.connectorLineFromArrow) {
              $log.debug('mouseUpListener() - removeObjectFromCanvas(service.connectorLineFromArrow)');
              removeObjectFromCanvas(service.connectorLineFromArrow, false);
            }
          }

          service.connectorLineFromArrow = null;
          service.connectorLineFromPort = null;
          service.connectorLine = null;
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

            $log.debug('mouseUpListener() - arrow.otherObject.name: ' + arrow.otherObject.name);
            $log.debug('mouseUpListener() - fromArrow - arrow.line x2: ' + arrow.line.x2 + ' y2: ' + arrow.line.y2);

          } else {

            portCenter =  fabricUtils.getPortCenterPoint(arrow.object, nextPort);

            arrow.object.connectors.toPort[arrow.index] = arrow.port;
            arrow.otherObject.connectors.fromPort[arrow.index] = arrow.port;
            arrow.line.x1 = portCenter.x1;
            arrow.line.y1 = portCenter.y1;

            $log.debug('mouseUpListener() - arrow.object.name: ' + arrow.object.name);
            $log.debug('mouseUpListener() - toArrow - arrow.line x1: ' + arrow.line.x1 + ' y1: ' + arrow.line.y1);
          }

          service.canvas.renderAll();

        } // end if (options.target.type === 'arrow')

      } // end if (options.target)

    };

    service.mouseOverListener = function(element) {

      // $log.debug('mouseOverListener()');

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

          // $log.debug('mouseOverListener() - selectedObject: ' + service.selectedObject.text);

          return;
        }

        return;

      } // end if (service.connectorMode)

      //
      // Pointer Mode
      //

      if (element.target.type === 'arrow') {
        element.target.hoverCursor = 'pointer';
        element.target.setFill(MOUSE_OVER_ARROW_FILL);
        service.canvas.renderAll();
        // return;
      }

    };

    service.mouseOutListener = function(element) {

      // $log.debug('mouseOutListener()');

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

    };

    service.objectSelectedListener = function(element) {

      $log.debug('objectSelectedListener()');

      if (service.connectorMode) {

        if (element.target.type === 'node') {

          $log.debug('objectSelectedListener() - element.target.type === node');

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

      // $rootScope.$broadcast('shape:selected');
      // service.formatShape.show = true;
      // $log.debug('objectSelectedListener() - service.formatShape.show: ' + service.formatShape.show);

    };

    service.selectionClearedListener = function(element) {

      $log.debug('selectionClearedListener()');
      service.activeObject = null;

      // $rootScope.$broadcast('diagram:selected');
      // service.formatShape.show = false;
      // $log.debug('selectionClearedListener() - service.formatShape.show: ' + service.formatShape.show);

    };

    service.configCanvasListeners = function() {

      $log.debug('configCanvasListeners()');

      service.canvas.on({
        'object:moving': service.objectMovingListener,
        // 'object:selected': service.objectSelectedListener,
        'mouse:move': service.mouseMoveListener,
        // 'mouse:move': mouseMoveListenerWithArrow
        'mouse:down': service.mouseDownListener,
        'mouse:up': service.mouseUpListener,
        'mouse:over': service.mouseOverListener,
        'mouse:out': service.mouseOutListener
        // 'selection:cleared': service.selectionClearedListener
      });

    };

    service.init();

    return service;

  }

})();

// service.selectedObject.set('cornerColor', service.rectDefaults.cornerColor);

// arrow.line.set({ x2: portCenter.x2, y2: portCenter.y2 });

// $log.debug('mouse:up - arrow - isFromArrow: ' + arrow.isFromArrow);
// $log.debug('mouse:up - arrow: ' + JSON.stringify(['e', arrow], null, '\t'));
// $log.debug('mouse:up - arrow.line: ' + JSON.stringify(['e', arrow.line], null, '\t'));
