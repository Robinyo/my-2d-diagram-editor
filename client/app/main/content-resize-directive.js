(function() {

  'use strict';

  angular.module('my-2d-diagram-editor.main')
    .directive('resize', resize);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  resize.$inject = ['$log', '$window'];

  function resize($log, $window) {
    return function(scope, element) {

      $log.info('resize - link()');

      const HEADER_HEIGHT = 101;

      var window = angular.element($window);

      scope.getWindowDimensions = function () {
        return {
          'width': $window.innerWidth,
          'height': $window.innerHeight
        };
      };

      scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {

        scope.style = function () {

          var sidebarWidth = document.getElementById('sidebar-container').clientWidth;

          // $log.info('sidebarWidth: ' + (sidebarWidth) + 'px');
          // $log.info('width: ' + (newValue.width) + 'px');
          // $log.info('height: ' + (newValue.height - HEADER_HEIGHT) + 'px');

          return {
            'width': (newValue.width - sidebarWidth - 10) + 'px',
            'height': (newValue.height - HEADER_HEIGHT) + 'px'
          };
        };

      }, true);


      window.bind('resize', function () {
        scope.$apply();
      });

    }
  }

})();

// Note: "Best Practice: Directives should clean up after themselves. You can use element.on('$destroy', ...) or
// scope.$on('$destroy', ...) to run a clean-up function when the directive is removed" ...

// $log.info('width: ' + $window.innerWidth + ' height: ' + $window.innerHeight);
