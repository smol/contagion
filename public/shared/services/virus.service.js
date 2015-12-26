(function(){
	'use strict';

	virusApp.service('virusService', ['$q', '$http', function($q, $http){
		return {
			all : function(){
				return $http.get('api/v1/virus/').then(function(response) {
					return response.data;
				});
			},
			add : function(data){
				return $http.post('api/v1/virus/', data).success(function(data, status, headers, config) {
					return data;
				});
			}
		};
	}]);
})();
