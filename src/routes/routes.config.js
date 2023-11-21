(function () {
    'use strict';
    
    angular.module('OPCLinksReplaceApp')
    .config(RoutesConfig);
      
    RoutesConfig.$inject = ['$routeProvider'];
    function RoutesConfig($routeProvider) {

        $routeProvider
        .when("/settings", {
            templateUrl : "src/routes/routes.settings.tab.html",
            activetab: 'settings',
            controller: routesController
        })
        .when("/main", {
            templateUrl : "src/routes/routes.main.tab.html",
            activetab: 'main',
            controller: routesController
        })
        .otherwise({
            redirectTo: '/main',
            templateUrl: "src/routes/routes.main.tab.html",
            activetab: 'main',
            controller: routesController
          });

    }

    function routesController($rootScope, $location) {

        $rootScope.currentTab = $location.path();
    }


    
  
    })();