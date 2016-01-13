(function() {

  'use strict';

  /*
   * Use camelCase when naming services and factories.
   */

  angular.module('my-2d-diagram-editor.main')
    .service('shapesService', shapesService);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  // shapesService.$inject = [''];

  function shapesService() {

    var service = this;

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

    service.getShapes = function() {
      return shapes;
    };

    service.getShape = function(id) {
      return shapes[id];
    };

  }

})();

/*

 // http://www.awwwards.com/trendy-web-color-palettes-and-material-design-color-schemes-tools.html
 // http://htmlcolorcodes.com/color-names/
 "src" : "http://placehold.it/32x32/FFFF00",  // YELLOW

 */
