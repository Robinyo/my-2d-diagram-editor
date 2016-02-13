(function() {

  'use strict';

  /*
   * Use camelCase when naming services and factories.
   */

  angular.module('app.main')
    .service('shapeConfig', shapeConfig);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  // shapesConfig.$inject = [''];

  function shapeConfig() {

    var service = this;

    const NODE_ID      = 0;
    const SQUARE_ID    = 1;
    const RECTANGLE_ID = 2;

    var shapes = [

      {
        "id"              : NODE_ID,
        "name"            : "NODE",
        "value"           : "Node",
        "src"             : "content/images/icons/32x32/light-gray.png",
        "backgroundColor" : "GRAY"
      }

      /* ,
      {
        "id"              : SQUARE_ID,
        "name"            : "SQUARE",
        "value"           : "Square",
        "src"             : "content/images/icons/32x32/light-gray.png",
        "backgroundColor" : "GRAY"
      }
      */

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

    const HELVETICA_ID = 0;
    const TAHOMA_ID    = 1;
    const VERDANA_ID   = 2;

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

    const EIGHT_ID    = 0;
    const TEN_ID      = 1;
    const TWELVE_ID   = 2;
    const FOURTEEN_ID = 3;
    const SIXTEEN_ID  = 4;
    const EIGHTEEN_ID = 5;
    const TWENTY_ID   = 6;

    var fontSizes = [
      {
        "id"              : EIGHT_ID,
        "name"            : "EIGHT",
        "value"           : "8"
      },
      {
        "id"              : TEN_ID,
        "name"            : "TEN",
        "value"           : "10"
      },
      {
        "id"              : TWELVE_ID,
        "name"            : "TWELVE",
        "value"           : "12"
      },
      {
        "id"              : FOURTEEN_ID,
        "name"            : "FOURTEEN",
        "value"           : "14"
      },
      {
        "id"              : SIXTEEN_ID,
        "name"            : "SIXTEEN",
        "value"           : "16"
      },
      {
        "id"              : EIGHTEEN_ID,
        "name"            : "EIGHTEEN",
        "value"           : "18"
      },
      {
        "id"              : TWENTY_ID,
        "name"            : "TWENTY",
        "value"           : "20"
      }

    ];

    service.getFontSizes = function() {
      return fontSizes;
    };

    service.getFontSize = function(id) {
      return fontSizes[id];
    };

  }

})();

/*

 // http://www.awwwards.com/trendy-web-color-palettes-and-material-design-color-schemes-tools.html
 // http://htmlcolorcodes.com/color-names/
 "src" : "http://placehold.it/32x32/FFFF00",  // YELLOW

 */
