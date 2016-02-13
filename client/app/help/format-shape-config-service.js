(function() {

  'use strict';

  /*
   * Use camelCase when naming services and factories.
   */

  angular.module('app.main')
    .service('formatShapeConfig', formatShapeConfig);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  // formatShapeConfig.$inject = [''];

  function formatShapeConfig() {

    var service = this;

    const HELVETICA_ID = 0;
    const TAHOMA_ID = 1;
    const VERDANA_ID    = 2;

    var fontFamilies = [
      {
        "id"              : HELVETICA_ID,
        "name"            : "HELVETICA",
        "value"           : "Helvetica"
      },
      {
        "id"              : TAHOMA_ID,
        "name"            : "TAHOMA",
        "value"           : "Tahoma"
      },
      {
        "id"              : VERDANA_ID,
        "name"            : "VERDANA",
        "value"           : "Verdana"
      }
    ];

    service.getFontFamilies = function() {
      return fontFamilies;
    };

    service.getFontFamily = function(id) {
      return fontFamilies[id];
    };

  }

})();

