(function() {

  'use strict';

  angular.module('my-2d-diagram-editor.main')
    .service('mainService', mainService);

  function mainService() {

    var service = this;

    const CONTROLLED_ZONE_ID = 0;
    const RESTRICTED_ZONE_ID = 1;
    const SECURED_ZONE_ID    = 2;
    const PARTNER_ZONE_ID    = 3;
    const MANAGEMENT_ZONE_ID = 4;

    const SQUARE_ID = 0;
    const RECTANGLE_ID = 1;

    var shapes = [
      {
        "id"              : SQUARE_ID,
        "name"            : "SQUARE",
        "value"           : "Square",
        "src"             : "content/images/icons/32x32/light-gray.png",
        "backgroundColor" : "LIGHTGRAY"
      }

      /* ,
       {
       "id"              : RECTANGLE_ID,
       "name"            : "RECTANGLE",
       "value"           : "Rectangle",
       "src"             : "content/images/icons/32x32/light-gray.png",
       "backgroundColor" : "LIGHTGRAY"
       }
       */

    ];

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

    service.getShapes = function() {
      return shapes;
    };

    service.getShape = function(id) {
      return shapes[id];
    };

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
