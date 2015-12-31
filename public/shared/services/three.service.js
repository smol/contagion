(function(){
	'use strict';

	virusApp.service('threeService', ['$q', '$timeout', function($q, $timeout){
		var manager = null;
		var scene = null;
		var renderer = null;
		var camera = null;
		var controls = null;

		var tick_frame = 1000 / 30;
		var next_frame = new Date().getTime();

		var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight - (90 * 2);

		function onWindowResize() {
			var windowHalfX = SCREEN_WIDTH / 2;
			var windowHalfY = SCREEN_HEIGHT / 2;
			camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
			camera.updateProjectionMatrix();

			renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		}

		window.addEventListener('resize', onWindowResize, false);

		return {
			init : function(width, height, position){
				SCREEN_HEIGHT = height;
				SCREEN_WIDTH = width;

				scene = new THREE.Scene();
				manager = new THREE.LoadingManager();

				renderer = new THREE.WebGLRenderer({antialias : true});
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
				

				THREEx.WindowResize(renderer, camera);
				THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

				var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

				camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
				scene.add(camera);
				camera.position.set(position.x, position.y, position.z);
				camera.lookAt(scene.position);

				controls = new THREE.OrbitControls(camera, renderer.domElement);

				controls.domElement.addEventListener('mousewheel', function(event){
					controls.onMouseWheel(event);
					controls.update();
					renderer.render(scene, camera);
				}, false);

				document.addEventListener('mousemove', function(event){
					if (controls.get_state() === 0){
						controls.onMouseMove(event);
						controls.update();
						requestAnimationFrame(function(){
							renderer.render(scene, camera);
						});
					}
				}, false);
				document.addEventListener('mouseup', function(event){
					controls.onMouseUp(event);
					controls.update();
					// renderer.render(scene, camera);
				}, false);
				// controls.domElement.addEventListener( 'DOMMouseScroll', controls.onMouseWheel, false );
			},
			render : function(callback){
				var self = this;

				controls.update();

				callback && callback();
				renderer.render(scene, camera);

				setTimeout(function(){

					requestAnimationFrame(function(){
						self.render(callback);
					});
				}, 1000 / 30);
			},
			get_scene : function(){return scene},
			get_renderer : function(){ return renderer },
			get_camera : function() { return camera; },
			scene : function(){

			},
			directional_light : function(color){
				var light = new THREE.DirectionalLight(color);
				scene.add(light);
				return light;
			},
			load_skybox : function(){
				var skyGeometry = new THREE.SphereGeometry( 5000, 50, 50 );

				var texture = new THREE.Texture();
				var loader = new THREE.ImageLoader();

				loader.load('/static/assets/starfield.png', function(image){
					texture.needsUpdate = true;
					texture.image = image;
				});

				var material = new THREE.MeshLambertMaterial({
					color : 0xffffff,
					map : texture,
					side:THREE.BackSide
				});

				var skyBox = new THREE.Mesh(skyGeometry, material);
				scene.add(skyBox);

			},
			load_model : function(filename){
				var deferred = $q.defer();

				var loader = new THREE.OBJLoader(manager);
				loader.load( '/static/assets/' + filename, function ( object ) {
					deferred.resolve(object);
				}, function ( xhr ) {
					if (xhr.lengthComputable) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log(Math.round(percentComplete, 2) + '% downloaded');
					}
				}, function(response){
					console.info('error', response);
					deferred.reject(response);
				});

				return deferred.promise;
			},
			load_texture : function(filename){
				var deferred = $q.defer();

				var texture = new THREE.Texture();

				var loader = new THREE.ImageLoader(manager);
				loader.load( '/static/assets/' + filename, function(image) {
					texture.needsUpdate = true;
					texture.image = image;
					deferred.resolve(texture);
				});

				return deferred.promise;
			}
		};
	}]);
})();
