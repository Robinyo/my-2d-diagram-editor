(function() {

  'use strict';

  /*
   * Declare a new module called 'my-2d-diagram-editor', and list its dependencies.
   * Modules serve as containers to help you organise code within your AngularJS application.
   * Modules can contain sub-modules, making it easy to compose functionality as needed.
   */

  angular.module('my-2d-diagram-editor', [
    'ngAnimate',
    'ui.bootstrap',
    'ui.router',
    'pascalprecht.translate',

    'ui.fabric',

    'my-2d-diagram-editor.main'
  ])
    .config(function($stateProvider, $urlRouterProvider, $translateProvider) {

      $translateProvider
        .useStaticFilesLoader({
          prefix: 'app/locales/',
          suffix: '.json'
        })
        .registerAvailableLanguageKeys(['en', 'de'], {
          'en' : 'en', 'en_GB': 'en', 'en_US': 'en',
          'pl' : 'pl', 'pl_PL': 'pl',
          'de' : 'de', 'de_DE': 'de', 'de_CH': 'de'
        })
        .preferredLanguage('de')
        .fallbackLanguage('de')
        .determinePreferredLanguage()
        .useSanitizeValueStrategy('escapeParameters');

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
        });

      $urlRouterProvider.otherwise('/');

    });

})();

