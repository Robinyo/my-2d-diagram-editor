(function() {

  angular.module('my-2d-diagram-editor')
    .factory('stackTrace', stackTrace);

  stackTrace.$inject = ['$window'];

  function stackTrace($window) {
    return $window.StackTrace;
  }

})();

/*

(function() {

  angular.module('my-2d-diagram-editor')
    .factory('stackTrace', stackTrace);

  stackTrace.$inject = ['$window'];

  function stackTrace($window) {
    return $window.printStackTrace;
  }

})();

 (function() {

 angular.module('my-2d-diagram-editor')
 .factory('stackTrace', stackTrace);

 function stackTrace() {
 return({
 print: printStackTrace
 });
 }

 })();


*/
