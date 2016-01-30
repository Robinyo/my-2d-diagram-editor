angular.module('example', [
	'common.fabric',
	'common.fabric.utilities',
	'common.fabric.constants'
])

.controller('ExampleCtrl', ['$scope', '$www', 'Modal', 'Fabric', 'FabricConstants', 'ImagesConstants', 'Keypress', function($scope, $www, Modal, Fabric, FabricConstants, ImagesConstants, Keypress) {

	$scope.fabric = {};
	$scope.ImagesConstants = ImagesConstants;
	$scope.FabricConstants = FabricConstants;

	//
	// Creating Canvas Objects
	// ================================================================
	$scope.addShape = function(path) {
		$scope.fabric.addShape('/lib/svg/' + path + '.svg');
		Modal.close();
	};

	$scope.addImage = function(image) {
		$scope.fabric.addImage('/image?image=' + image + '&size=full');
		Modal.close();
	};

	$scope.addImageUpload = function(data) {
		var obj = angular.fromJson(data);
		$scope.addImage(obj.filename);
		Modal.close();
	};

	//
	// Editing Canvas Size
	// ================================================================
	$scope.selectCanvas = function() {
		$scope.canvasCopy = {
			width: $scope.fabric.canvasOriginalWidth,
			height: $scope.fabric.canvasOriginalHeight
		};
	};

	$scope.setCanvasSize = function() {
		$scope.fabric.setCanvasSize($scope.canvasCopy.width, $scope.canvasCopy.height);
		$scope.fabric.setDirty(true);
		Modal.close();
		delete $scope.canvasCopy;
	};

	$scope.updateCanvas = function() {
		var json = $scope.fabric.getJSON();

		$www.put('/api/canvas/' + $scope.canvasId, {
			json: json
		}).success(function() {
			$scope.fabric.setDirty(false);
		});
	};

	//
	// Init
	// ================================================================
	$scope.init = function() {
		$scope.fabric = new Fabric({
			JSONExportProperties: FabricConstants.JSONExportProperties,
			textDefaults: FabricConstants.textDefaults,
			shapeDefaults: FabricConstants.shapeDefaults,
			json: $scope.main.selectedPage.json
		});
	};

	$scope.$on('canvas:created', $scope.init);

	Keypress.onSave(function() {
		$scope.updatePage();
	});

}]);
