angular.module('common.fabric.canvas', [
	'common.fabric.window'
])

.service('FabricCanvas', ['FabricWindow', '$rootScope', function(FabricWindow, $rootScope) {

	var self = {
		canvasId: null,
		element: null,
		canvas: null
	};

	function createId() {
		return Math.floor(Math.random() * 10000);
	}

	self.setElement = function(element) {
		self.element = element;
		$rootScope.$broadcast('canvas:element:selected');
	};

	self.createCanvas = function() {
		self.canvasId = 'fabric-canvas-' + createId();
		self.element.attr('id', self.canvasId);
		self.canvas = new FabricWindow.Canvas(self.canvasId);
		$rootScope.$broadcast('canvas:created');

		return self.canvas;
	};

	self.getCanvas = function() {
		return self.canvas;
	};

	self.getCanvasId = function() {
		return self.canvasId;
	};

	return self;

}]);
