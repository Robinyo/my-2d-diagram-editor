(function() {

  /*
   * Wrap Angular components in an Immediately Invoked Function Expression (IIFE).
   * An IIFE removes variables from the global scope. This helps prevent variables and function declarations
   * from living longer than expected in the global scope, which also helps avoid variable collisions.
   */

  'use strict';

  /*
   * Declare a new module called 'my-2d-diagram-editor', and list its dependencies.
   * Modules serve as containers to help you organise code within your AngularJS application.
   * Modules can contain sub-modules, making it easy to compose functionality as needed.
   */

  angular.module('my-2d-diagram-editor', [
    'ngAnimate',
    'ui.bootstrap',
    'ui.router',
    'pascalprecht.translate',

    'ui.fabric',

    'my-2d-diagram-editor.main'
  ]);

})();

// $log.info('service.canvas: ' + JSON.stringify(['e', service.canvas], null, '\t'));

