(function() {

  'use strict';

  angular.module('app.main')
    .directive('resize', resize);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  resize.$inject = ['$log', '$window'];

  function resize($log, $window) {
    return function(scope, element) {

      $log.debug('resize - link()');

      const HEADER_HEIGHT = 101;

      var window = angular.element($window);

      scope.getWindowDimensions = function () {
        return {
          'width': $window.innerWidth,
          'height': $window.innerHeight
        };
      };

      scope.$watch(scope.getWindowDimensions, function (newValue) {

        scope.style = function () {

          var sidebarWidth = document.getElementById('sidebar-left-container').clientWidth;

          return {
            // 'width': (newValue.width - sidebarWidth) + 'px',
            'width': (newValue.width - (sidebarWidth * 2)) + 'px',
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

// $log.debug('width: ' + $window.innerWidth + ' height: ' + $window.innerHeight);

// $log.debug('sidebarWidth: ' + (sidebarWidth) + 'px');
// $log.debug('width: ' + (newValue.width) + 'px');
// $log.debug('height: ' + (newValue.height - HEADER_HEIGHT) + 'px');

// 'width': (newValue.width - sidebarWidth - 10) + 'px',
// 'width': (newValue.width - (sidebarWidth * 2) - 10) + 'px',
