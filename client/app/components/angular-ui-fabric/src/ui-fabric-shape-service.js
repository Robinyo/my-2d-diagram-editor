(function() {

  'use strict';

  angular.module('ui.fabric')
    .service('fabricShape', fabricShape);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  fabricShape.$inject = ['$log', 'fabricConfig', 'fabricWindow'];

  function fabricShape($log, fabricConfig, fabricWindow) {

    var service = this;

    service.gridLineDefaults = null;
    service.controlDefaults = null;
    service.rectDefaults = null;
    service.triangleDefaults = null;

    $log.info('fabricShape');

    service.init = function () {

      $log.info('fabricShape - init()');

      service.gridLineDefaults = fabricConfig.getGridLineDefaults();
      service.controlDefaults = fabricConfig.getLineDefaults();
      service.rectDefaults = fabricConfig.getRectDefaults();
      service.triangleDefaults = fabricConfig.getTriangleDefaults();
    };

    //
    // Shapes: Circle, Ellipse, Line, Polygon, Polyline, Rect and Triangle.
    //

    /**
     * @name gridLine
     * @desc Creates a new Line object
     * @param {Array} [points] An array of points (where each point is an object with x and y)
     * @param {Object} [options] A configuration object, defaults to gridLineDefaults
     * @return {Object} Returns the new Line object
     */
    service.gridLine = function(points, options) {

      // $log.info('fabricShape - gridLine()');

      options = options || service.gridLineDefaults;

      // $log.info('points: ' + JSON.stringify(['e', points], null, '\t'));

      return new fabricWindow.Line(points, options);
    };

    /**
     * @name line
     * @desc Creates a new Line object
     * @param {Array} [points] An array of points (where each point is an object with x and y)
     * @param {Object} [options] A configuration object, defaults to lineDefaults
     * @return {Object} Returns the new Line object
     */
    service.line = function(points, options) {

      // $log.info('fabricShape - line()');

      options = options || service.controlDefaults;

      // $log.info('points: ' + JSON.stringify(['e', points], null, '\t'));

      return new fabricWindow.Line(points, options);
    };

    /**
     * @name rect
     * @desc Creates a new Rect object
     * @param {Object} [options] A configuration object, defaults to rectDefaults
     * @return {Object} Returns the new Rect object
     */
    service.rect = function(options) {

      // $log.info('fabricShape - rect()');

      options = options || service.rectDefaults;

      return new fabricWindow.Rect(options);

      // var object = new fabricWindow.Rect(options);
      // return object;
    };

    /**
     * @name triangle
     * @desc Creates a new Triangle object
     * @param {Object} [options] A configuration object, defaults to rectDefaults
     * @return {Object} Returns the new Triangle object
     */
    service.triangle = function(options) {

      $log.info('fabricShape - triangle()');

      options = options || service.triangleDefaults;

      // $log.info('options: ' + JSON.stringify(['e', options], null, '\t'));

      return new fabricWindow.Triangle(options);
    };

    /**
     * @name triangle
     * @desc Creates a new Triangle object
     * @param {Object} [options] A configuration object, defaults to rectDefaults
     * @return {Object} Returns the new Triangle object
     */
    service.triangle = function(options) {

      $log.info('fabricShape - triangle()');

      options = options || service.triangleDefaults;

      // $log.info('options: ' + JSON.stringify(['e', options], null, '\t'));

      return new fabricWindow.Triangle(options);
    };

    service.rectWithText = function(text, options) {

      $log.info('fabricShape - rectWithText()');

      text = text || 'New Text';
      options = options || service.rectDefaults;

      return new RectWithText(text, options);
    };

    const FONT_SIZE = 12;
    const FONT_WEIGHT = 'normal';
    const FONT_FAMILY = 'Walter Turncoat';

    var RectWithText = fabricWindow.util.createClass(fabricWindow.Rect, {

      type: 'rectWithText',
      text: '',
      fontSize:   FONT_SIZE,
      fontWeight: FONT_WEIGHT,
      fontFamily: FONT_FAMILY,
      textDecoration: '',
      textAlign: 'left',
      fontStyle: '',
      lineHeight: 1.16,

      initialize: function(text, options) {

        this.callSuper('initialize', options);

        this.set('text', text);
        for (var prop in options) {
          this.set(prop, options[prop]);
        }
      },

      fromObject: function(object) {
        return new RectWithText(object);
      },

      toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
          text: this.get('text')
        });
      },

      _render: function(ctx) {

        this.callSuper('_render', ctx);

        ctx.font = '20px Walter Turncoat';
        ctx.fillStyle = '#333';
        ctx.fillText(this.text, -this.width/2, -this.height/2 + 20);
      },

      toString: function() {
        return '#<ui-fabric.rectWithText (' + this.complexity() +
          '): { "text": "' + this.text + '" }>';
      }

    });

    service.init();

    return service;

  }

})();

// $log.info('service.canvas: ' + JSON.stringify(['e', service.canvas], null, '\t'));

// service.rectDefaults = angular.copy(fabricService.getRectDefaults());
