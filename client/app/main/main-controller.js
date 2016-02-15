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

  angular.module('app.main')
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
    main.fontFamilies = shapeConfig.getFontFamilies();
    main.fontSizes = shapeConfig.getFontSizes();

    main.containers = containerConfig.getContainers();

    main.canvas = null;
    main.grid = { show: true, snapTo: false};

    main.nodeId = 1;

    var nodeDefaults = angular.copy(fabricConfig.getRectWithTextDefaults());
    var containerDefaults = angular.copy(fabricConfig.getRectWithTextDefaults());

    main.formatShape = false;
    main.shape = {};

    main.init = function () {

      $log.debug('MainController - init()');

      main.canvas = fabric.getCanvas();

      main.toggleGrid();

      main.canvas.on('object:selected', function(element) {

        $log.debug('MainController - object:selected');

        fabric.objectSelectedListener(element);

        main.shape = fabric.getActiveObject();
        main.formatShape = true;

        $log.debug('MainController - main.shape.text: ' + main.shape.text);
        $log.debug('MainController - main.shape.fontFamily: ' + main.shape.fontFamily);
        $log.debug('MainController - main.shape.fontSize: ' + main.shape.fontSize);
      });

      main.canvas.on('selection:cleared', function(element) {

        $log.debug('MainController - selection:cleared');

        fabric.selectionClearedListener(element);

        main.shape = null;
        main.formatShape = false;
      });

    };

    main.setShapeName = function(name) {
      $log.debug('MainController.setShapeName()');
      fabric.setActiveObject(main.shape);
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

      fabric.setConnectorMode(false);

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

          fabric.setActiveObject(object);
        });
    };

    const RECT_WIDTH = 300;
    const RECT_HEIGHT = 300;
    // const FONT_SIZE = 20;
    const FONT_SIZE = '20';
    const FONT_WEIGHT = 'bold';

    main.newContainer = function(name, fill) {

      $log.debug('MainController.newContainer()');

      fabric.setConnectorMode(false);

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

          fabric.setActiveObject(object);
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

    // Format Shape

    // HTML5 Canvas
    // font-style: normal, italic and oblique
    // font-weight: normal, bold, bolder, lighter, 100-900

    main.toggleBold = function() {

      $log.debug('MainController.toggleBold()');

      if (main.shape.fontWeight.indexOf('bold') !== -1) {
        if (main.shape.fontWeight.indexOf('italic') !== -1) {
          main.shape.fontWeight = 'italic';
        } else {
          main.shape.fontWeight = '';
        }
      } else {
        if (main.shape.fontWeight.indexOf('italic') !== -1) {
          main.shape.fontWeight = 'bold italic';
        } else {
          main.shape.fontWeight = 'bold';
        }
      }

      $log.debug('MainController.toggleBold() - fontWeight: ' + main.shape.fontWeight);
    };

    main.toggleItalic = function() {

      $log.debug('MainController.toggleItalic()');

      if (main.shape.fontWeight.indexOf('italic') !== -1) {
        if (main.shape.fontWeight.indexOf('bold') !== -1) {
          main.shape.fontWeight = 'bold';
        } else {
          main.shape.fontWeight = '';
        }
      } else {
        if (main.shape.fontWeight.indexOf('bold') !== -1) {
          main.shape.fontWeight = 'bold italic';
        } else {
          main.shape.fontWeight = 'italic';
        }
      }

      $log.debug('MainController.toggleBold() - fontWeight: ' + main.shape.fontWeight);
    };

    main.textXAlign = function(align) {

      $log.debug('MainController.textXAlign()');

      main.shape.textAlign = align;

      $log.debug('MainController.textXAlign() - align: ' + main.shape.textAlign);
    };

  }

})();
