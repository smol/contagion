(function(){
	'use strict';

	/**
	 * Configuration du module principal : routeApp
	 */
	virusApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);

		$stateProvider
			.state('root', {
				abstract : true,
				templateUrl : 'root.html',
				controller : 'RootController'
			})
			.state('root.layout', {
				abstract:true,
				views : {
					'' : { template : '<div data-ui-view></div>' },
					'header' : {
						templateUrl : 'shared/header.html',
						controller : 'HeaderController'
					},
					'footer' : { templateUrl : 'shared/footer.html' }
				}
			})
			.state('root.layout.home', {
				url : '/',
				templateUrl : 'home/index.html',
				controller : 'HomeController',
				resolve : {
					virusResolver : ['virusService', function(virusService){
						return virusService.all();
					}]
				}
			})
			.state('root.layout.users', {
				url : '/users/',
				templateUrl : 'users/index.html',
				controller : 'UsersController',
				resolve : {
					userResolve : ['UserService', function(UserService){
						console.warn(UserService.all());
						return UserService.all();
					}]
				}
			});

		$urlRouterProvider.when('', '/');
	}]);
})();
