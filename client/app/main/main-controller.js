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
