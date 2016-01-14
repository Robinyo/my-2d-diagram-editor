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

  fabric.$inject = ['$log', 'fabricCanvas', 'fabricService', 'fabricWindow'];

  function fabric($log, fabricCanvas, fabricService, fabricWindow) {

    var service = this;

    service.canvas = null;
    service.rectDefaults = null;

    $log.info('fabric');

    service.init = function () {

      $log.info('fabric - init()');

      service.rectDefaults = angular.copy(fabricService.getRectDefaults());
      // $log.info('service.canvas: ' + JSON.stringify(['e', service.canvas], null, '\t'));

    };

    service.getCanvas = function () {

      $log.info('fabric - getCanvas()');

      service.canvas = fabricCanvas.getCanvas();
      return service.canvas;
    };

    service.addRect = function(options) {

      $log.info('fabric - addRect()');

      options = options || service.rectDefaults;

      var object = new fabricWindow.Rect(options);

      // object.id = self.createId();
      // self.addObjectToCanvas(object);

      if (service.canvas === null) {
        $log.error('You must call getCanvas() before you try to add shapes to a canvas.');
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


