(function() {

  'use strict';

  angular.module('my-2d-diagram-editor')
    .config(configApp);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  configApp.$inject = ['$tooltipProvider', '$translateProvider', '$stateProvider', '$urlRouterProvider'];

  function configApp($tooltipProvider, $translateProvider, $stateProvider, $urlRouterProvider) {

    configUI($tooltipProvider);
    configTranslations($translateProvider);
    configRoutes($stateProvider, $urlRouterProvider);
  }

  function configUI($tooltipProvider) {
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

