



(function() {

  'use strict';

  /*
   * Reference the App Module to attach a controller
   *
   * Dependency Injection Syntax and AngularJS
   * The notation that we have used is one of the two ways in which we can declare AngularJS controllers
   * (or services, directives, or filters). The style we have used, which is also the recommended way,
   * is the safe-style of Dependency Injection, or declaration.
   */

  angular.module('my-2d-diagram-editor')
    .controller('MainController', ['$log', '$translate', '$scope', 'Fabric', 'FabricConstants', 'sidebarFactory',
      function($log, $translate, $scope, Fabric, FabricConstants, sidebarFactory) {

        $log.info('MainController');

        $scope.shapes = sidebarFactory.getShapes();
        $scope.containers = sidebarFactory.getContainers();

        $scope.fabric = {};
        // $scope.FabricConstants = FabricConstants;

        $scope.grid = { show: false };
        $scope.verticalGridLinesGroup = {};
        $scope.horizontalGridLinesGroup = {};
        $scope.verticalGridLines = [];
        $scope.horizontalGridLines = [];

        $scope.init = function () {

          $scope.fabric = new Fabric({
            JSONExportProperties: FabricConstants.JSONExportProperties,
            shapeDefaults: FabricConstants.shapeDefaults,
            rectDefaults: FabricConstants.rectDefaults,
            textDefaults: FabricConstants.textDefaults,
            json: {}
          });

          $scope.toggleGrid();

        };

        $scope.$on('canvas:created', $scope.init);

        var containerTextDefaults = angular.copy(FabricConstants.textDefaults);
        containerTextDefaults.fontSize = 20;
        containerTextDefaults.fontWeight = 'bold';
        var containerRectDefaults = angular.copy(FabricConstants.rectDefaults);

        var shapeTextDefaults = angular.copy(FabricConstants.textDefaults);
        shapeTextDefaults.fontSize = 14;
        var shapeRectDefaults = angular.copy(FabricConstants.rectDefaults);
        shapeRectDefaults.width = 100;
        shapeRectDefaults.height = 100;

        $scope.newShape = function(name, fill) {

          $log.info('MainController.newShape()');

          fill = fill || '#cacaca';
          shapeRectDefaults.fill = fill;

          // name = name || 'NODE' + ' 1';
          name = 'NODE';

          $translate(name)
            .then(function (translatedValue) {
              $scope.fabric.addRect(shapeRectDefaults);
              $scope.fabric.addText(translatedValue + ' 1', shapeTextDefaults);
            });

        };

        $scope.newContainer = function(name, fill) {

          $log.info('MainController.newContainer()');

          fill = fill || '#cacaca';
          containerRectDefaults.fill = fill;

          name = name || 'CONTROLLED_ZONE';

          $translate(name)
            .then(function (translatedValue) {
              $scope.fabric.addRect(containerRectDefaults);
              $scope.fabric.addText(translatedValue, containerTextDefaults);
            });
        };

        $scope.fileNew = function() {
          $log.info('MainController.fileNew()');
        };

        $scope.editDelete = function() {
          $log.info('MainController.editDelete()');
          $scope.fabric.deleteActiveObject();
        };

        $scope.toggleGrid = function() {

          $log.info('MainController.toggleGrid()');

          $scope.grid.show = !$scope.grid.show;

          if ($scope.grid.show) {
            drawGrid();
          } else {
            removeGrid();
          }
        };

        $scope.setPointerMode = function() {
          $log.info('MainController.setPointerMode()');
          $scope.fabric.setDrawingMode(false);
        };

        $scope.setConnectorMode = function() {
          $log.info('MainController.setConnectorMode()');
          $scope.fabric.setDrawingMode(true);
        };

        $scope.toggleSnapToGrid = function() {
          $log.info('MainController.toggleSnapToGrid()');
          $scope.fabric.toggleSnapToGrid();
        };

        $scope.switchLanguage = function(key) {
          $translate.use(key);
        };

        //
        // Private methods
        //

        var removeGrid = function() {

          $log.info('MainController.removeGrid()');

          $scope.fabric.removeGroup($scope.verticalGridLinesGroup);
          $scope.fabric.removeGroup($scope.horizontalGridLinesGroup);
        };

        var drawGrid = function() {

          $log.info('MainController.drawGrid()');

          var grid = 50;
          var width = FabricConstants.canvasDefaults.width;
          var height = FabricConstants.canvasDefaults.height;

          // draw the Vertical lines
          var i = 0;
          for (var x = 0.5; x < width; x += grid) {
            $scope.verticalGridLines[i++] = $scope.fabric.drawGridLine([ x, 0.5, x, width], { stroke: '#ccc', selectable: false });
          }

          // draw the Horizontal lines
          i = 0;
          for (var y = 0.5; y < height; y += grid) {
            $scope.horizontalGridLines[i++] = $scope.fabric.drawGridLine([ 0.5, y, height, y], { stroke: '#ccc', selectable: false });
          }

          $scope.verticalGridLinesGroup = $scope.fabric.createGroup($scope.verticalGridLines, { selectable: false });
          $scope.verticalGridLinesGroup.sendToBack();
          $scope.horizontalGridLinesGroup = $scope.fabric.createGroup($scope.horizontalGridLines, { selectable: false });
          $scope.horizontalGridLinesGroup.sendToBack();

          // Why did we start x and y at 0.5? Why not 0?
          // See: http://diveintohtml5.info/canvas.html

          $scope.fabric.deselectActiveObject();
        };

      }]);
})();

