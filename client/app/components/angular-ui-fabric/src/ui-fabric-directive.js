(function() {

  'use strict';

  angular.module('ui.fabric')
    .directive('fabric', function($log, fabricCanvas) {
      return {

        restrict: 'A',
        scope: {
          options: '='
        },
        link: function link(scope, element) {

          $log.info('fabric - link()');

          var options = scope.options;

          // var options = scope.options || angular.copy(fabricService.getCanvasDefaults());
          // $log.info('options: ' + JSON.stringify(['e', options], null, '\t'));

          fabricCanvas.setElement(element);
          fabricCanvas.createCanvas(options);

        },

        /*
        scope: {
          fabric: '='
        },
        */

        controller: function($scope, $element) {

          $log.info('fabric - controller()');

          // fabricCanvas.setElement($element);
          // fabricCanvas.createCanvas();

        }
      };
    });


})();

/*

 var options =  { selection: false, width: 600, height: 600 };

 $log.info('id: ' + $element.attr('id'));
 $element.attr('id', 'fabric-canvas-101' );
 $log.info('id: ' + $element.attr('id'));

 var canvas = new $window.fabric.Canvas('fabric-canvas-101', options);
 var rect = new $window.fabric.Rect();

 canvas.add(rect);




(function() {

  'use strict';

  angular.module('ui.fabric')
    .directive('fabric',
      function ($log) {

        return {
          restrict: 'A',
          scope: {
            options: '='
            // currentValue: '=ngModel'
          }
        }

        // };



      });

})();

*/

/*

.directive('gaugeJs', function(){
  return {
    restrict: 'A',
    scope: {
      options:'=',
      currentValue: '=ngModel'
    },
    compile: function(tElem, tAttrs) {

      if ( tElem[0].tagName !== 'CANVAS' ) {
        throw new Error('guage-js can only be set on a canvas element. ' + tElem[0].tagName + ' will not work.');
      }

      return function(scope, element, attrs){

        var gauge;

        function setGauge(options){
          gauge = new Gauge(element[0]).setOptions(scope.options);
          gauge.maxValue = scope.options.maxValue; // set max gauge value
          gauge.set(scope.currentValue);
        }

        scope.$watch('options', function(newV, oldV){
          setGauge(scope.options);
        },true);

        scope.$watch('currentValue', function(newV,oldV){
          if(scope.currentValue > scope.options.maxValue){
            gauge.set(scope.options.maxValue);
          } else {
            gauge.set(scope.currentValue);
          }
        });
      };
    }
  }

  */

/*

(function() {

  'use strict';

  angular.module('ui.fabric', [])
    .directive('fabricDirective', ['fabricService', function(fabricService) {

      return {
        restrict: 'EA',
        scope: {},
        template: '<canvas> </canvas>'

      };


    }]);
})();

*/
