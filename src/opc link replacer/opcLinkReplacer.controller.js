const projectsJSONFileName = 'src/opc link replacer/projectNamingRules.json';

(function () {
    'use strict';
    
    angular.module('OPCLinksReplaceApp')
    .controller('OPCLinksReplaceAppController', OPCLinkReplaceAppController)

    OPCLinkReplaceAppController.$inject = ['$scope', '$rootScope','$element', '$timeout', 'OPCLinkReplaceAppFactory'];

    function OPCLinkReplaceAppController($scope, $rootScope, $element, $timeout, OPCLinkReplaceAppFactory) {
 
        var controller  = this;
        
        // Use factory
        var factory = OPCLinkReplaceAppFactory();
       
        controller.$onInit = function() {

        controller.projectsJSON         = null;
        controller.projectNames         = [];
        controller.selectedProjectName  = null;

        function setProjectSettings(data){
            try{
                controller.projectsJSON = data;
                var firstProjectSelection = false;
                for(var i in controller.projectsJSON.projects){
                    if(!firstProjectSelection){
                        controller.selectedProjectName = controller.projectsJSON.projects[i].name;
                        firstProjectSelection = true;
                    }
                    
                    controller.projectNames.push(controller.projectsJSON.projects[i].name);
                }
    
                // move data to factory 
                $rootScope.selectedProjectName = factory.settings_selectedProjectName = controller.selectedProjectName;
                factory.settings_projectsJSON = controller.projectsJSON;
                factory.settings_projectNames = controller.projectNames;
            }
            catch(e){
                alert("Error: " + e.description);
            }
        }

        console.log("Initialization");

        fetch(projectsJSONFileName).then(res => res.json())
        .then(setProjectSettings); 

        };


        controller.showMessageChooseTheFile = function(){
            try{
                return factory.messages_ChooseTheFile;
            }
            catch(e){
                alert("Error: " + e.description);
            }  
        }

        controller.showMessageChooseTheFileText = function(){
            try{
                return factory.messages_ChooseTheFileText;
            }
            catch(e){
                alert("Error: " + e.description);
            }

            
        }

        controller.showMessageNoDataToExport = function(){
            try{
                return factory.messages_NoDataToExport;
            }
            catch(e){
                alert("Error: " + e.description);
            }
            
        }

        controller.showMessageNoDataToExportText = function(){
            try{
                return factory.messages_NoDataToExportText;
            }
            catch(e){
                alert("Error: " + e.description);
            }
            
        }

        controller.returnReplacedTagsAmount = function(){
            try{
                $rootScope.replacedTagsAmount = factory.replacedTagsAmount;
            }
            catch(e){
                alert("Error: " + e.description);
            }
            

          
        }

        controller.resetMessages = function(){
            try{
                factory.messages_ChooseTheFile        = false;
                factory.messages_ChooseTheFileText    = "";
                factory.messages_NoDataToExport       = false;
                factory.messages_NoDataToExportText   = "";
            }
            catch(e){
                alert("Error: " + e.description);
            }

        }

        controller.selectProject = function(){
            try{
                $rootScope.selectedProjectName = factory.settings_selectedProjectName = controller.selectedProjectName;
            }
            catch(e){
                alert("Error: " + e.description);
            }
            
        }

        
        // buttons
        controller.convertLinks = function(){
            try{

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
                                factory.messages_ChooseTheFile        = true;
                                factory.messages_ChooseTheFileText    = factory.replacedTagsAmount + " tags replaced";
                            }
                            
                        }, 100);
    
                        // then convert done
                        promises[2].then(function(){
                            $rootScope.$broadcast('Spinner:on', {on: false});
                        });
    
                        
    
                    });
                });
            }
            catch(e){
                alert("Error: " + e.description);
            }


        }

        controller.exportFile = function(){
            try{
                factory.expFile();
            }
            catch(e){
                alert("Error: " + e.description);
            }
            
        }

        // scope functions
        $scope.fileName= function(element) {
            try{
                $scope.$apply(function($scope) {
                    $scope.posterTitle                  = element.files[0].name;
                    factory.messages_importedFileName   = $scope.posterTitle;
                    console.log(factory.messages_importedFileName);
                    controller.resetMessages();
    
                });
            }
            catch(e){
                alert("Error: " + e.description);
            }

         };



    };

    
  
    })();