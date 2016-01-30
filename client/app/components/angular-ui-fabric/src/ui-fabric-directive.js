(function() {

  'use strict';

  angular.module('ui.fabric')
    .directive('fabric', fabric);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  fabric.$inject = ['$log', 'fabricCanvas'];

  function fabric($log, fabricCanvas) {
    return {

      restrict: 'A',
      scope: {
        options: '='
      },
      link: function link(scope, element) {

        $log.debug('fabric - link()');

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

// Note: "Best Practice: Directives should clean up after themselves. You can use element.on('$destroy', ...) or
// scope.$on('$destroy', ...) to run a clean-up function when the directive is removed" ...
