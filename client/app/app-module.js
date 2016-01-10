(function() {

  'use strict';

  angular.module('my-2d-diagram-editor', [
    'ngAnimate',
    'ui.bootstrap',
    'ui.router',
    'common.fabric',
    'common.fabric.utilities',
    'common.fabric.constants',
    'pascalprecht.translate'
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

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'app/main/main.html',
          controller: 'MainController'
        });

      $urlRouterProvider.otherwise('/');

    });

})();
