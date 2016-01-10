(function() {

'use strict';

  angular.module('my-2d-diagram-editor')
    .factory('sidebarFactory', [
      function() {

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
          },
          {
            "id"              : RECTANGLE_ID,
            "name"            : "RECTANGLE",
            "value"           : "Rectangle",
            "src"             : "content/images/icons/32x32/light-gray.png",
            "backgroundColor" : "LIGHTGRAY"
          }
        ];

        var containers = [
          {
            "id"              : CONTROLLED_ZONE_ID,
            "name"            : "CONTROLLED_ZONE",
            "value"           : "Controlled Zone",
            "src"             : "content/images/icons/32x32/yellow.png",
            "backgroundColor" : "YELLOW"
          },
          {
            "id"              : RESTRICTED_ZONE_ID,
            "name"            : "RESTRICTED_ZONE",
            "value"           : "Restricted Zone",
            "src"             : "content/images/icons/32x32/light-sea-green.png",
            "backgroundColor" : "LIGHTSEAGREEN"
          },
          {
            "id"              : SECURED_ZONE_ID,
            "name"            : "SECURED_ZONE",
            "value"           : "Secured Zone",
            "src"             : "content/images/icons/32x32/dark-sea-green.png",
            "backgroundColor" : "DARKSEAGREEN"
          },
          {
            "id"              : PARTNER_ZONE_ID,
            "name"            : "PARTNER_ZONE",
            "value"           : "Partner Zone",
            "src"             : "content/images/icons/32x32/light-salmon.png",
            "backgroundColor" : "LIGHTSALMON"
          },
          {
            "id"              : MANAGEMENT_ZONE_ID,
            "name"            : "MANAGEMENT_ZONE",
            "value"           : "Management Zone",
            "src"             : "content/images/icons/32x32/dodger-blue.png",
            "backgroundColor" : "DODGERBLUE"
          }
        ];

        return {
          getShapes: function() {
            return shapes;
          },
          getShape: function(id) {
            return shapes[id];
          },
          getContainers: function() {
            return containers;
          },
          getContainer: function(id) {
            return containers[id];
          }
        }
      }]);
})();


/*

 // http://htmlcolorcodes.com/color-names/
 "src" : "http://placehold.it/32x32/FFFF00",  // YELLOW

*/
