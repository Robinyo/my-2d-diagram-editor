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

  MainController.$inject = ['$log', '$translate', '$scope', 'shapesService', 'containersService', 'fabric', 'fabricService'];

  function MainController($log, $translate, $scope, shapesService, containersService, fabric, fabricService) {

    $log.info('MainController');

    /*
     * Per common convention, I like to store a reference to the top-level this object (this has a habit
     * of changing context based on function level scope). I also like to name the reference to this, the
     * same name that I declare the controllerAs (e.g., MainController as main).
     * This makes it easier to read and connect the dots as you jump between the HTML and the JavaScript.
     */

    var main = this;

    main.shapes = shapesService.getShapes();
    main.containers = containersService.getContainers();

    main.canvas = null;
    main.grid = { show: true };  // TODO: the grid which is not selectable seems to cause other issues)

    const CONTAINER_TEXT_FONT_WEIGHT = 'bold';
    const SHAPE_TEXT_FONT_WEIGHT = 'bold';
    const SHAPE_RECT_WIDTH = 100;
    const SHAPE_RECT_HEIGHT = 100;

    var shapeRectDefaults = angular.copy(fabricService.getRectDefaults());
    shapeRectDefaults.width = SHAPE_RECT_WIDTH;
    shapeRectDefaults.height = SHAPE_RECT_HEIGHT;

    var shapeTextDefaults = angular.copy(fabricService.getTextDefaults());
    shapeTextDefaults.fontSize = shapeTextDefaults.fontSize + 4;
    shapeTextDefaults.fontWeight = SHAPE_TEXT_FONT_WEIGHT;

    var containerRectDefaults = angular.copy(fabricService.getRectDefaults());

    var containerTextDefaults = angular.copy(fabricService.getTextDefaults());
    containerTextDefaults.fontSize = containerTextDefaults.fontSize + 8;
    containerTextDefaults.fontWeight = CONTAINER_TEXT_FONT_WEIGHT;

    main.init = function () {

      $log.info('MainController - init()');

      main.canvas = fabric.getCanvas();

      main.toggleGrid();
    };

    /*
     * Listen for 'canvas:created' event $broadcast by fabricCanvas
     */

    $scope.$on('canvas:created', main.init);


    main.newShape = function(name, fill) {

      $log.info('MainController.newShape()');

      fill = fill || 'GRAY';
      shapeRectDefaults.fill = fill;

      name = 'NODE';

      $translate(name)
        .then(function (translatedValue) {
          var object = fabric.addRect(shapeRectDefaults);
          object.set('type', 'node');
          object.connectors = { from: [], to: [] };
          fabric.addText(translatedValue + ' 1', shapeTextDefaults);
        });
    };

    main.newContainer = function(name, fill) {

      $log.info('MainController.newContainer()');

      fill = fill || 'GRAY';
      containerRectDefaults.fill = fill;

      name = name || 'CONTROLLED_ZONE';

      $translate(name)
        .then(function (translatedValue) {
          var object = fabric.addRect(containerRectDefaults);
          // object.set('type', 'container');
          fabric.addText(translatedValue, containerTextDefaults);
        });
    };

    main.fileNew = function() {
      $log.info('MainController.fileNew()');
    };

    main.editDelete = function() {
      $log.info('MainController.editDelete()');
      fabric.removeActiveObjectFromCanvas();
    };

    main.toggleGrid = function() {
      $log.info('MainController.toggleGrid()');

      main.grid.show = !main.grid.show;

      if (main.grid.show) {
        fabric.showGrid();
      } else {
        fabric.hideGrid();
      }
    };

    main.toggleSnapToGrid = function() {
      $log.info('MainController.toggleSnapToGrid()');
      fabric.toggleSnapToGrid();
    };

    main.setPointerMode = function() {
      $log.info('MainController.setPointerMode()');
      fabric.setConnectorMode(false);
    };

    main.setConnectorMode = function() {
      $log.info('MainController.setConnectorMode()');
      fabric.setConnectorMode(true);
    };

    main.switchLanguage = function(key) {
      $log.info('MainController.switchLanguage() - ' + key.toLocaleString());
      $translate.use(key);
    };

  }

})();
