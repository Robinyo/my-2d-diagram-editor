(function() {

  'use strict';

  angular.module('ui.fabric')
    .service('fabricShape', fabricShape);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  fabricShape.$inject = ['$log', 'fabricService', 'fabricWindow'];

  function fabricShape($log, fabricService, fabricWindow) {

    var service = this;

    service.gridLineDefaults = null;
    service.rectDefaults = null;

    $log.info('fabricShape');

    service.init = function () {

      $log.info('fabricShape - init()');

      service.gridLineDefaults = fabricService.getGridLineDefaults();
      service.rectDefaults = fabricService.getRectDefaults();
    };

    //
    // Shapes
    //

    service.gridLine = function(points, options) {

      $log.info('fabricShape - gridLine()');

      options = options || service.gridLineDefaults;

      return new fabricWindow.Line(points, options);

      // var object = new FabricWindow.Line(points, options);
      // return object;
    };

    /**
     * @name rect
     * @desc Creates a new Rect object
     * @param {Object} [options] A configuration object, defaults to rectDefaults
     * @return {Object} Returns the new Rect object
     */
    service.rect = function(options) {

      $log.info('fabricShape - addRect()');

      options = options || service.rectDefaults;

      return new fabricWindow.Rect(options);

      // var object = new fabricWindow.Rect(options);
      // return object;
    };

    service.init();

    return service;

  }

})();

// $log.info('service.canvas: ' + JSON.stringify(['e', service.canvas], null, '\t'));

// service.rectDefaults = angular.copy(fabricService.getRectDefaults());

     /**
     * @name addRect
     * @desc Adds a Rect to the canvas
     * @param {Object} [options] A configuration object, defaults to FabricConstants.rectDefaults
     */

// $log.info('options: ' + JSON.stringify(['e', options], null, '\t'));

/*

 if (typeof service.canvas === 'undefined') {
 $log.info('typeof service.canvas === undefined');
 service.canvas = fabricCanvas.getCanvas();
 }

 */

/*
 * Listen for 'canvas:created' event $broadcast by fabricCanvas
 */

/*

 $scope.$on('canvas:created', service.init);

 service.init = function () {

 $log.info('fabricShape - init()');

 service.canvas = fabricCanvas.getCanvas();

 $log.info('service.canvas: ' + JSON.stringify(['e', service.canvas], null, '\t'));

 // service.rectDefaults = FabricConstants.rectDefaults,
 service.rectDefaults = angular.copy(fabricService.getRectDefaults());

 };

 service.addRect = function(options) {

 $log.info('addRect()');

 options = options || service.rectDefaults;

 var object = new fabricWindow.Rect(options);

 // object.id = self.createId();
 // self.addObjectToCanvas(object);

 service.canvas.add(object);
 // canvas.setActiveObject(object);
 service.canvas.renderAll();

 return object;
 };

 */
