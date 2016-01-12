(function() {

  'use strict';

  angular.module('ui.fabric')
    .directive('fabric', function($log, fabricCanvas) {
      return {
        scope: {
          fabric: '='
        },

        /*
        restrict: 'A',
        scope: {
          options: '='
        },
        link: function postLink(scope, element) {
          $log.info('postLink()');

          var options = scope.options;

          // $log.info('options: ' + JSON.stringify(['e', options], null, '\t'));

          $log.info('id: ' + element.attr('id'));
          // $log.info('element: ' + JSON.stringify(['e', element], null, '\t'));
          element.attr('id', 'fabric-canvas-101' );
          $log.info('id: ' + element.attr('id'));


        },

        */
        controller: function($scope, $element) {

          $log.info('controller()');

          fabricCanvas.setElement($element);
          fabricCanvas.createCanvas();

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
