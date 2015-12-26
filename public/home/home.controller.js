(function(){
	'use strict';

	virusApp.controller('HomeController', ['$scope', '$http', 'virusResolver', 'virusService', function($scope, $http, virusResolver, virusService){
		$scope.viruses = virusResolver;
		console.warn($scope.viruses);

		$scope.new_user = {
			email : null,
			password : null,
			retyped_password : null
		};

		$scope.tile_selected = function(tile){
			console.warn('tile_selected', tile);
		};

		// $scope.addentry = function(){
		// 	virusService.add({toto:'toto'});
		// };
	}]);
})();
