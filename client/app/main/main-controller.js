(function() {

  'use strict';

  /*
   * Reference the App Module to attach a controller
   *
   * controllerAs Controller Syntax
   * Helps avoid the temptation of using $scope methods inside a controller when it may otherwise be better to
   * avoid them or move the method to a factory, and reference them from the controller.
   *
   * Consider using $scope in a controller only when needed. For example when publishing or subscribing to events.
   * $broadcast: Sends events from a parent scope downward to its children.
   * $emit: Sends events from a child upward to its parent.
   * $on: Listens for an event and responds.
   *
   * We'll use the controllerAs syntax by declaring the controller to be 'MainController as main', which
   * means that we’ll reference the MainController as main within our Views (e.g., layout.html).
   */

  angular.module('my-2d-diagram-editor.main')
    .controller('MainController', MainController);

  MainController.$inject = ['$log', '$translate', '$scope', 'mainService', 'fabricService', 'fabricCanvas', 'fabricWindow'];

  function MainController($log, $translate, $scope, mainService, fabricService, fabricCanvas, fabricWindow) {

    $log.info('MainController');

    /*
     * Per common convention, I like to store a reference to the top-level this object (this has a habit
     * of changing context based on function level scope). I also like to name the reference to this, the
     * same name that I declare the controllerAs (e.g., MainController as main).
     * This makes it easier to read and connect the dots as you jump between the HTML and the JavaScript.
     */

    var main = this;

    main.shapes = mainService.getShapes();
    main.containers = mainService.getContainers();

    main.init = function () {

      $log.info('MainController - init()');

      // Defer Controller Logic to Services :)

      var canvas = fabricCanvas.getCanvas();

      var rectDefaults = angular.copy(fabricService.getRectDefaults());

      // $log.info('rectDefaults: ' + JSON.stringify(['e', rectDefaults], null, '\t'));

      rectDefaults.left = 100;
      rectDefaults.top = 100;
      rectDefaults.width = 100;
      rectDefaults.height = 100;

      // $log.info('canvas: ' + JSON.stringify(['e', canvas], null, '\t'));

      var object = new fabricWindow.Rect(rectDefaults);

      canvas.add(object);

      rectDefaults.left = 200;
      rectDefaults.top = 200;

      var object = new fabricWindow.Rect(rectDefaults);

      canvas.add(object);

      canvas.setActiveObject(object);
      canvas.renderAll();

      /*

       object.id = self.createId();

       self.addObjectToCanvas(object);

       var points = [100, 200, 100, 200];
       var options = { stroke: '#ccc' };
       var object = new fabricWindow.Line(points, options);

       canvas.add(object);

       canvas.renderAll();

       */

    };

    $scope.$on('canvas:created', main.init);

    main.newShape = function(name, fill) {
      $log.info('MainController.newShape()');
    };

    main.newContainer = function(name, fill) {
      $log.info('MainController.newContainer()');
    };

    main.fileNew = function() {
      $log.info('MainController.fileNew()');
    };

    main.editDelete = function() {
      $log.info('MainController.editDelete()');
    };

    main.toggleGrid = function() {
      $log.info('MainController.toggleGrid()');
    };

    main.setPointerMode = function() {
      $log.info('MainController.setPointerMode()');
    };

    main.setConnectorMode = function() {
      $log.info('MainController.setConnectorMode()');
    };

    main.toggleSnapToGrid = function() {
      $log.info('MainController.toggleSnapToGrid()');
    };

    main.switchLanguage = function(key) {
      $log.info('MainController.switchLanguage() - ' + key.toLocaleString());
      $translate.use(key);
    };

    //
    // Private methods
    //

    var removeGrid = function() {
      $log.info('MainController.removeGrid()');
    };

    var drawGrid = function() {
      $log.info('MainController.drawGrid()');
    };

  }

})();
