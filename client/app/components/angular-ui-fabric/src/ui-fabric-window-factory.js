(function() {

  angular.module('ui.fabric')
    .factory('fabricWindow', fabricWindow);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  fabricWindow.$inject = ['$window'];

  // fabric.js must be included in your application's host file 'index.html'
  // For example: <script src="bower_components/fabric.js/dist/fabric.js"></script>
  // We need to wrap it in a service so that we don't reference global objects inside AngularJS components.

  function fabricWindow($window) {
    return $window.fabric;
  }

})();
