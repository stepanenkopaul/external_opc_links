(function () {
    'use strict';
    
    angular.module('OPCLinksReplaceApp')
    .controller('OPCLinksReplaceAppController', OPCLinkReplaceAppController);

    OPCLinkReplaceAppController.$inject = ['$rootScope','$element', '$timeout', 'OPCLinkReplaceAppFactory'];

    function OPCLinkReplaceAppController($rootScope, $element, $timeout, OPCLinkReplaceAppFactory) {
        
        var warningElem = $element.find('div.error');
        warningElem.slideDown(900);

        var controller          = this;

        // Use factory
        var factory = OPCLinkReplaceAppFactory();
        
        controller.showWarningChooseTheFile = function(){
            return factory.warningChooseTheFile;
        }

        controller.showWarningNoDataToExport = function(){
            return factory.warningNoDataToExport;
        }

        controller.returnReplacedTagsAmount = function(){
            
            $rootScope.replacedTagsAmount = factory.replacedTagsAmount;
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



    };

    
  
    })();