// js/script.js
'use strict';


/**
 * Déclaration de l'application routeApp
 */
var virusApp = angular.module('virusApp', [
	// Dépendances du "module"
	'ui.router'
]);

virusApp.run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
	}]
);
