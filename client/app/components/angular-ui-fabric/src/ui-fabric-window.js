(function() {

  angular.module('ui.fabric')
    .factory('fabricWindow', fabricWindow);

  function fabricWindow($window) {
    return $window.fabric;
  }

})();
