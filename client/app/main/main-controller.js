(function() {

  'use strict';

  /*
   * Reference the App Module to attach a controller
   *
   * controllerAs Controller Syntax
   * Helps avoid the temptation of using $scope methods inside a controller when it may otherwise be better to
   * avoid them or move the method to a factory, and reference them from the controller.
   *
   * We'll use the controllerAs syntax by declaring the controller to be 'MainController as main', which
   * means that we’ll reference the MainController as main within our Views (e.g., layout.html).
   *
   * Consider using $scope in a controller only when needed. For example when publishing or subscribing to events.
   * $broadcast: Sends events from a parent scope downward to its children.
   * $emit: Sends events from a child upward to its parent.
   * $on: Listens for an event and responds.
   */

  /*
   * Use UpperCamelCase when naming controllers, as they are constructors.
   */

  angular.module('my-2d-diagram-editor.main')
    .controller('MainController', MainController);

  /*
   * Use $inject to manually identify your dependencies for Angular components.
   * This technique mirrors the technique used by ng-annotate, for automating the creation of minification safe
   * dependencies. If ng-annotate detects injection has already been made, it will not duplicate it.
   */

  MainController.$inject = ['$log', '$translate', '$scope', 'shapeConfig', 'containerConfig', 'fabric', 'fabricConfig'];

  function MainController($log, $translate, $scope, shapeConfig, containerConfig, fabric, fabricConfig) {

    $log.debug('MainController');

    /*
     * Per common convention, I like to store a reference to the top-level this object (this has a habit
     * of changing context based on function level scope). I also like to name the reference to this, the
     * same name that I declare the controllerAs (e.g., MainController as main).
     * This makes it easier to read and connect the dots as you jump between the HTML and the JavaScript.
     */

    var main = this;

    main.shapes = shapeConfig.getShapes();
    main.containers = containerConfig.getContainers();

    main.canvas = null;
    main.grid = { show: true, snapTo: false};

    main.nodeId = 1;

    var nodeDefaults = angular.copy(fabricConfig.getRectWithTextDefaults());
    var containerDefaults = angular.copy(fabricConfig.getRectWithTextDefaults());

    main.init = function () {

      $log.debug('MainController - init()');

      main.canvas = fabric.getCanvas();

      main.toggleGrid();
    };

    /*
     * Listen for 'canvas:created' event $broadcast by fabricCanvas
     */

    $scope.$on('canvas:created', main.init);

    main.newShape = function(name, fill) {

      $log.debug('MainController.newShape()');

      main.newNode(name, fill);
    };

    main.newNode = function(name, fill) {

      $log.debug('MainController.newNode()');

      name = name || 'NODE';
      fill = fill || 'GRAY';
      nodeDefaults.fill = fill;

      $translate(name)
        .then(function (translatedValue) {

          var id = main.nodeId++;
          var text = translatedValue + ' ' + id;

          var object = fabric.addRectWithText(text, nodeDefaults);
          object.set('type', 'node');
          object.id = id;
          // object.name = text;
          object.connectors = { fromPort: [], fromLine: [], fromArrow: [], toPort: [], toLine: [], toArrow: [], otherObject: [] };

        });
    };

    const RECT_WIDTH = 300;
    const RECT_HEIGHT = 300;
    const FONT_SIZE = 22;
    const FONT_WEIGHT = 'bold';

    main.newContainer = function(name, fill) {

      $log.debug('MainController.newContainer()');

      name = name || 'CONTROLLED_ZONE';
      fill = fill || 'GRAY';
      containerDefaults.fill = fill;
      containerDefaults.fontSize = FONT_SIZE;
      containerDefaults.fontWeight = FONT_WEIGHT;
      containerDefaults.width = RECT_WIDTH;
      containerDefaults.height = RECT_HEIGHT;
      containerDefaults.textBaseline = 'top';

      $translate(name)
        .then(function (translatedValue) {
          var object = fabric.addRectWithText(translatedValue, containerDefaults);
          object.set('type', 'container');
        });
    };

    main.fileNew = function() {
      $log.debug('MainController.fileNew()');
    };

    main.editDelete = function() {
      $log.debug('MainController.editDelete()');
      fabric.removeActiveObjectFromCanvas();
    };

    main.toggleGrid = function() {

      $log.debug('MainController.toggleGrid()');

      main.grid.show = !main.grid.show;

      if (main.grid.show) {
        fabric.showGrid(true);
      } else {
        fabric.showGrid(false);
      }
    };

    main.toggleSnapToGrid = function() {

      $log.debug('MainController.toggleSnapToGrid()');

      main.grid.snapTo = !main.grid.snapTo;

      if (main.grid.snapTo) {
        fabric.snapToGrid(true);
      } else {
        fabric.snapToGrid(false);
      }
    };

    main.setPointerMode = function() {
      $log.debug('MainController.setPointerMode()');
      fabric.setConnectorMode(false);
    };

    main.setConnectorMode = function() {
      $log.debug('MainController.setConnectorMode()');
      fabric.setConnectorMode(true);
      fabric.snapToGrid(false);
    };

    // Arrange Menu Items

    main.bringForward = function() {
      fabric.bringForward();
    };

    main.bringToFront = function() {
      fabric.bringToFront();
    };

    main.sendBackward = function() {
      fabric.sendBackward();
    };

    main.sendToBack = function() {
      fabric.sendToBack();
    };

    //
    // Language Menu Items
    //

    main.switchLanguage = function(key) {
      $log.debug('MainController.switchLanguage() - ' + key.toLocaleString());
      $translate.use(key);
    };

  }

})();
