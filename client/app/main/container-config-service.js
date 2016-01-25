(function() {

  'use strict';

  /*
   * Use camelCase when naming services and factories.
   */

  angular.module('my-2d-diagram-editor.main')
    .service('containerConfig', containerConfig);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  // containerConfig.$inject = [''];

  function containerConfig() {

    var service = this;

    const CONTROLLED_ZONE_ID = 0;
    const RESTRICTED_ZONE_ID = 1;
    const SECURED_ZONE_ID    = 2;
    const PARTNER_ZONE_ID    = 3;
    const MANAGEMENT_ZONE_ID = 4;

    var containers = [
      {
        "id"              : CONTROLLED_ZONE_ID,
        "name"            : "CONTROLLED_ZONE",
        "value"           : "Controlled Zone",
        // "src"             : "content/images/icons/32x32/yellow.png",
        "src"             : "http://placehold.it/32x32/E3F09B",
        "backgroundColor" : "#E3F09B"  // YELLOW
      },
      {
        "id"              : RESTRICTED_ZONE_ID,
        "name"            : "RESTRICTED_ZONE",
        "value"           : "Restricted Zone",
        // "src"             : "content/images/icons/32x32/light-sea-green.png",
        "src"             : "http://placehold.it/32x32/F7D08A",
        "backgroundColor" : "#F7D08A"  // LIGHTGREEN
      },
      {
        "id"              : SECURED_ZONE_ID,
        "name"            : "SECURED_ZONE",
        "value"           : "Secured Zone",
        // "src"             : "content/images/icons/32x32/dark-sea-green.png",
        "src"             : "http://placehold.it/32x32/87B6A7",
        "backgroundColor" : "#87B6A7"  // GREEN
      },
      {
        "id"              : PARTNER_ZONE_ID,
        "name"            : "PARTNER_ZONE",
        "value"           : "Partner Zone",
        // "src"             : "content/images/icons/32x32/light-salmon.png",
        "src"             : "http://placehold.it/32x32/F79F79",
        "backgroundColor" : "#F79F79"  // LIGHTSALMON
      },
      {
        "id"              : MANAGEMENT_ZONE_ID,
        "name"            : "MANAGEMENT_ZONE",
        "value"           : "Management Zone",
        // "src"             : "content/images/icons/32x32/dodger-blue.png",
        "src"             : "http://placehold.it/32x32/5B5941",
        "backgroundColor" : "#5B5941"  // DODGERBLUE
      }
    ];

    service.getContainers = function() {
      return containers;
    };

    service.getContainer = function(id) {
      return containers[id];
    };

  }

})();

/*

 // http://www.awwwards.com/trendy-web-color-palettes-and-material-design-color-schemes-tools.html
 // http://htmlcolorcodes.com/color-names/
 "src" : "http://placehold.it/32x32/FFFF00",  // YELLOW

 */
