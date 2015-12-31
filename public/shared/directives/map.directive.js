(function(){
	'use strict';

	virusApp.directive('mapRenderer', ['$compile', '$q', '$http','threeService', 'Hexasphere','Tile', function($compile, $q, $http, threeService, Hexasphere, Tile){
		function create_lights(scene){
			var light = new THREE.PointLight(0xffffff);
			light.position.set(0,250,0);
			scene.add(light);

			var light2 = new THREE.PointLight(0xffffff);
			light2.position.set(0,-250,0);
			scene.add(light2);

			var light3 = new THREE.PointLight(0xffffff);
			light3.position.set(0,0,-250);
			scene.add(light3);

			var light4 = new THREE.PointLight(0xffffff);
			light4.position.set(0,0,250);
			scene.add(light4);
		}

		function create_planet(){
			var deferred = $q.defer();

			$q.all([
				threeService.load_texture('earthmap.jpg'),
				$http.get('/static/assets/shaders/planet.vs'),
				$http.get('/static/assets/shaders/planet.fs'),
				$http.get('/static/assets/shaders/atmosphere.vs'),
				$http.get('/static/assets/shaders/atmosphere.fs'),
			]).then(function(response){
				var geometry = new THREE.SphereGeometry(50, 40, 40);

				var uniforms = THREE.UniformsUtils.merge([
					THREE.UniformsLib['lights'],
					{ texture : { type : 't', value : null } },
				]);

				uniforms.texture.value = response[0];

				var shader = new THREE.ShaderMaterial({
					uniforms : uniforms,
					vertexShader : response[1].data,
					fragmentShader : response[2].data,
					// transparent : true,
					lights : true
				});

				var planet = new THREE.Mesh(geometry, shader);

				var atmosphere = new THREE.SphereGeometry(57, 32, 40);

				var atmosphere_shader = new THREE.ShaderMaterial({
					side : THREE.BackSide,
					blending : THREE.AdditiveBlending,
					uniforms : {},
					vertexShader : response[3].data,
					fragmentShader : response[4].data,
					transparent : true
				})

				var atmosphere_mesh = new THREE.Mesh(atmosphere, atmosphere_shader);

				var group = new THREE.Object3D();
				group.add(planet);
				group.add(atmosphere_mesh);

				deferred.resolve(group);
			});

			return deferred.promise;
		}

		return {
			restrict : 'E',
			replace : true,
			scope : {
				model : '='
			},
			template : '<div></div>',
			link : function(scope, element, attrs){
				var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight - (90 * 2);

				var scene, camera;
				var planet, hexasphere;

				var group = new THREE.Object3D();

				var raycaster = new THREE.Raycaster();

				var config = {
					on : { material : new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x7cfc00}) },
					off : { material : new THREE.LineBasicMaterial( { color: 0x00ee00, opacity: 0.8, linewidth: 1, transparent: true } )}
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
						if (intersects[i].object.userData instanceof Tile){
							console.warn(intersects[i].object.userData);
							intersects[i].object.userData.toggle(true);
							break;
						}
					}
				}

				function init(){
					element[0].addEventListener('mousedown', mouse_down, false);

					threeService.init(SCREEN_WIDTH, SCREEN_HEIGHT, {x : 0, y : 200, z : 200});

					camera = threeService.get_camera();

					element[0].appendChild(threeService.get_renderer().domElement);
					threeService.get_renderer().sortObjects = false;

					create_lights(threeService.get_scene());


					var radius = 50.2;
					var subDivisions = 15;
					var tileWidth = 1;

					group = new THREE.Object3D();

					threeService.get_scene().add(group);

					hexasphere = new Hexasphere(radius, subDivisions, tileWidth);
					hexasphere.geometry().then(function(hexasphere_mesh){
						group.add(hexasphere_mesh);

						scope.$watch('model', function(){
							for (var i = 0; i < scope.model.length; i++){

								var tile = hexasphere.findTile(parseFloat(scope.model[i].latitude), parseFloat(scope.model[i].longitude));
								tile.toggle(true);
							}
						}, true);
					});

					create_planet().then(function(group_planet){
						group.add(group_planet);
					});



					threeService.load_skybox();

					threeService.render(animate);
				}


				init(element);



				animate();
			}
		};
	}]);
})();
