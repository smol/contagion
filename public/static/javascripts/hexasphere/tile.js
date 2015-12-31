(function() {
	'use strict';

	virusApp.factory('Tile', [function() {
		var Tile = function(centerPoint, hexSize) {

			if (hexSize == undefined) {
				hexSize = 1;
			}

			hexSize = Math.max(.01, Math.min(1.0, hexSize));

			this.centerPoint = centerPoint;
			this.faces = centerPoint.getOrderedFaces();
			this.boundary = [];

			this.triangles = [];

			for (var f = 0; f < this.faces.length; f++) {
				this.boundary.push(this.faces[f].getCentroid().segment(this.centerPoint, hexSize));
			}
		};

		Tile.prototype.getLatLon = function(radius, boundaryNum) {
			var point = this.centerPoint;
			if (typeof boundaryNum == "number" && boundaryNum < this.boundary.length) {
				point = this.boundary[boundaryNum];
			}
			var phi = Math.acos(point.y / radius); //lat
			var theta = (Math.atan2(point.x, point.z) + Math.PI + Math.PI / 2) % (Math.PI * 2) - Math.PI; // lon

			// theta is a hack, since I want to rotate by Math.PI/2 to start.  sorryyyyyyyyyyy
			return {
				lat: 180 * phi / Math.PI - 90,
				lon: 180 * theta / Math.PI
			};
		};

		Tile.prototype.toggle = function(state, config) {
			// this.material.uniforms = {
			// 	selected : { type : 'i', value : 1 }
			// };
			this.material.uniforms.selected.value = 1;
			this.material.uniforms.selected.needsUpdate = true;
			// if (!state) {
			// 	this.border.visible = true;
			// 	this.mesh.visible = false;
			// 	this.is_visible = false;
			// } else {
			// 	this.border.visible = false;
			// 	this.mesh.visible = true;
			// 	this.is_visible = true;
			// }

		};

		Tile.prototype.geometry = function(vertex_shader, fragment_shader) {
			var geometry = new THREE.Geometry();

			for (var j = 0; j < this.boundary.length; j++) {
				var bp = this.boundary[j];
				geometry.vertices.push(new THREE.Vector3(bp.x, bp.y, bp.z));
			}

			geometry.vertices.push(new THREE.Vector3(this.boundary[0].x, this.boundary[0].y, this.boundary[0].z));

			geometry.faces.push(new THREE.Face3(0, 1, 2));
			geometry.faces.push(new THREE.Face3(0, 2, 3));
			geometry.faces.push(new THREE.Face3(0, 3, 4));
			geometry.faces.push(new THREE.Face3(0, 4, 5));

			geometry = new THREE.BufferGeometry().fromGeometry(geometry);

			geometry.addAttribute('center', new THREE.BufferAttribute(geometry.faces, 3));

			this.material = new THREE.ShaderMaterial({
				side: THREE.DoubleSide,
				uniforms: {
					selected : { type : 'i', value : 0 }
				},
				vertexShader : vertex_shader,
				fragmentShader : fragment_shader,
				transparent : true,
			});


			var group = new THREE.Object3D();

			this.mesh = new THREE.Mesh(geometry, this.material);
			var edges = new THREE.EdgesHelper(this.mesh, 0x00ff00);

			this.mesh.userData = this;
			group.add(this.mesh);
			group.add(edges);
			return group;
		};

		Tile.prototype.scaledBoundary = function(scale) {

			scale = Math.max(0, Math.min(1, scale));

			var ret = [];
			for (var i = 0; i < this.boundary.length; i++) {
				ret.push(this.centerPoint.segment(this.boundary[i], 1 - scale));
			}

			return ret;
		};

		Tile.prototype.toString = function() {
			return this.centerPoint.toString();
		};

		return Tile;
	}]);
})();
