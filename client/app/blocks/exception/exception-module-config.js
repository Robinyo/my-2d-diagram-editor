(function() {

  'use strict';

  angular.module('blocks.exception')
    .config(configExceptionHandler);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  configExceptionHandler.$inject = ['$provide'];

  function configExceptionHandler($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
  }

  extendExceptionHandler.$inject = ['$delegate', 'stackTrace'];

  function extendExceptionHandler($delegate, stackTrace) {

    return function(exception, cause) {

      // Pass off the error to the default error handler on the AngularJS logger.
      // This will output the error to the console (and let the application
      // keep running normally for the user).

      $delegate(exception, cause);

      // Bespoke Exception Handling ...

      // var errorMessage = exception.toString();

      var callback = function(stackframes) {
        var stringifiedStack = stackframes.map(function(sf) {
          return sf.toString();
        }).join('\n');
        console.log(stringifiedStack);
      };

      var errback = function(err) { console.log(err.message); };

      stackTrace.fromError(exception).then(callback).catch(errback);
    };

  }

})();

// https://developers.google.com/web/tools/chrome-devtools/
// https://developer.chrome.com/devtools/docs/blackboxing

