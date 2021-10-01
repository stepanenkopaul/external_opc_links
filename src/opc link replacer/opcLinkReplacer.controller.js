(function () {
    'use strict';
    
    angular.module('OPCLinksReplaceApp')
    .controller('OPCLinksReplaceAppController', OPCLinkReplaceAppController)

    OPCLinkReplaceAppController.$inject = ['$scope', '$rootScope','$element', '$timeout', 'OPCLinkReplaceAppFactory'];

    function OPCLinkReplaceAppController($scope, $rootScope, $element, $timeout, OPCLinkReplaceAppFactory) {
 
            // PCs_Physical.ProductCarriers.ProductCarrier[1].fbController.InterfaceInput.SelectProgram.usnPathID
            // PC001://Root.Objects.5.fastCenter&.fastPLC.3:Resources.7:PC.1:Programs.7:PC.7.fbController.7:InterfaceInput.7:SelectProgram.7:usnPathID

            // PCs_Physical.ProductCarriers.ProductCarrier[1].
            // PC001://Root.Objects.5.fastCenter&.fastPLC.3:Resources.7:PC.1:Programs.7:PC.7.
            

            //fbController.InterfaceInput.SelectProgram.usnPathID
            //fbController.7:InterfaceInput.7:SelectProgram.7:usnPathID
 
        var controller  = this;
        
        // Use factory
        var factory = OPCLinkReplaceAppFactory();
       
        controller.$onInit = function () {
            factory.settings_fileName                   = controller.settings_fileName                  = "DefaultFile";
            factory.settings_plcResourceName            = controller.settings_plcResourceName           = "PCs_Physical";
            factory.settings_fbResourceName             = controller.settings_fbResourceName            = "ProductCarriers"; 
            factory.settings_repeatedPartName           = controller.settings_repeatedPartName          = "ProductCarrier";
            factory.settings_linkVariablesContainer     = controller.settings_linkVariablesContainer    = "fbController";
            factory.settings_externalSourcePrefixName   = controller.settings_externalSourcePrefixName  = "PC";
            factory.settings_delimiterPattern           = controller.settings_delimiterPattern          =  ".7:";
            factory.settings_externalLinkResource       = controller.settings_externalLinkResource      = "://Root.Objects.5:fastCenter&.fastPLC.3:Resources.7:PC.1:Programs.7:PC.7:";
            factory.settings_fileName                   = controller.settings_fileName                  = "DefaultFile";

            controller.example_defaultTagName           = "InterfaceInput.SelectProgram.usnPathID";
            controller.example_pcNumInArray             = "[1]";
            controller.example_replacedTagName          = "fbController.7:InterfaceInput.7:SelectProgram.7:usnPathID";
            controller.example_replacedPCNum            = controller.settings_externalSourcePrefixName + "001";

            console.log("Initialization");
          };


        controller.updateSettingsFileName = function(){
            factory.settings_fileName = controller.settings_fileName;
        }

        controller.updateSettingsPlcResourceName = function(){
            factory.settings_plcResourceName = controller.settings_plcResourceName;
        }

        controller.updateSettingsFbResourceName = function(){
            factory.settings_fbResourceName = controller.settings_fbResourceName;
        }

        controller.updateSettingsRepeatedPartName = function(){
            factory.settings_repeatedPartName = controller.settings_repeatedPartName;
        }

        controller.updateSettingsLinkVariablesContainer = function(){
            factory.settings_linkVariablesContainer = controller.settings_linkVariablesContainer;
        }

        controller.updateSettingsExternalSourcePrefixName = function(){
            factory.settings_externalSourcePrefixName   = controller.settings_externalSourcePrefixName;
            controller.example_replacedPCNum            = controller.settings_externalSourcePrefixName + "001";
        }

        controller.updateSettingsDelimiterPattern = function(){
            factory.settings_delimiterPattern   = controller.settings_delimiterPattern;
            controller.example_replacedTagName  = "fbController" + controller.settings_delimiterPattern + "InterfaceInput"  + controller.settings_delimiterPattern + "SelectProgram" + controller.settings_delimiterPattern + "usnPathID";
        }

        controller.updateSettingsExternalLinkResource = function(){
            factory.settings_externalLinkResource = controller.settings_externalLinkResource;
        }


        // visualization
        controller.showSettingsPLCResourceName = function(){
            return factory.settings_plcResourceName;
        }

        controller.showMessageChooseTheFile = function(){
            return factory.messages_ChooseTheFile;
        }

        controller.showMessageChooseTheFileText = function(){
            return factory.messages_ChooseTheFileText;
        }

        controller.showMessageNoDataToExport = function(){
            return factory.messages_NoDataToExport;
        }

        controller.showMessageNoDataToExportText = function(){
            return factory.messages_NoDataToExportText;
        }

        controller.returnReplacedTagsAmount = function(){
            $rootScope.replacedTagsAmount = factory.replacedTagsAmount;
        }

        controller.resetMessages = function(){
            factory.messages_ChooseTheFile        = false;
            factory.messages_ChooseTheFileText    = "";
            factory.messages_NoDataToExport       = false;
            factory.messages_NoDataToExportText   = "";
        }

        
        // buttons
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

        controller.exportFile = function(){
            factory.expFile();
        }

        // scope functions
        $scope.fileName= function(element) {
            $scope.$apply(function($scope) {
                $scope.posterTitle                  = element.files[0].name;
                factory.messages_importedFileName   = $scope.posterTitle;
                console.log(factory.messages_importedFileName);
                controller.resetMessages();

            });
         };



    };

    
  
    })();