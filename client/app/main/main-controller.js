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
    .controller('MainController', ['$log', '$scope',
      function(
        $log,     // inject the $log service
        $scope    // inject the $scope service
      ) {

        $log.info('MainController');

        var canvas = new fabric.Canvas('canvas');

        var grid = 50;

        // create grid

        for (var i = 0; i < (600 / grid); i++) {
          canvas.add(new fabric.Line([ i * grid, 0, i * grid, 600], { stroke: '#ccc', selectable: false }));
          canvas.add(new fabric.Line([ 0, i * grid, 600, i * grid], { stroke: '#ccc', selectable: false }))
        }

        /*

        canvas.on('object:moving', function(options) {
          options.target.set({
            left: Math.round(options.target.left / grid) * grid,
            top: Math.round(options.target.top / grid) * grid
          });

        */

        $scope.fileNew = function() {

          $log.info('MainController.fileNew()');

          var rect = new fabric.Rect({
            top : 50,
            left : 50,
            width : 300,
            height : 300,
            fill : 'yellow'
          });

          var text = new fabric.Text('Controlled Zone', {
            left: 100,
            top: 100,
            fontFamily: 'Tahoma',
            fontSize: 20,
            fontWeight: 'bold'
          });

          canvas.add(rect);
          canvas.add(text);
        };

      }]);
})();

/*

 angular.module('my-2d-diagram-editor', []).
 controller('MainController',function ($log) {

 log.info('MainController');

 });

 */

