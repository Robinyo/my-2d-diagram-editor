(function() {

  'use strict';

  angular.module('ui.fabric')
    .directive('editor',
      function () {

        return {
          // restrict: 'EA',
          scope: true,
          replace: true,
          template: '<div class="content">editor :) </div>'

        };


        // service.getShapes = function() {
        //   return shapes;
        // };

      });

})();

/*

(function() {

  'use strict';

  angular.module('ui.fabric', [])
    .directive('fabricDirective', ['fabricService', function(fabricService) {

      return {
        restrict: 'EA',
        scope: {},
        template: '<canvas> </canvas>'

      };


    }]);
})();

*/
