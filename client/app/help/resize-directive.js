(function() {

  'use strict';

  angular.module('my-2d-diagram-editor')
    .directive('resize', resize);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  resize.$inject = ['$log', '$window'];

  function resize($log, $window) {

    return function (scope, element) {

      $log.info('fabric - link()');

      var w = angular.element($window);
      $log.info('w: ' + w);
      scope.getWindowDimensions = function () {
        return { 'h': w.height, 'w': w.width };
      };
      scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
        scope.windowHeight = newValue.h;
        scope.windowWidth = newValue.w;

        scope.style = function () {
          return {
            'height': (newValue.h - 101) + 'px',
            'width': (newValue.w - 400) + 'px'
          };
        };

      }, true);

      w.bind('resize', function () {
        scope.$apply();
      });
    }

  }

})();

// Note: "Best Practice: Directives should clean up after themselves. You can use element.on('$destroy', ...) or
// scope.$on('$destroy', ...) to run a clean-up function when the directive is removed" ..
