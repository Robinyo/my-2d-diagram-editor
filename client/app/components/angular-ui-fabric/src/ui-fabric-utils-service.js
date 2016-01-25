(function() {

  'use strict';

  angular.module('ui.fabric')
    .service('fabricUtils', fabricUtils);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  fabricUtils.$inject = ['$log'];

  function fabricUtils($log) {

    var service = this;

    $log.info('fabricUtils');

    service.init = function () {
      $log.info('fabricUtils - init()');
    };

    // See: _findTargetCorner()

    service.findTargetPort = function(object) {

      var points = new Array(4);
      var port = object.__corner;

      $log.info('findTargetPort - port: ' + object.__corner);

      switch (port) {

        case 'mt':
          points = [
            object.left + (object.width / 2), object.top,
            object.left + (object.width / 2), object.top
          ];
          break;
        case 'mr':
          points = [
            object.left + object.width, object.top + (object.height / 2),
            object.left + object.width, object.top + (object.height / 2)
          ];
          break;
        case 'mb':
          points = [
            object.left + (object.width / 2), object.top + object.height,
            object.left + (object.width / 2), object.top + object.height
          ];
          break;
        case 'ml':
          points = [
            object.left, object.top + (object.height / 2),
            object.left, object.top + (object.height / 2)
          ];
          break;

        default:
          $log.error('findTargetPort() - service.fromObject.__corner === undefined');
          break;
      }

      return points

    };

    service.getNextTargetPort = function(port) {

      // $log.info('getNextTargetPort - port: ' + port);

      var nextPort = 'mt';

      switch (port) {
        case 'mt':
          nextPort = 'mr';
          break;
        case 'mr':
          nextPort = 'mb';
          break;
        case 'mb':
          nextPort = 'ml';
          break;
        case 'ml':
          nextPort = 'mt';
          break;
        default:
          $log.error('getNextTargetPort() - port === undefined');
          break;
      }

      $log.info('getNextTargetPort - port: ' + port + ' nextPort: ' + nextPort);

      return nextPort;

    };

    service.getPortCenterPoint = function(object, port) {

      var x1 = 0;
      var y1 = 0;

      switch (port) {

        case 'mt':
          x1 = object.left + (object.width / 2);
          y1 = object.top;
          break;

        case 'mr':
          x1 = object.left + object.width;
          y1 = object.top + (object.height / 2);
          break;

        case 'mb':
          x1 = object.left + (object.width / 2);
          y1 = object.top + object.height;
          break;
        case 'ml':
          x1 = object.left;
          y1 = object.top + (object.height / 2);
          break;

        default:
          $log.error('getPortCenterPoint() - port === undefined');
          break;
      }

      return {
        x1: x1, y1: y1,
        x2: x1, y2: y1
      }
    };

    service.init();

    return service;

  }

})();

// $log.info('x1: ' + x1 + ' y1: ' + y1 + ' x2: ' + x2 + ' y2: ' + y2);
