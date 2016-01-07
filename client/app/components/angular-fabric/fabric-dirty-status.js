angular.module('common.fabric.dirtyStatus', [])

.service('FabricDirtyStatus', ['$window', function($window) {

	var self = {
		dirty: false
	};

	function checkSaveStatus() {
		if (self.isDirty()) {
			return "Oops! You have unsaved changes.\n\nPlease save before leaving so you don't lose any work.";
		}
	}

	self.endListening = function() {
		$window.onbeforeunload = null;
		$window.onhashchange = null;
	};

	self.startListening = function() {
		$window.onbeforeunload = checkSaveStatus;
		$window.onhashchange = checkSaveStatus;
	};

	self.isDirty = function() {
		return self.dirty;
	};

	self.setDirty = function(value) {
		self.dirty = value;
	};

	return self;

}]);
