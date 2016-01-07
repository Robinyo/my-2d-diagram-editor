angular.module('common.fabric.constants', [])

.service('FabricConstants', [function() {

	var objectDefaults = {
		rotatingPointOffset: 20,
		padding: 0,
		borderColor: 'rgba(102,153,255,0.75)',
		cornerColor: 'rgba(102,153,255,0.5)',
		cornerSize: 10,
    transparentCorners: true,
		hasRotatingPoint: true,
		centerTransform: true
	};

	return {

		presetSizes: [
			{
				name: 'Portrait (8.5 x 11)',
				height: 1947,
				width: 1510
			},
			{
				name: 'Landscape (11 x 8.5)',
				width: 1947,
				height: 1510
			},
			{
				name: 'Business Card (3.5 x 2)',
				height: 368,
				width: 630
			},
			{
				name: 'Postcard (6 x 4)',
				height: 718,
				width: 1068
			},
			{
				name: 'Content/Builder Product Thumbnail',
				height: 400,
				width: 760
			},
			{
				name: 'Badge',
				height: 400,
				width: 400
			},
			{
				name: 'Facebook Profile Picture',
				height: 300,
				width: 300
			},
			{
				name: 'Facebook Cover Picture',
				height: 315,
				width: 851
			},
			{
				name: 'Facebook Photo Post (Landscape)',
				height: 504,
				width: 403
			},
			{
				name: 'Facebook Photo Post (Horizontal)',
				height: 1008,
				width: 806
			},
			{
				name: 'Facebook Full-Width Photo Post',
				height: 504,
				width: 843
			}
		],

		fonts: [
			{ name: 'Arial' },
			{ name: 'Lora' },
			{ name: 'Croissant One' },
			{ name: 'Architects Daughter' },
			{ name: 'Emblema One' },
			{ name: 'Graduate' },
			{ name: 'Hammersmith One' },
			{ name: 'Oswald' },
			{ name: 'Oxygen' },
			{ name: 'Krona One' },
			{ name: 'Indie Flower' },
			{ name: 'Courgette' },
			{ name: 'Gruppo' },
			{ name: 'Ranchers' }
		],

		shapeCategories: [
			{
				name: 'Popular Shapes',
				shapes: [
					'arrow6',
					'bubble4',
					'circle1',
					'rectangle1',
					'star1',
					'triangle1'
				]
			},
			{
				name: 'Simple Shapes',
				shapes: [
					'circle1',
					'heart1',
					'rectangle1',
					'triangle1',
					'star1',
					'star2',
					'star3',
					'square1'
				]
			},
			{
				name: 'Arrows & Pointers',
				shapes: [
					'arrow1',
					'arrow9',
					'arrow3',
					'arrow6',
				]
			},
			{
				name: 'Bubbles & Balloons',
				shapes: [
					'bubble5',
					'bubble4'
				]
			},
			{
				name: 'Check Marks',
				shapes: [

				]
			},
			{
				name: 'Badges',
				shapes: [
					'badge1',
					'badge2',
					'badge4',
					'badge5',
					'badge6'
				]
			}
		],

		JSONExportProperties: [
			'height',
			'width',
			'background',
			'objects',

			'originalHeight',
			'originalWidth',
			'originalScaleX',
			'originalScaleY',
			'originalLeft',
			'originalTop',

			'lineHeight',
			'lockMovementX',
			'lockMovementY',
			'lockScalingX',
			'lockScalingY',
			'lockUniScaling',
			'lockRotation',
			'lockObject',
			'id',
			'isTinted',
			'filters'
		],

		shapeDefaults: angular.extend({
			fill: '#0088cc'
		}, objectDefaults),

    rectDefaults: angular.extend({
      left: 0,
      top: 0,
      width: 300,
      height: 300,
      fill: '#FFFF00',
      opacity: 0.7
    }, objectDefaults),

		textDefaults: angular.extend({
      left: 0,               // rob
      top: 0,                // rob
			originX: 'left',
      originY: 'top',        // rob
			scaleX: 1,
			scaleY: 1,
			fontFamily: 'Tahoma',  // Arial
			fontSize: 12,
      fontWeight: 'normal',  // rob
			fill: '#454545',
			textAlign: 'left'
		}, objectDefaults)

	};

}]);
