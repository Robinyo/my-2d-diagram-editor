(function() {

  angular.module('ui.fabric')
    .factory('fabricWindow',
      function ($window) {

        return $window.fabric;

      });

})();
