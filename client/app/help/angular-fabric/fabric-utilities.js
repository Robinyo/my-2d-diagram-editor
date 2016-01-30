angular.module('common.fabric.utilities', [])

.directive('parentClick', ['$timeout', function($timeout) {
	return {
		scope: {
			parentClick: '&'
		},
		link: function(scope, element) {
			element.mousedown(function() {
				$timeout(function() {
					scope.parentClick();
				});
			})
			.children()
			.mousedown(function(e) {
				e.stopPropagation();
			});
		}
	};
}])

// ReferenceError: $ is not defined
// http://stackoverflow.com/questions/30773161/angularjs-referenceerror-is-not-defined
// jqLite doesn't work with selectors

.factory('Keypress', [function() {
	var self = {};

	self.onSave = function(cb) {
		$(document).keydown(function(event) {
			// If Control or Command key is pressed and the S key is pressed
			// run save function. 83 is the key code for S.
			if((event.ctrlKey || event.metaKey) && event.which === 83) {
				// Save Function
				event.preventDefault();

				cb();

				return false;
			}
		});
	};

	return self;
}])

.filter('reverse', [function() {
	return function(items) {
		if (items) {
			return items.slice().reverse();
		}
	};
}]);
