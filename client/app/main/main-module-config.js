(function() {

  'use strict';

  angular.module('app.main')
    .config(configModule);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  configModule.$inject = ['$provide', '$logProvider'];

  function configModule($provide, $logProvider) {

  }

})();

