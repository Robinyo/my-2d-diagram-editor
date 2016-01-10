/**
 * Fabric Factory
 * @namespace Fabric
 */

// console.log('Render cycle:', self.renderCount);

angular.module('common.fabric', [
	'common.fabric.window',
	'common.fabric.directive',
	'common.fabric.canvas',
	'common.fabric.dirtyStatus'
])

.factory('Fabric', [
	'$log', 'FabricConstants', 'FabricWindow', '$timeout', '$window', 'FabricCanvas', 'FabricDirtyStatus',
	function($log, FabricConstants, FabricWindow, $timeout, $window, FabricCanvas, FabricDirtyStatus) {

	return function(options) {

		var canvas;
		var JSONObject;
		var self = angular.extend({

			maxContinuousRenderLoops: 25,
			continuousRenderTimeDelay: 500,
			editable: true,
			JSONExportProperties: [],
			loading: false,
			dirty: false,
			initialized: false,
			userHasClickedCanvas: false,
			downloadMultiplier: 2,

      windowDefaults: FabricConstants.windowDefaults,
      canvasDefaults: FabricConstants.canvasDefaults,
			imageDefaults: {},
      shapeDefaults: FabricConstants.shapeDefaults,
      rectDefaults: FabricConstants.rectDefaults,
			textDefaults: FabricConstants.textDefaults

		}, options);

    var isDrawingMode = false;
    var connectorLine;
    var isMouseDown = false;


		function capitalize(string) {
			if (typeof string !== 'string') {
				return '';
			}

			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		function getActiveStyle(styleName, object) {
			object = object || canvas.getActiveObject();

			if (typeof object !== 'object' || object === null) {
				return '';
			}

			return (object.getSelectionStyles && object.isEditing) ? (object.getSelectionStyles()[styleName] || '') : (object[styleName] || '');
		}

		function setActiveStyle(styleName, value, object) {
			object = object || canvas.getActiveObject();

			if (object.setSelectionStyles && object.isEditing) {
				var style = { };
				style[styleName] = value;
				object.setSelectionStyles(style);
			} else {
				object[styleName] = value;
			}

			self.render();
		}

		function getActiveProp(name) {
			var object = canvas.getActiveObject();

			return typeof object === 'object' && object !== null ? object[name] : '';
		}

		function setActiveProp(name, value) {
			var object = canvas.getActiveObject();
			object.set(name, value);
			self.render();
		}

		function b64toBlob(b64Data, contentType, sliceSize) {
			contentType = contentType || '';
			sliceSize = sliceSize || 512;

			var byteCharacters = atob(b64Data);
			var byteArrays = [];

			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				var slice = byteCharacters.slice(offset, offset + sliceSize);

				var byteNumbers = new Array(slice.length);
				for (var i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}

				var byteArray = new Uint8Array(byteNumbers);

				byteArrays.push(byteArray);
			}

			var blob = new Blob(byteArrays, {type: contentType});
			return blob;
		}

		function isHex(str) {
			return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/gi.test(str);
		}

		//
		// Canvas
		// ==============================================================
		self.renderCount = 0;
		self.render = function() {
			var objects = canvas.getObjects();
			for (var i in objects) {
				objects[i].setCoords();
			}

			canvas.calcOffset();
			canvas.renderAll();
			self.renderCount++;
			// console.log('Render cycle:', self.renderCount);
		};

		self.setCanvas = function(newCanvas) {
			canvas = newCanvas;
			canvas.selection = self.canvasDefaults.selection;
      $log.info('setCanvas - ' + self.canvasDefaults.selection.toLocaleString());
		};

		self.setTextDefaults = function(textDefaults) {
			self.textDefaults = textDefaults;
		};

		self.setJSONExportProperties = function(JSONExportProperties) {
			self.JSONExportProperties = JSONExportProperties;
		};

		self.setCanvasBackgroundColor = function(color) {
			self.canvasDefaults.backgroundColor = color;
			canvas.setBackgroundColor(color);
			self.render();
		};

		self.setCanvasWidth = function(width) {
			self.canvasDefaults.canvasWidth = width;
			canvas.setWidth(width);
			self.render();
		};

		self.setCanvasHeight = function(height) {
			self.canvasDefaults.canvasHeight = height;
			canvas.setHeight(height);
			self.render();
		};

		self.setCanvasSize = function(width, height) {
			self.stopContinuousRendering();
			var initialCanvasScale = self.canvasScale;
			self.resetZoom();

			self.canvasDefaults.canvasWidth = width;
			self.canvasDefaults.canvasOriginalWidth = width;
			canvas.originalWidth = width;
			canvas.setWidth(width);

			self.canvasDefaults.canvasHeight = height;
			self.canvasDefaults.originalHeight = height;
			canvas.originalHeight = height;
			canvas.setHeight(height);

			self.canvasScale = initialCanvasScale;
			self.render();
			self.setZoom();
			self.render();
			self.setZoom();
		};

		self.isLoading = function() {
			return self.isLoading;
		};

		self.deactivateAll = function() {
			canvas.deactivateAll();
			self.deselectActiveObject();
			self.render();
		};

		self.clearCanvas = function() {
			canvas.clear();
			canvas.setBackgroundColor('#ffffff');
			self.render();
		};

    //
    // Grid
    // ==============================================================
    //

    self.setDrawingMode = function(flag) {
      isDrawingMode = flag;
      $log.info('toggleDrawingMode - ' + isDrawingMode.toLocaleString());
    };

    self.toggleSnapToGrid = function() {
      self.canvasDefaults.grid.snapTo = !self.canvasDefaults.grid.snapTo;
    };

		//
		// Creating Objects
		// ==============================================================
		self.addObjectToCanvas = function(object) {

      // console.log('object: ' + object.toString());

			object.originalScaleX = object.scaleX;
			object.originalScaleY = object.scaleY;
			object.originalLeft = object.left;
			object.originalTop = object.top;

			canvas.add(object);
			self.setObjectZoom(object);
			canvas.setActiveObject(object);
			object.bringToFront();
      if (object.left === 0 || object.top === 0) {
        self.center();
      }
			self.render();
		};

		//
		// Image
		// ==============================================================
		self.addImage = function(imageURL) {
			fabric.Image.fromURL(imageURL, function(object) {
				object.id = self.createId();

				for (var p in self.imageOptions) {
					object[p] = self.imageOptions[p];
				}

				// Add a filter that can be used to turn the image
				// into a solid colored shape.
				var filter = new fabric.Image.filters.Tint({
					color: '#ffffff',
					opacity: 0
				});
				object.filters.push(filter);
				object.applyFilters(canvas.renderAll.bind(canvas));

				self.addObjectToCanvas(object);
			}, self.imageDefaults);
		};

		//
		// Shape
		// ==============================================================
    //

		self.addShape = function(svgURL) {
			fabric.loadSVGFromURL(svgURL, function(objects) {
				var object = fabric.util.groupSVGElements(objects, self.shapeDefaults);
				object.id = self.createId();

				for (var p in self.shapeDefaults) {
					object[p] = self.shapeDefaults[p];
				}

				if (object.isSameColor && object.isSameColor() || !object.paths) {
					object.setFill('#0088cc');
				} else if (object.paths) {
					for (var i = 0; i < object.paths.length; i++) {
						object.paths[i].setFill('#0088cc');
					}
				}

				self.addObjectToCanvas(object);
			});
		};

    //
    // Line
    // ==============================================================
    //

    /**
     * @name addLine
     * @desc Adds a text object to the canvas
     * @param {Array} [points] An array of points
     * @param {Object} [options] A configuration object, defaults to FabricConstants.lineDefaults
     */
    self.addLine = function(points, options) {

      $log.info('addLine() - immediate mode');

      options = options || { stroke: '#ccc' };  // TODO:

      if (!points) {
        points = [0, 0, 0, 0];
      }

      var object = new FabricWindow.Line(points, options);
      object.id = self.createId();

      self.addObjectToCanvas(object);

      return object;
    };

    /**
     * @name drawGridLine
     * @desc Draws a grid line but doesn't add it to the canvas
     * @param {Array} [points] An array of points
     * @param {Object} [options] A configuration object
     */
    self.drawGridLine = function(points, options) {

      $log.info('drawGridLine() - retained mode');

      options = options || { stroke: '#ccc' };  // TODO:

       var object = new FabricWindow.Line(points, options);
      object.id = self.createId();

      // retained mode :)
      // self.addObjectToCanvas(object);

      return object;
    };

    //
    // Group
    // ==============================================================
    //

    /**
     * @name createGroup
     * @desc Creates a group
     * @param {Array} [objects] An array of objects
     * @param {Object} [options] A configuration object
     */
    self.createGroup = function(objects, options) {

      $log.info('createGroup()');

      var object = new FabricWindow.Group(objects, options);
      object.id = self.createId();

      canvas.add(object);
      self.render();

      return object;
    };

    /**
     * @name removeGroup
     * @desc Removes a group
     * @param {Object} [object] A group object
     */
    self.removeGroup = function(object) {

      $log.info('removeGroup()');

      canvas.remove(object);
      self.render();
    }

    //
    // Rect
    // ==============================================================

    /**
     * @name addRect
     * @desc Adds a text object to the canvas
     * @param {Object} [options] A configuration object, defaults to FabricConstants.rectDefaults
     */
    self.addRect = function(options) {

      $log.info('addRect()');

      options = options || self.rectDefaults;

      var object = new FabricWindow.Rect(options);
      object.id = self.createId();

      self.addObjectToCanvas(object);
    };

		//
		// Text
		// ==============================================================

    /*
		self.addText = function(str) {
			str = str || 'New Text';
			var object = new FabricWindow.Text(str, self.textDefaults);
			object.id = self.createId();

			self.addObjectToCanvas(object);
		};
		*/

    /**
     * @name addText
     * @desc Adds a text object to the canvas
     * @param {String} text - The text to render on the canvas
     * @param {Object} [options] A configuration object, defaults to FabricConstants.textDefaults
     */
    self.addText = function(text, options) {

      $log.info('addText() - no function overloading in Javascript :)');

      text = text || 'New Text';
      options = options || self.textDefaults;

      var object = new FabricWindow.Text(text, options);
      object.id = self.createId();

      self.addObjectToCanvas(object);
    };

		self.getText = function() {
			return getActiveProp('text');
		};

		self.setText = function(value) {
			setActiveProp('text', value);
		};

		//
		// Font Size
		// ==============================================================
		self.getFontSize = function() {
			return getActiveStyle('fontSize');
		};

		self.setFontSize = function(value) {
			setActiveStyle('fontSize', parseInt(value, 10));
			self.render();
		};

		//
		// Text Align
		// ==============================================================
		self.getTextAlign = function() {
			return capitalize(getActiveProp('textAlign'));
		};

		self.setTextAlign = function(value) {
			setActiveProp('textAlign', value.toLowerCase());
		};

		//
		// Font Family
		// ==============================================================
		self.getFontFamily = function() {
			var fontFamily = getActiveProp('fontFamily');
			return fontFamily ? fontFamily.toLowerCase() : '';
		};

		self.setFontFamily = function(value) {
			setActiveProp('fontFamily', value.toLowerCase());
		};

		//
		// Lineheight
		// ==============================================================
		self.getLineHeight = function() {
			return getActiveStyle('lineHeight');
		};

		self.setLineHeight = function(value) {
			setActiveStyle('lineHeight', parseFloat(value, 10));
			self.render();
		};

		//
		// Bold
		// ==============================================================
		self.isBold = function() {
			return getActiveStyle('fontWeight') === 'bold';
		};

		self.toggleBold = function() {
			setActiveStyle('fontWeight',
				getActiveStyle('fontWeight') === 'bold' ? '' : 'bold');
			self.render();
		};

		//
		// Italic
		// ==============================================================
		self.isItalic = function() {
			return getActiveStyle('fontStyle') === 'italic';
		};

		self.toggleItalic = function() {
			setActiveStyle('fontStyle',
				getActiveStyle('fontStyle') === 'italic' ? '' : 'italic');
			self.render();
		};

		//
		// Underline
		// ==============================================================
		self.isUnderline = function() {
			return getActiveStyle('textDecoration').indexOf('underline') > -1;
		};

		self.toggleUnderline = function() {
			var value = self.isUnderline() ? getActiveStyle('textDecoration').replace('underline', '') : (getActiveStyle('textDecoration') + ' underline');

			setActiveStyle('textDecoration', value);
			self.render();
		};

		//
		// Linethrough
		// ==============================================================
		self.isLinethrough = function() {
			return getActiveStyle('textDecoration').indexOf('line-through') > -1;
		};

		self.toggleLinethrough = function() {
			var value = self.isLinethrough() ? getActiveStyle('textDecoration').replace('line-through', '') : (getActiveStyle('textDecoration') + ' line-through');

			setActiveStyle('textDecoration', value);
			self.render();
		};

		//
		// Text Align
		// ==============================================================
		self.getTextAlign = function() {
			return getActiveProp('textAlign');
		};

		self.setTextAlign = function(value) {
			setActiveProp('textAlign', value);
		};

		//
		// Opacity
		// ==============================================================
		self.getOpacity = function() {
			return getActiveStyle('opacity');
		};

		self.setOpacity = function(value) {
			setActiveStyle('opacity', value);
		};

		//
		// FlipX
		// ==============================================================
		self.getFlipX = function() {
			return getActiveProp('flipX');
		};

		self.setFlipX = function(value) {
			setActiveProp('flipX', value);
		};

		self.toggleFlipX = function() {
			var value = self.getFlipX() ? false : true;
			self.setFlipX(value);
			self.render();
		};

		//
		// Align Active Object
		// ==============================================================
		self.center = function() {
			var activeObject = canvas.getActiveObject();
			if (activeObject) {
				activeObject.center();
				self.updateActiveObjectOriginals();
				self.render();
			}
		};

		self.centerH = function() {
			var activeObject = canvas.getActiveObject();
			if (activeObject) {
				activeObject.centerH();
				self.updateActiveObjectOriginals();
				self.render();
			}
		};

		self.centerV = function() {
			var activeObject = canvas.getActiveObject();
			if (activeObject) {
				activeObject.centerV();
				self.updateActiveObjectOriginals();
				self.render();
			}
		};

		//
		// Active Object Layer Position
		// ==============================================================
		self.sendBackwards = function() {
			var activeObject = canvas.getActiveObject();
			if (activeObject) {
				canvas.sendBackwards(activeObject);
				self.render();
			}
		};

		self.sendToBack = function() {
			var activeObject = canvas.getActiveObject();
			if (activeObject) {
				canvas.sendToBack(activeObject);
				self.render();
			}
		};

		self.bringForward = function() {
			var activeObject = canvas.getActiveObject();
			if (activeObject) {
				canvas.bringForward(activeObject);
				self.render();
			}
		};

		self.bringToFront = function() {
			var activeObject = canvas.getActiveObject();
			if (activeObject) {
				canvas.bringToFront(activeObject);
				self.render();
			}
		};

		//
		// Active Object Tint Color
		// ==============================================================
		self.isTinted = function() {
			return getActiveProp('isTinted');
		};

		self.toggleTint = function() {
			var activeObject = canvas.getActiveObject();
			activeObject.isTinted = !activeObject.isTinted;
			activeObject.filters[0].opacity = activeObject.isTinted ? 1 : 0;
			activeObject.applyFilters(canvas.renderAll.bind(canvas));
		};

		self.getTint = function() {
			var object = canvas.getActiveObject();

			if (typeof object !== 'object' || object === null) {
				return '';
			}

			if (object.filters !== undefined) {
				if (object.filters[0] !== undefined) {
					return object.filters[0].color;
				}
			}
		};

		self.setTint = function(tint) {
			if (! isHex(tint)) {
				return;
			}

			var activeObject = canvas.getActiveObject();
			if (activeObject.filters !== undefined) {
				if (activeObject.filters[0] !== undefined) {
					activeObject.filters[0].color = tint;
					activeObject.applyFilters(canvas.renderAll.bind(canvas));
				}
			}
		};

		//
		// Active Object Fill Color
		// ==============================================================
		self.getFill = function() {
			return getActiveStyle('fill');
		};

		self.setFill = function(value) {
			var object = canvas.getActiveObject();
			if (object) {
				if (object.type === 'text') {
					setActiveStyle('fill', value);
				} else {
					self.setFillPath(object, value);
				}
			}
		};

		self.setFillPath = function(object, value) {
			if (object.isSameColor && object.isSameColor() || !object.paths) {
				object.setFill(value);
			} else if (object.paths) {
				for (var i = 0; i < object.paths.length; i++) {
					object.paths[i].setFill(value);
				}
			}
		};

		//
		// Canvas Zoom
		// ==============================================================
		self.resetZoom = function() {
			self.canvasScale = 1;
			self.setZoom();
		};

		self.setZoom = function() {
			var objects = canvas.getObjects();
			for (var i in objects) {
				objects[i].originalScaleX = objects[i].originalScaleX ? objects[i].originalScaleX : objects[i].scaleX;
				objects[i].originalScaleY = objects[i].originalScaleY ? objects[i].originalScaleY : objects[i].scaleY;
				objects[i].originalLeft = objects[i].originalLeft ? objects[i].originalLeft : objects[i].left;
				objects[i].originalTop = objects[i].originalTop ? objects[i].originalTop : objects[i].top;
				self.setObjectZoom(objects[i]);
			}

			self.setCanvasZoom();
			self.render();
		};

		self.setObjectZoom = function(object) {
			var scaleX = object.originalScaleX;
			var scaleY = object.originalScaleY;
			var left = object.originalLeft;
			var top = object.originalTop;

			var tempScaleX = scaleX * self.canvasScale;
			var tempScaleY = scaleY * self.canvasScale;
			var tempLeft = left * self.canvasScale;
			var tempTop = top * self.canvasScale;

			object.scaleX = tempScaleX;
			object.scaleY = tempScaleY;
			object.left = tempLeft;
			object.top = tempTop;

			object.setCoords();
		};

		self.setCanvasZoom = function() {
			var width = self.canvasDefaults.originalWidth;
			var height = self.canvasDefaults.originalHeight;

			var tempWidth = width * self.canvasScale;
			var tempHeight = height * self.canvasScale;

			canvas.setWidth(tempWidth);
			canvas.setHeight(tempHeight);
		};

		self.updateActiveObjectOriginals = function() {
			var object = canvas.getActiveObject();
			if (object) {
				object.originalScaleX = object.scaleX / self.canvasScale;
				object.originalScaleY = object.scaleY / self.canvasScale;
				object.originalLeft = object.left / self.canvasScale;
				object.originalTop = object.top / self.canvasScale;
			}
		};

		//
		// Active Object Lock
		// ==============================================================
		self.toggleLockActiveObject = function() {
			var activeObject = canvas.getActiveObject();
			if (activeObject) {
				activeObject.lockMovementX = !activeObject.lockMovementX;
				activeObject.lockMovementY = !activeObject.lockMovementY;
				activeObject.lockScalingX = !activeObject.lockScalingX;
				activeObject.lockScalingY = !activeObject.lockScalingY;
				activeObject.lockUniScaling = !activeObject.lockUniScaling;
				activeObject.lockRotation = !activeObject.lockRotation;
				activeObject.lockObject = !activeObject.lockObject;
				self.render();
			}
		};

		//
		// Active Object
		// ==============================================================
		self.selectActiveObject = function() {
			var activeObject = canvas.getActiveObject();
			if (! activeObject) {
				return;
			}

			self.selectedObject = activeObject;
			self.selectedObject.text = self.getText();
			self.selectedObject.fontSize = self.getFontSize();
			self.selectedObject.lineHeight = self.getLineHeight();
			self.selectedObject.textAlign = self.getTextAlign();
			self.selectedObject.opacity = self.getOpacity();
			self.selectedObject.fontFamily = self.getFontFamily();
			self.selectedObject.fill = self.getFill();
			self.selectedObject.tint = self.getTint();
		};

		self.deselectActiveObject = function() {
			self.selectedObject = false;
      canvas.deactivateAll().renderAll();
		};

		self.deleteActiveObject = function() {
			var activeObject = canvas.getActiveObject();
			canvas.remove(activeObject);
			self.render();
		};

		//
		// State Managers
		// ==============================================================
		self.isLoading = function() {
			return self.loading;
		};

		self.setLoading = function(value) {
			self.loading = value;
		};

		self.setDirty = function(value) {
			FabricDirtyStatus.setDirty(value);
		};

		self.isDirty = function() {
			return FabricDirtyStatus.isDirty();
		};

		self.setInitalized = function(value) {
			self.initialized = value;
		};

		self.isInitalized = function() {
			return self.initialized;
		};

		//
		// JSON
		// ==============================================================
		self.getJSON = function() {
			var initialCanvasScale = self.canvasScale;
			self.canvasScale = 1;
			self.resetZoom();

			var json = JSON.stringify(canvas.toJSON(self.JSONExportProperties));

			self.canvasScale = initialCanvasScale;
			self.setZoom();

			return json;
		};

		self.loadJSON = function(json) {
			self.setLoading(true);
			canvas.loadFromJSON(json, function() {
				$timeout(function() {
					self.setLoading(false);

					if (!self.editable) {
						self.disableEditing();
					}

					self.render();
				});
			});
		};

		//
		// Download Canvas
		// ==============================================================
		self.getCanvasData = function() {
			var data = canvas.toDataURL({
				width: canvas.getWidth(),
				height: canvas.getHeight(),
				multiplier: self.downloadMultiplier
			});

			return data;
		};

		self.getCanvasBlob = function() {
			var base64Data = self.getCanvasData();
			var data = base64Data.replace('data:image/png;base64,', '');
			var blob = b64toBlob(data, 'image/png');
			var blobUrl = URL.createObjectURL(blob);

			return blobUrl;
		};

		self.download = function(name) {
			// Stops active object outline from showing in image
			self.deactivateAll();

			var initialCanvasScale = self.canvasScale;
			self.resetZoom();

			// Click an artifical anchor to 'force' download.
			var link = document.createElement('a');
			var filename = name + '.png';
			link.download = filename;
			link.href = self.getCanvasBlob();
			link.click();

			self.canvasScale = initialCanvasScale;
			self.setZoom();
		};

		//
		// Continuous Rendering
		// ==============================================================
		// Upon initialization re render the canvas
		// to account for fonts loaded from CDN's
		// or other lazy loaded items.

		// Prevent infinite rendering loop
		self.continuousRenderCounter = 0;
		self.continuousRenderHandle;

		self.stopContinuousRendering = function() {
			$timeout.cancel(self.continuousRenderHandle);
			self.continuousRenderCounter = self.maxContinuousRenderLoops;
		};

		self.startContinuousRendering = function() {
			self.continuousRenderCounter = 0;
			self.continuousRender();
		};

		// Prevents the "not fully rendered up upon init for a few seconds" bug.
		self.continuousRender = function() {
			if (self.userHasClickedCanvas || self.continuousRenderCounter > self.maxContinuousRenderLoops) {
				return;
			}

			self.continuousRenderHandle = $timeout(function() {
				self.setZoom();
				self.render();
				self.continuousRenderCounter++;
				self.continuousRender();
			}, self.continuousRenderTimeDelay);
		};

		//
		// Utility
		// ==============================================================
		self.setUserHasClickedCanvas = function(value) {
			self.userHasClickedCanvas = value;
		};

		self.createId = function() {
			return Math.floor(Math.random() * 10000);
		};

		//
		// Toggle Object Selectability
		// ==============================================================
		self.disableEditing = function() {
			canvas.selection = false;
			canvas.forEachObject(function(object) {
				object.selectable = false;
			});
		};

		self.enableEditing = function() {
			canvas.selection = true;
			canvas.forEachObject(function(object) {
				object.selectable = true;
			});
		};


		//
		// Set Global Defaults
		// ==============================================================
		self.setCanvasDefaults = function() {
			canvas.selection = self.canvasDefaults.selection;
		};

		self.setWindowDefaults = function() {
			FabricWindow.Object.prototype.transparentCorners = self.windowDefaults.transparentCorners;
			FabricWindow.Object.prototype.rotatingPointOffset = self.windowDefaults.rotatingPointOffset;
			FabricWindow.Object.prototype.padding = self.windowDefaults.padding;
		};

		//
		// Canvas Listeners
		// ============================================================
    //

    /**
     * @name startCanvasListeners
     * @desc Registers the various canvas listeners
     */
		self.startCanvasListeners = function() {

      canvas.on('mouse:down', function(object){

        $log.info('canvas.on(mouse:down');

        if (!isDrawingMode) return;

        isMouseDown = true;

        // self.disableEditing();

        var pointer = canvas.getPointer(object.e);
        var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];

        $log.info('canvas - ' + canvas.toLocaleString());
        $log.info('points - ' + points.toLocaleString());

        var options =  {
          // selectable: false,
          fill: 'black',
          stroke: 'black',
          strokeWidth: 2,
          originX: 'center',
          originY: 'center'
        };

        connectorLine = new FabricWindow.Line(points, options);
        connectorLine.id = self.createId();

        self.addObjectToCanvas(connectorLine);
      });

      canvas.on('mouse:move', function(object){

        // $log.info('canvas.on(mouse:move - ' + isMouseDown.toLocaleString());

        if (!isDrawingMode) return;

        if (!isMouseDown) return;

        var pointer = canvas.getPointer(object.e);
        connectorLine.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();

      });

      canvas.on('mouse:up', function(){
        $log.info('canvas.on(mouse:up');
        isMouseDown = false;
        // self.enableEditing();
      });

      /*

      canvas.on('mouse:over', function(e) {
        e.target.setFill('red');
        canvas.renderAll();
      });

      canvas.on('mouse:out', function(e) {
        e.target.setFill('green');
        canvas.renderAll();
      });

      */

			canvas.on('object:selected', function() {
        $log.info('canvas.on(object:selected');
				self.stopContinuousRendering();
				$timeout(function() {
					self.selectActiveObject();
					self.setDirty(true);
				});
			});

      //
      // snap to grid
      //
      /*
      canvas.on('object:moving', function(options) {

        if (self.canvasDefaults.grid.snapTo) {

          // $log.info('canvas.on(object:moving)');

          options.target.set({
            left: Math.round(options.target.left / 50) * 50,
            top: Math.round(options.target.top / 50) * 50
          });
        }
      });
      */

			canvas.on('selection:created', function() {
        $log.info('canvas.on(selection:created');
				self.stopContinuousRendering();
			});

			canvas.on('selection:cleared', function() {
				$timeout(function() {
          $log.info('canvas.on(selection:cleared');
					self.deselectActiveObject();
				});
			});

			canvas.on('after:render', function() {
				canvas.calcOffset();
			});

			canvas.on('object:modified', function() {
        $log.info('canvas.on(object:modified');
				self.stopContinuousRendering();
				$timeout(function() {
					self.updateActiveObjectOriginals();
					self.setDirty(true);
				});
			});
		};

		//
		// Constructor
		// ==============================================================
		self.init = function() {
			canvas = FabricCanvas.getCanvas();
			self.canvasId = FabricCanvas.getCanvasId();
			canvas.clear();

			// For easily accessing the json
			JSONObject = angular.fromJson(self.json);
			self.loadJSON(self.json);

			JSONObject = JSONObject || {};

			self.canvasScale = 1;

			JSONObject.background = JSONObject.background || '#ffffff';
			self.setCanvasBackgroundColor(JSONObject.background);

			// Set the size of the canvas
			JSONObject.width = JSONObject.width || 800;
			self.canvasDefaults.originalWidth = JSONObject.width;

			JSONObject.height = JSONObject.height || 800;
			self.canvasDefaults.originalHeight = JSONObject.height;

			self.setCanvasSize(self.canvasDefaults.originalWidth, self.canvasDefaults.originalHeight);

			self.render();
			self.setDirty(false);
			self.setInitalized(true);

			self.setCanvasDefaults();
			self.setWindowDefaults();
			self.startCanvasListeners();
			self.startContinuousRendering();
			FabricDirtyStatus.startListening();
		};

		self.init();

		return self;
	};

}]);


/*

 canvasBackgroundColor: '#ffffff',
 canvasWidth: 300,
 canvasHeight: 300,
 canvasOriginalHeight: 300,
 canvasOriginalWidth: 300,

 */