/*

 $scope.viewGrid = function() {
 $log.info('MainController.viewGrid()');
 toggleGrid();
 };

 var grid = 100;
 var verticalY1= 1;
 var horizontalX1 = 1;

 for (var i = 0; i < (600 / grid); i++) {
 // draw the Vertical grid lines
 $scope.fabric.addLine([ i * grid, verticalY1, i * grid, 600], { stroke: '#ccc', selectable: false });
 // draw the Horizontal grid lines
 $scope.fabric.addLine([ horizontalX1, i * grid, 600, i * grid], { stroke: '#ccc', selectable: false });
 }

 // containerTextDefaults.left = 0;
 // containerTextDefaults.top = 0;
 // containerTextDefaults.fontFamily = 'Tahoma';

 $scope.fabric.addText('Controlled Zone');
 $scope.fabric.setFontFamily('Tahoma');
 $scope.fabric.setFontSize(20);
 $scope.fabric.toggleBold();

 $scope.fabric.addLine([ 50, 25, 50, 550], { stroke: '#ccc', selectable: false });
 $scope.fabric.addLine([ 100, 25, 100, 550], { stroke: '#ccc', selectable: false });
 $scope.fabric.addLine([ 150, 25, 150, 550], { stroke: '#ccc', selectable: false });

 */


/*

 $scope.newContainer = function(label, fill) {

 $log.info('MainController.newContainer()');

 label = label || 'New Container';
 fill = fill || '#cacaca';

 containerRectDefaults.fill = fill;

 $scope.fabric.addRect(containerRectDefaults);
 $scope.fabric.addText(label, containerTextDefaults);
 };

 */

