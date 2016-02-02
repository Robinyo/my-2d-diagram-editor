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

    $log.debug('fabricShape');

    service.init = function () {

      $log.debug('fabricShape - init()');

      service.gridLineDefaults = fabricConfig.getGridLineDefaults();
      service.lineDefaults = fabricConfig.getLineDefaults();
      service.rectDefaults = fabricConfig.getRectDefaults();
      service.rectWithTextDefaults = fabricConfig.getRectWithTextDefaults();
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

      $log.debug('fabricShape - gridLine()');

      options = options || service.gridLineDefaults;

      // $log.debug('points: ' + JSON.stringify(['e', points], null, '\t'));

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

      $log.debug('fabricShape - line()');

      options = options || service.lineDefaults;

      // $log.debug('points: ' + JSON.stringify(['e', points], null, '\t'));

      return new fabricWindow.Line(points, options);
    };

    /**
     * @name rect
     * @desc Creates a new Rect object
     * @param {Object} [options] A configuration object, defaults to rectDefaults
     * @return {Object} Returns the new Rect object
     */
    service.rect = function(options) {

      $log.debug('fabricShape - rect()');

      options = options || service.rectDefaults;

      return new fabricWindow.Rect(options);

      // var object = new fabricWindow.Rect(options);
      // return object;
    };

    /**
     * @name triangle
     * @desc Creates a new Triangle object
     * @param {Object} [options] A configuration object, defaults to triangleDefaults
     * @return {Object} Returns the new Triangle object
     */
    service.triangle = function(options) {

      $log.debug('fabricShape - triangle()');

      options = options || service.triangleDefaults;

      // $log.debug('options: ' + JSON.stringify(['e', options], null, '\t'));

      return new fabricWindow.Triangle(options);
    };

    /**
     * @name rectWithText
     * @desc Creates a new RectWithText object
     * @param {String} [text] A configuration object, defaults to rectWithTextDefaults
     * @return {Object} Returns the new RectWithText object
     */
    service.rectWithText = function(text, options) {

      $log.debug('fabricShape - rectWithText()');

      text = text || 'New Text';
      options = options || service.rectWithTextDefaults;

      return new RectWithText(text, options);
    };

    var RectWithText = fabricWindow.util.createClass(fabricWindow.Rect, {

      type: 'rectWithText',

      text: '',

      fillStyle: '',
      fontFamily: '',
      fontSize: 20,
      fontWeight: '',
      // lineHeight: 1.16,
      textAlign: '',
      textBaseline: '',
      // textDecoration: '',
      // fontStyle: '',

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

        var x = 0;
        var y = 0;

        if (this.textBaseline === 'top') {
          y = -(this.height / 2) + this.fontSize;
        }

        ctx.fillStyle = this.fillStyle;
        ctx.font = this.fontWeight + ' ' + this.fontSize + 'px ' + this.fontFamily;  // 'bold 20px Tahoma';
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;

        ctx.fillText(this.text, x, y);

        // $log.debug('fabricShape - ctx.font: ' + ctx.font.toLocaleString());
      },

      toString: function() {
        return '#<ui-fabric.rectWithText (' + this.complexity() +
          '): { "text": "' + this.text + '" }>';
      }

    });

    /**
     * @name connector
     * @desc Creates a new Connector object
     * @param {Array} [points] Array of points, e.g., [0, 0, 0, 0]
     * @param {Object} [options] A configuration object, defaults to lineDefaults
     * @return {Object} Returns the new Connector object
     */
    service.connector = function(points, options) {

      $log.debug('fabricShape - connector()');

      options = options || service.lineDefaults;

      return new Connector(points, options);
    };

    var Connector = fabricWindow.util.createClass(fabricWindow.Line, {

      type: 'connector',

      initialize: function(points, options) {
        this.callSuper('initialize', points, options);

      },

      fromObject: function(object) {
        return new Connector(object);

      },

      toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {

        });
      },

      _render: function(ctx) {
        this.callSuper('_render', ctx);

      },

      toString: function() {
        return '#<ui-fabric.connector (' + this.complexity() + '" }>';

      }

    });

    service.init();

    return service;

  }

})();

