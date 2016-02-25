(function() {

  'use strict';

  /*
   * Use camelCase when naming services and factories.
   */

  angular.module('app.main')
    .service('paperSizesModel', paperSizesModel);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  paperSizesModel.$inject = ['$log', '$http', 'EndpointConfigService'];

  function paperSizesModel($log, $http, EndpointConfigService) {

    var service = this;
    var MODEL = 'paper-sizes';

    service.find = function () {
      return $http.get(EndpointConfigService.getUrl(MODEL))
        .then(function(response) {
          $log.debug('Loaded model: ' + MODEL);
          return response;
        }, function(response) {
          $log.error('Could not load model: ' + MODEL);
        });
    };
  }

})();
