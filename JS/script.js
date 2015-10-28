// script.js
// ** Module creation **

// Module
var casinoApp = angular.module('casinoApp', ['ngRoute']);

//Configure routes
casinoApp.config(function($routeProvider){
	$routeProvider

		// route for home page
		.when('/',{
			templateUrl: 'views/home.html',
			controller: 'mainController'
		})

		// route for about page
		.when('/about',{
			templateUrl: 'views/about.html',
			controller: 'aboutController'
		})

		// route for contact page
		.when('/contact',{
			templateUrl: 'views/contact.html',
			controller: 'contactController'
		});
});

//Main Controller
casinoApp.controller('mainController', function($scope){

	$scope.message = 'Welcome to the casino';

});

//About Controller
casinoApp.controller('mainController', function($scope){

	$scope.message = 'About this app';

});

//Contact Controller
casinoApp.controller('mainController', function($scope){

	$scope.message = 'Talk to me';

});