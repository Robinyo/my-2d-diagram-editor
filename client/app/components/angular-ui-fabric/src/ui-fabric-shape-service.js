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
    service.controlDefaults = null;
    service.rectDefaults = null;

    $log.info('fabricShape');

    service.init = function () {

      $log.info('fabricShape - init()');

      service.gridLineDefaults = fabricService.getGridLineDefaults();
      service.controlDefaults = fabricService.getLineDefaults();
      service.rectDefaults = fabricService.getRectDefaults();
    };

    //
    // Shapes
    //

    /**
     * @name gridLine
     * @desc Creates a new Line object
     * @param {Array} [points] An array of points (where each point is an object with x and y)
     * @param {Object} [options] A configuration object, defaults to gridLineDefaults
     * @return {Object} Returns the new Line object
     */
    service.gridLine = function(points, options) {

      // $log.info('fabricShape - gridLine()');

      options = options || service.gridLineDefaults;

      // $log.info('points: ' + JSON.stringify(['e', points], null, '\t'));

      return new fabricWindow.Line(points, options);

      // var object = new FabricWindow.Line(points, options);
      // return object;
    };

    /**
     * @name line
     * @desc Creates a new Line object
     * @param {Array} [points] An array of points (where each point is an object with x and y)
     * @param {Object} [options] A configuration object, defaults to lineDefaults
     * @return {Object} Returns the new Line object
     */
    service.line = function(points, options) {

      $log.info('fabricShape - line()');

      options = options || service.controlDefaults;

      // $log.info('points: ' + JSON.stringify(['e', points], null, '\t'));

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
