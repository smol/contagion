(function(){
	'use strict';

	virusApp.controller('RootController', ['$scope', function($scope){

		$scope.createarmy_popup = false;

		$scope.show_popup = function(){
			$scope.createarmy_popup = true;
		};
	}]);
})();
