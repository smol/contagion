// js/script.js
'use strict';


/**
 * Déclaration de l'application routeApp
 */
var virusApp = angular.module('virusApp', [
	// Dépendances du "module"
	'ui.router',
	'ngMaterial'
]);

virusApp.run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
	}]
);

virusApp.config(['$mdThemingProvider', function($mdThemingProvider){
	$mdThemingProvider.theme('default').primaryPalette('blue');
}]);
