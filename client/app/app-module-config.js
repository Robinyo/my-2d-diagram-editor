(function() {

  'use strict';

  angular.module('app')
    .config(configModule);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  configModule.$inject = ['$provide', '$logProvider', '$tooltipProvider', '$translateProvider', '$stateProvider', '$urlRouterProvider'];

  function configModule($provide, $logProvider, $tooltipProvider, $translateProvider, $stateProvider, $urlRouterProvider) {

    // configExceptionHandler($provide);
    configLogging($provide, $logProvider);
    configBootstrapUI($tooltipProvider);
    configTranslations($translateProvider);
    configRoutes($stateProvider, $urlRouterProvider);
  }

  /*

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

  */

  function configLogging($provide, $logProvider) {

    var environment = 'development';
    // var environment = 'production';

    if (environment === 'production') {

      // Disable log, info, warn and debug messages

      $provide.decorator('$log', ['$delegate', function ($delegate) {
        $delegate.log = angular.noop;
        return $delegate;
      }]);

      $provide.decorator('$log', ['$delegate', function ($delegate) {
        $delegate.info = angular.noop;
        return $delegate;
      }]);

      $provide.decorator('$log', ['$delegate', function ($delegate) {
        $delegate.warn = angular.noop;
        return $delegate;
      }]);

      $logProvider.debugEnabled(false);

    } else {

      // $logProvider.debugEnabled(false);

      console.log('my-2d-diagram-editor - environment = ' + environment);
      console.log('my-2d-diagram-editor - log, info, warn, debug and error messages are enabled');

    }
  }

  function configBootstrapUI($tooltipProvider) {
    $tooltipProvider.options({ placement: 'bottom' });
  }

  function configTranslations($translateProvider) {

    $translateProvider
      .useStaticFilesLoader({
        prefix: 'app/locales/',
        suffix: '.json'
      })
      .registerAvailableLanguageKeys(['en', 'pl', 'de'], {
        'en' : 'en', 'en_GB': 'en', 'en_US': 'en',
        'pl' : 'pl', 'pl_PL': 'pl',
        'de' : 'de', 'de_DE': 'de', 'de_CH': 'de'
      })
      .preferredLanguage('en')
      .fallbackLanguage('en')
      .determinePreferredLanguage()
      .useSanitizeValueStrategy('escapeParameters');
  }

  function configRoutes($stateProvider, $urlRouterProvider) {

    /*
     * Routes allow you to define ways to navigate to specific states within your application.
     * They also allow you to define configuration options for each specific route, such as
     * which template and controller to use.
     */

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/layout.html',
        controller: 'MainController',
        controllerAs: 'main'
        /*
        resolve: {
          moviesPrepService: moviesPrepService
        }
        */
      });

    /*
     * Use $inject to manually identify your route resolver dependencies for Angular components.
     * This technique breaks out the anonymous function for the route resolver, making it easier to read.
     * $inject statement can easily precede the resolver to handle making any dependencies minification safe.
     */

    /*
    moviesPrepService.$inject = ['movieService'];
    function moviesPrepService(movieService) {
      return movieService.getMovies();
    }
    */

    $urlRouterProvider.otherwise('/');
  }

})();

// https://developers.google.com/web/tools/chrome-devtools/
// https://developer.chrome.com/devtools/docs/blackboxing

