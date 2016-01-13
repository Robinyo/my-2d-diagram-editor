(function() {

  'use strict';

  angular.module('ui.fabric')
    .directive('fabric', fabric);

  fabric.$inject = ['$log', 'fabricCanvas'];

  function fabric($log, fabricCanvas) {
    return {

      restrict: 'A',
      scope: {
        options: '='
      },
      link: function link(scope, element) {

        $log.info('fabric - link()');

        var options = scope.options;

        // var options = scope.options || angular.copy(fabricService.getCanvasDefaults());
        // $log.info('options: ' + JSON.stringify(['e', options], null, '\t'));

        fabricCanvas.setElement(element);
        fabricCanvas.createCanvas(options);

      }

      /*

       controller: function($scope, $element) {
       $log.info('fabric - controller()');
       }

       */
    };
  }

})();
