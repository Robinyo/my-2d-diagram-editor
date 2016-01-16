(function() {

  'use strict';

  angular.module('my-2d-diagram-editor', []).
    controller('HelloWorldController', HelloWorldController);

  HelloWorldController.$inject = ['$log'];

  function HelloWorldController($log) {

    $log.info('HelloWorldController');

    var hello = this;

    hello.name = { first: "Rob", last: "Ferguson" };
  }

})();
