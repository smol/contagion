(function(){
	'use strict';

	virusApp.directive('mapRenderer', ['$compile', '$q', '$http','threeService', function($compile, $q, $http, threeService){
		var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight - (90 * 2);

		var container, scene, camera, stats, planet,hexasphere;
		var group;
		var keyboard = new THREEx.KeyboardState();
		var clock = new THREE.Clock();

		var cube;
		var raycaster;

		var intersection = {
			intersects: false,
			point: new THREE.Vector3(),
			normal: new THREE.Vector3()
		};

		var config = {
			on : {material : new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x7cfc00})},
			off : {material : new THREE.LineBasicMaterial( { color: 0x00ee00, opacity: 0.8, linewidth: 1, transparent: true} )}
		};

		function animate(){
			if (planet)
				group.rotation.y += 0.002;
		}

		function mouse_down(){
			var x = 0, y = 0;

			if ( event.changedTouches ) {
				x = event.changedTouches[0].pageX;
				y = event.changedTouches[0].pageY;
			} else {
				x = event.clientX;
				y = event.clientY;
			}

			var mouse = {
				x : (x / window.innerWidth) * 2 - 1,
				y : - (y / window.innerHeight) * 2 + 1
			};

			raycaster.setFromCamera(mouse, camera);

			var intersects = raycaster.intersectObjects(group.children, true);
			console.warn(intersects);
			for (var i = 0; i < intersects.length; ++i){
				if (intersects[i].object.userData.toggle){
					intersects[i].object.userData.toggle(true);
					break;
				}
			}

		}

		function init(element, model){
			window.addEventListener('mousedown', mouse_down, false);

			threeService.init(SCREEN_WIDTH, SCREEN_HEIGHT, {x : 0, y : 200, z : 200});

			camera = threeService.get_camera();

			element[0].appendChild(threeService.get_renderer().domElement);

			var light = new THREE.PointLight(0xffffff);
			light.position.set(0,250,0);
			threeService.get_scene().add(light);

			var light2 = new THREE.PointLight(0xffffff);
			light2.position.set(0,-250,0);
			threeService.get_scene().add(light2);

			var light3 = new THREE.PointLight(0xffffff);
			light3.position.set(0,0,-250);
			threeService.get_scene().add(light3);

			var light4 = new THREE.PointLight(0xffffff);
			light4.position.set(0,0,250);
			threeService.get_scene().add(light4);

			var model_deferred = $q.defer();

			group = new THREE.Object3D();

			raycaster = new THREE.Raycaster();

			var radius = 50.2;
			var subDivisions = 15;
			var tileWidth = 1;

			hexasphere = new Hexasphere(radius, subDivisions, tileWidth);

			var isLand = function(lat, lon){
				// for (var i = 0; i < model.length; ++i){
				// 	if (model[i].longitude >= long &&)
				// }

				// console.warn(lat, lon);

				return false;
				// var x = parseInt(img.width * (lon + 180) / 360);
				// var y = parseInt(img.height * (lat+90) / 180);
				//
				// if(pixelData == null){
				// 	pixelData = projectionContext.getImageData(0,0,img.width, img.height);
				// }
				//
				// return pixelData.data[(y * pixelData.width + x) * 4] === 0;
			};

			// var meshMaterials = [];
			// meshMaterials.push();
			// meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x397d02}));
			// meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x77ee00}));
			// meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x61b329}));
			// meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x83f52c}));
			// meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x83f52c}));
			// meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x4cbb17}));
			// meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x00ee00}));
			// meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x00aa11}));

			// 	var latLon = t.getLatLon(hexasphere.radius);
			//
			// 	var geometry = new THREE.Geometry();
			//
			// 	for(var j = 0; j< t.boundary.length; j++){
			// 		var bp = t.boundary[j];
			// 		geometry.vertices.push(new THREE.Vector3(bp.x, bp.y, bp.z));
			// 	}
			// 	geometry.vertices.push(new THREE.Vector3(t.boundary[0].x, t.boundary[0].y, t.boundary[0].z));
			//
			// 	// if(isLand(latLon.lat, latLon.lon)){
			// 	//
			// 	//     geometry.faces.push(new THREE.Face3(0,1,2));
			// 	//     geometry.faces.push(new THREE.Face3(0,2,3));
			// 	//     geometry.faces.push(new THREE.Face3(0,3,4));
			// 	//     geometry.faces.push(new THREE.Face3(0,4,5));
			// 	//
			// 	//     var mesh = new THREE.Mesh(geometry, meshMaterials[Math.floor(Math.random() * meshMaterials.length)]);
			// 	//     mesh.doubleSided = true;
			// 	//     scene.add(mesh);
			// 	//  } else {
			// 		group.add();
			//
			// 	//  }
			//

			group.add(hexasphere.geometry());

			$q.all([threeService.load_texture('temp.jpg')]).then(function(response){
				var geometry =  new THREE.SphereGeometry(50, 50, 50);

				var material = new THREE.MeshLambertMaterial({
					color : 0xffffff,
					map : response[0]
				});

				planet = new THREE.Mesh(geometry, material);

				group.add(planet);

				threeService.get_scene().add(group);

				model_deferred.resolve(planet);

			});

			threeService.load_skybox();

			// var ambient = threeService.directional_light(0x101030);

			// var directionalLight = threeService.directional_light(0xffeedd);
			// directionalLight.position.set(0, 0, 1);

			threeService.render(animate);
		}

		return {
			restrict : 'E',
			replace : true,
			scope : {
				model : '='
			},
			template : '<div></div>',
			link : function(scope, element, attrs){
				init(element, scope.model);

				scope.$watch('model', function(){
					for (var i = 0; i < scope.model.length; i++){

						var tile = hexasphere.findTile(parseFloat(scope.model[i].latitude), parseFloat(scope.model[i].longitude));
						tile.toggle(true);
						// threeService.get_scene().add(tile.toggle(true, config));
					}
				}, true);

				animate();
			}
		};
	}]);
})();
