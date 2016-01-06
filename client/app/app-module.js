(function() {

  'use strict';

  angular.module('my-2d-diagram-editor', [
    'ngAnimate',
    'ui.bootstrap',
    'ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'app/main/main.html',
          controller: 'MainController'
        });

      $urlRouterProvider.otherwise('/');

    });

})();

/*

 angular.module('my-2d-diagram-editor', [
 'ngAnimate',
 'ui.bootstrap',
 'ui.router'
 ]);

 */
