'use strict';

virusApp.controller('UsersController', ['$scope', '$http', 'userResolve', function($scope, $http, userResolve){
	$scope.users = userResolve;
}]);