(function() {

  'use strict';

  /*
   * Reference the App Module to attach a controller
   *
   * Dependency Injection Syntax and AngularJS
   * The notation that we have used is one of the two ways in which we can declare AngularJS controllers
   * (or services, directives, or filters). The style we have used, which is also the recommended way,
   * is the safe-style of Dependency Injection, or declaration.
   *
   * $scope is the glue between the view and controller within an AngularJS application. With the
   * introduction of the controller-as syntax, the need to explicitly use $scope has been greatly reduced.
   *
   * However we still need it for Eventing :)
   * $broadcast: Sends events from a parent scope downward to its children.
   * $emit: Sends events from a child upward to its parent.
   * $on: Listens for an event and responds.
   *
   * We'll use the controller-as syntax by declaring the controller to be 'MainController as main', which
   * means that we’ll reference the MainController as main within our Views (e.g., layout.html).
   */

  angular.module('my-2d-diagram-editor.main')
    .controller('MainController', ['$log', '$translate', '$scope', 'mainService', 'fabricService', 'fabricCanvas', 'fabricWindow',
      function($log, $translate, $scope, mainService, fabricService, fabricCanvas, fabricWindow) {

        $log.info('MainController as main');

        /*
         * Per common convention, I like to store a reference to the top-level this object (this has a habit
         * of changing context based on function level scope). I also like to name the reference to this, the
         * same name that I declare the controller-as (e.g., MainController as main).
         * This makes it easier to read and connect the dots as you jump between the HTML and the JavaScript.
         */

        var main = this;

        main.shapes = mainService.getShapes();
        main.containers = mainService.getContainers();

        main.init = function () {

          $log.info('MainController - init()');

          var canvas = fabricCanvas.getCanvas();

          var rectDefaults = angular.copy(fabricService.getRectDefaults());

          // $log.info('rectDefaults: ' + JSON.stringify(['e', rectDefaults], null, '\t'));

          rectDefaults.left = 100;
          rectDefaults.top = 100;
          rectDefaults.width = 100;
          rectDefaults.height = 100;

          // $log.info('canvas: ' + JSON.stringify(['e', canvas], null, '\t'));

          var object = new fabricWindow.Rect(rectDefaults);

          canvas.add(object);

          rectDefaults.left = 200;
          rectDefaults.top = 200;

          var object = new fabricWindow.Rect(rectDefaults);

          canvas.add(object);

          canvas.setActiveObject(object);
          canvas.renderAll();

          /*

           object.id = self.createId();

           self.addObjectToCanvas(object);

           var points = [100, 200, 100, 200];
           var options = { stroke: '#ccc' };
           var object = new fabricWindow.Line(points, options);

           canvas.add(object);

           canvas.renderAll();

           */

        };

        $scope.$on('canvas:created', main.init);

        main.newShape = function(name, fill) {
          $log.info('MainController.newShape()');
        };

        main.newContainer = function(name, fill) {
          $log.info('MainController.newContainer()');
        };

        main.fileNew = function() {
          $log.info('MainController.fileNew()');
        };

        main.editDelete = function() {
          $log.info('MainController.editDelete()');
        };

        main.toggleGrid = function() {
          $log.info('MainController.toggleGrid()');
        };

        main.setPointerMode = function() {
          $log.info('MainController.setPointerMode()');
        };

        main.setConnectorMode = function() {
          $log.info('MainController.setConnectorMode()');
        };

        main.toggleSnapToGrid = function() {
          $log.info('MainController.toggleSnapToGrid()');
        };

        main.switchLanguage = function(key) {
          $log.info('MainController.switchLanguage() - ' + key.toLocaleString());
          $translate.use(key);
        };

        //
        // Private methods
        //

        var removeGrid = function() {
          $log.info('MainController.removeGrid()');
        };

        var drawGrid = function() {
          $log.info('MainController.drawGrid()');
        };



      }]);

})();

(function() {

  'use strict';

  angular.module('my-2d-diagram-editor.main')
    .directive('resize', resize);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  resize.$inject = ['$log', '$window'];

  function resize($log, $window) {
    return {

      restrict: 'A',
      scope: {
        options: '='
      },
      link: function link(scope, element) {

        $log.info('resize - link()');

        const HEADER_HEIGHT = 101;

        var w = angular.element($window);

        scope.getWindowDimensions = function () {

          $log.info('width: ' + $window.innerWidth + ' height: ' +  $window.innerHeight);

          return {
            'width': $window.innerWidth,
            'height': $window.innerHeight
          };
        };

        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {

          // scope.windowHeight = newValue.h;
          // scope.windowWidth = newValue.w;

          scope.style = function () {

            $log.info('height: ' + (newValue.height - HEADER_HEIGHT) + 'px');

            return {
              // 'width': (newValue.width - 100) + 'px',
              'height': (newValue.height - HEADER_HEIGHT) + 'px'
            };
          };

        }, true);


        w.bind('resize', function () {
          scope.$apply();
        });

      }
    };
  }

})();

// Note: "Best Practice: Directives should clean up after themselves. You can use element.on('$destroy', ...) or
// scope.$on('$destroy', ...) to run a clean-up function when the directive is removed" ...


/*


 var objectCenter = service.selectedObject.getCenterPoint();

 $log.info('mouse:up - service.selectedObject.__corner: ' + service.selectedObject.__corner);

 service.connectorLine.set({ x2: objectCenter.x, y2: objectCenter.y });


 // add a reference to the line to each object
 service.fromObject.addChild = {
 // this retains the existing arrays (if there were any)
 from: (service.fromObject.addChild && service.fromObject.addChild.from),
 to: (service.fromObject.addChild && service.fromObject.addChild.to)
 };

 // var pointer = service.canvas.getPointer(object.e);
 // var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];

 // $log.info('mouse:down - points: ' + points.toLocaleString());

 // canvas.item(canvas._objects.length-1).set('active',true);

 // canvas.setActiveObject(canvas._objects[canvas._objects.length-1]);

 var object = element.target;

 object.set('hasRotatingPoint', true);
 object.setControlsVisibility({
 tl: true,
 tr: true,
 br: true,
 bl: true
 });

 // service.selectedObject.lockUniScaling = true; you only get the corners


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
