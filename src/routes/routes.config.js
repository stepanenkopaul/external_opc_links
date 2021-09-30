(function () {
    'use strict';
    
    angular.module('OPCLinksReplaceApp')
    .config(RoutesConfig);
      
    RoutesConfig.$inject = ['$routeProvider'];
    function RoutesConfig($routeProvider) {

        $routeProvider
        .when("/main", {
            templateUrl : "src/routes/routes.main.tab.html",
            activetab: 'main',
            controller: routesController
        })
        .when("/settings", {
            templateUrl : "src/routes/routes.settings.tab.html",
            activetab: 'settings',
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