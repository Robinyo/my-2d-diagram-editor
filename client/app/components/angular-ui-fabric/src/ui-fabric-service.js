(function() {

  'use strict';

  angular.module('ui.fabric')
    .service('fabricService',
      function () {

        var service = this;

        // const CONTROLLED_ZONE_ID = 0;

        var objectDefaults = {
          rotatingPointOffset: 40,
          padding: 0,
          borderColor: 'rgba(102,153,255,0.75)',
          cornerColor: 'rgba(102,153,255,0.5)',
          cornerSize: 10,
          transparentCorners: true,
          hasRotatingPoint: true,
          centerTransform: true
        };

        var rectDefaults = angular.extend({
          left: 0,
          top: 0,
          width: 300,
          height: 300,
          fill: '#FFFF00',
          opacity: 0.7
        }, objectDefaults);

        service.getRectDefaults = function() {
          return rectDefaults;
        };

      });

})();

