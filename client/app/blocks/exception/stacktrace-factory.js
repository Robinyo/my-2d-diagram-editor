(function() {

  angular.module('blocks.exception')
    .factory('stackTrace', stackTrace);

  stackTrace.$inject = ['$window'];

  function stackTrace($window) {
    return $window.StackTrace;
  }

})();

