(function () {
    'use strict';
    
    angular.module('OPCLinksReplaceApp')
    .controller('OPCLinksReplaceAppController', OPCLinkReplaceAppController)

    OPCLinkReplaceAppController.$inject = ['$scope', '$rootScope','$element', '$timeout', 'OPCLinkReplaceAppFactory'];

    function OPCLinkReplaceAppController($scope, $rootScope, $element, $timeout, OPCLinkReplaceAppFactory) {
        
        var controller = this;

        // Use factory
        var factory = OPCLinkReplaceAppFactory();
        
        controller.showMessageChooseTheFile = function(){
            return factory.messageChooseTheFile;
        }

        controller.showMessageChooseTheFileText = function(){
            return factory.messageChooseTheFileText;
        }

        controller.showMessageNoDataToExport = function(){
            return factory.messageNoDataToExport;
        }

        controller.showMessageNoDataToExportText = function(){
            return factory.messageNoDataToExportText;
        }

        controller.returnReplacedTagsAmount = function(){
            $rootScope.replacedTagsAmount = factory.replacedTagsAmount;
        }

        controller.resetMessages = function(){
            factory.messageChooseTheFile        = false;
            factory.messageChooseTheFileText    = "";
            factory.messageNoDataToExport       = false;
            factory.messageNoDataToExportText   = "";
        }

        controller.convertLinks = function(){

            var promises = [];

            // read file
            promises[0] = $timeout(function(){
                factory.readFile();
            }, 100);

            // then read file done => 
            promises[0].then(function(value){
                
                // enable the spinner, convert xml to json
                $rootScope.$broadcast('Spinner:on', {on: true});

                promises[1] = $timeout(function(){   
                    factory.convertXml2JSon();
                }, 100);
    
                // then convert done
                promises[1].then(function(){
                    
                    // convert json to xml
                    promises[2] = $timeout(function(){
                        factory.convertJSon2XML();

                        if(factory.replacedTagsAmount != 0){
                            factory.messageChooseTheFile        = true;
                            factory.messageChooseTheFileText    = factory.replacedTagsAmount + " tags replaced";
                        }
                        
                    }, 100);

                    // then convert done
                    promises[2].then(function(){
                        $rootScope.$broadcast('Spinner:on', {on: false});
                    });

                    

                });
            });

        }

        controller.exportFile = function(){
            factory.expFile();
        }

        // scope functions
        $scope.fileName= function(element) {
            $scope.$apply(function($scope) {
                $scope.posterTitle = element.files[0].name;
                factory.importedFileName = $scope.posterTitle;
                controller.resetMessages();

            });
         };



    };

    
  
    })();