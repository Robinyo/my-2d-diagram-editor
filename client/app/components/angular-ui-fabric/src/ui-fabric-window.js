(function() {

  angular.module('ui.fabric')
    .factory('fabricWindow', fabricWindow);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  fabricWindow.$inject = ['$window'];

  function fabricWindow($window) {
    return $window.fabric;
  }

})();
