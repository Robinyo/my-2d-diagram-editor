(function() {

  'use strict';

  /*
   * Use camelCase when naming services and factories.
   */

  angular.module('blocks.endpoint')
    // .constant('CURRENT_BACKEND', 'node')
    // .constant('CURRENT_BACKEND', 'firebase')
    .service('EndpointConfigService', EndpointConfigService);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  EndpointConfigService.$inject = ['$log'];

  function EndpointConfigService($log) {

    var service = this;
    var CURRENT_BACKEND = 'node';

    // $log.debug('EndpointConfigService - endpoint: ' + CURRENT_BACKEND);

    var endpointMap = {
        node: { URI: 'http://localhost:3000/', root: 'app/data/', format: '.json'},
        firebase: { URI: 'https://my-2d-diagram-editor.firebaseio.com/', root: 'app/data/', format: '.json' }
      };

    var currentEndpoint = endpointMap[CURRENT_BACKEND];
    var backend = CURRENT_BACKEND;

    service.getUrl = function(model) {
      // $log.debug('URI: ' + currentEndpoint.URI + currentEndpoint.root + model + currentEndpoint.format);
      return currentEndpoint.URI + currentEndpoint.root + model + currentEndpoint.format;
    };


  }

})();

/*



 */
