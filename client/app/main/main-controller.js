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
    .controller('MainController', ['$log', '$scope', 'Fabric', 'FabricConstants', 'Keypress',
      function($log, $scope, Fabric, FabricConstants, Keypress) {

        $log.info('MainController');

        $scope.fabric = {};
        $scope.FabricConstants = FabricConstants;

        $scope.init = function () {
          $scope.fabric = new Fabric({
            JSONExportProperties: FabricConstants.JSONExportProperties,
            textDefaults: FabricConstants.textDefaults,
            shapeDefaults: FabricConstants.shapeDefaults,
            json: {}
          });
        };

        $scope.$on('canvas:created', $scope.init);

        var containerTextDefaults = $scope.FabricConstants;
        containerTextDefaults.left = 50;
        containerTextDefaults.top = 50;
        containerTextDefaults.fontFamily = 'Tahoma';
        containerTextDefaults.fontSize = 20;
        containerTextDefaults.fontWeight = 'bold';

        $scope.newContainer = function(label) {

          label = label || 'New Container';

          $log.info('MainController.newContainer()');

          $scope.fabric.addText(label, containerTextDefaults);
        };

        $scope.fileNew = function() {

          $log.info('MainController.fileNew()');

          $scope.fabric.addRect();

          /*

          var containerTextDefaults = FabricConstants.textDefaults;
          containerTextDefaults.left = 50;
          containerTextDefaults.top = 50;
          containerTextDefaults.fontFamily = 'Tahoma';
          containerTextDefaults.fontSize = 20;
          containerTextDefaults.fontWeight = 'bold';

          $scope.fabric.addText('Controlled Zone', containerTextDefaults);

          */
        };

      }]);
})();

/*

 $scope.fabric.addText('Controlled Zone');
 $scope.fabric.setFontFamily('Tahoma');
 $scope.fabric.setFontSize(20);
 $scope.fabric.toggleBold();

 */



