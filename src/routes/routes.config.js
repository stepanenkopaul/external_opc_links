(function () {
    'use strict';
    
    angular.module('OPCLinksReplaceApp')
    .config(RoutesConfig);
      
    RoutesConfig.$inject = ['$routeProvider'];
    function RoutesConfig($routeProvider) {
    
        $routeProvider
        .when("/", {
            templateUrl : "src/routes/routes.main.tab.html"
        })
        .when("/settings", {
            templateUrl : "src/routes/routes.settings.tab.html"
        });
    }
  
    })();