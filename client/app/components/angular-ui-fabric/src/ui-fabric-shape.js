(function() {

  'use strict';

  angular.module('ui.fabric')
    .service('fabricShape', fabricShape);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  fabricShape.$inject = ['$log', 'fabricCanvas', 'fabricService', 'fabricWindow'];

  function fabricShape($log, fabricCanvas, fabricService, fabricWindow) {

    var service = this;
    service.canvas = null;
    service.rectDefaults = null;

    $log.info('fabricShape');

    service.init = function () {

      $log.info('fabricShape - init()');

      service.canvas = fabricCanvas.getCanvas();

      $log.info('service.canvas: ' + JSON.stringify(['e', service.canvas], null, '\t'));

      // service.rectDefaults = FabricConstants.rectDefaults,
      service.rectDefaults = angular.copy(fabricService.getRectDefaults());

    };

    /**
     * @name addRect
     * @desc Adds a Rect to the canvas
     * @param {Object} [options] A configuration object, defaults to FabricConstants.rectDefaults
     */

    service.addRect = function(options) {

      $log.info('addRect()');

      options = options || service.rectDefaults;

      var object = new fabricWindow.Rect(options);

      // object.id = self.createId();
      // self.addObjectToCanvas(object);

      if (typeof service.canvas === 'undefined') {
        $log.info('typeof service.canvas === undefined');
        service.canvas = fabricCanvas.getCanvas();
      }

      service.canvas.add(object);
      // canvas.setActiveObject(object);
      service.canvas.renderAll();

      return object;
    };

    service.init();

    return service;
  }

})();

// $log.info('options: ' + JSON.stringify(['e', options], null, '\t'));
