(function() {

  /*
   * Wrap Angular components in an Immediately Invoked Function Expression (IIFE).
   * An IIFE removes variables from the global scope. This helps prevent variables and function declarations
   * from living longer than expected in the global scope, which also helps avoid variable collisions.
   */

  'use strict';

  /*
   * Declare a new module called 'blocks.exception', and list its dependencies.
   * Modules serve as containers to help you organise code within your AngularJS application.
   * Modules can contain sub-modules, making it easy to compose functionality as needed.
   */

  angular.module('blocks.exception', []);

})();

