(function () {
    'use strict';
    
    angular.module('OPCLinksReplaceApp')
    .controller('OPCLinksReplaceAppController', OPCLinkReplaceAppController)

    OPCLinkReplaceAppController.$inject = ['$scope', '$rootScope','$element', '$timeout', 'OPCLinkReplaceAppFactory'];

    function OPCLinkReplaceAppController($scope, $rootScope, $element, $timeout, OPCLinkReplaceAppFactory) {
 
        var controller  = this;
        
        // Use factory
        var factory = OPCLinkReplaceAppFactory();
       
        controller.$onInit = function () {
            controller.description_fileName                    = "Exported file name";
            controller.description_plcResourceName             = "PLC resource name";
            controller.description_fbResourceName              = "FB resource name";
            controller.description_repeatedPartName            = "Repeated part";
            controller.description_linkVariablesContainer      = "Link variables container (interface location)";
            controller.description_externalSourcePrefixName    = "External source prefix name";
            controller.description_delimiterPattern            = "Delimiter pattern";
            controller.description_externalLinkResource        = "External resource pattern";
            controller.description_oneDigitPrefix              = "One digit prefix";
            controller.description_twoDigitPrefix              = "Two digit prefix";


            controller.selected_fileName                    = false;
            controller.selected_plcResourceName             = false;
            controller.selected_fbResourceName              = false;
            controller.selected_repeatedPartName            = false;
            controller.selected_linkVariablesContainer      = false;
            controller.selected_externalSourcePrefixName    = false;
            controller.selected_delimiterPattern            = false;
            controller.selected_externalLinkResource        = false;
            controller.selected_oneDigitPrefix              = false;
            controller.selected_twoDigitPrefix              = false;

            factory.settings_fileName                   = controller.settings_fileName                  = "DefaultFile";
            factory.settings_plcResourceName            = controller.settings_plcResourceName           = "PCs_Physical";
            factory.settings_fbResourceName             = controller.settings_fbResourceName            = "ProductCarriers"; 
            factory.settings_repeatedPartName           = controller.settings_repeatedPartName          = "ProductCarrier";
            factory.settings_linkVariablesContainer     = controller.settings_linkVariablesContainer    = "fbController";
            factory.settings_externalSourcePrefixName   = controller.settings_externalSourcePrefixName  = "PC";
            factory.settings_delimiterPattern           = controller.settings_delimiterPattern          =  ".7:";
            factory.settings_externalLinkResource       = controller.settings_externalLinkResource      = "://Root.Objects.5:fastCenter&.fastPLC.3:Resources.7:PC.1:Programs.7:PC.7:";
            factory.settings_fileName                   = controller.settings_fileName                  = "DefaultFile";

            factory.settings_oneDigitPrefix             = controller.settings_oneDigitPrefix            = "00";
            factory.settings_twoDigitPrefix             = controller.settings_twoDigitPrefix            = "0";

            controller.example_defaultTagName           = "InterfaceInput.SelectProgram.usnPathID";
            controller.example_pcNum                    = "1";
            controller.example_digitPrefix              = "00";
            controller.example_pcNumInArray             = "[" + controller.example_pcNum + "]";
            controller.example_replacedTagName          = "fbController.7:InterfaceInput.7:SelectProgram.7:usnPathID";
            controller.example_replacedPCNum            = controller.settings_externalSourcePrefixName + controller.example_digitPrefix + controller.example_pcNum;
            

            console.log("Initialization");
          };



        // visualization
        //#region 
        controller.updateSettingsFileName = function(){
            factory.settings_fileName = controller.settings_fileName;
        }

        controller.focusFileName = function(){
            controller.selected_fileName = true;
        }

        controller.blurFileName = function(){
            controller.selected_fileName = false;
        }
        //#endregion

        //#region 
        controller.updateSettingsPlcResourceName = function(){
            factory.settings_plcResourceName = controller.settings_plcResourceName;
        }

        controller.focusPlcResourceName = function(){
            controller.selected_plcResourceName = true;
        }

        controller.blurPlcResourceName = function(){
            controller.selected_plcResourceName = false;
        }
        //#endregion

        //#region 
        controller.updateSettingsFbResourceName = function(){
            factory.settings_fbResourceName = controller.settings_fbResourceName;
        }
        
        controller.focusFbResourceName = function(){
            controller.selected_fbResourceName = true;
        }

        controller.blurFbResourceName = function(){
            controller.selected_fbResourceName = false;
        }
        //#endregion

        //#region 
        controller.updateSettingsRepeatedPartName = function(){
            factory.settings_repeatedPartName = controller.settings_repeatedPartName;
        }

        controller.focusRepeatedPartName = function(){
            controller.selected_repeatedPartName = true;
        }

        controller.blurRepeatedPartName = function(){
            controller.selected_repeatedPartName = false;
        }
        //#endregion


        //#region 
        controller.updateSettingsLinkVariablesContainer = function(){
            factory.settings_linkVariablesContainer = controller.settings_linkVariablesContainer;
        }

        controller.focusLinkVariablesContainer = function(){
            controller.selected_linkVariablesContainer = true;
        }

        controller.blurLinkVariablesContainer = function(){
            controller.selected_linkVariablesContainer = false;
        }
        //#endregion

        //#region 
        controller.updateSettingsExternalSourcePrefixName = function(){
            factory.settings_externalSourcePrefixName   = controller.settings_externalSourcePrefixName;
            controller.example_replacedPCNum            = controller.settings_externalSourcePrefixName + controller.settings_oneDigitPrefix + "1";
        }

        controller.focusExternalSourcePrefixName = function(){
            controller.selected_externalSourcePrefixName = true;
        }

        controller.blurExternalSourcePrefixName = function(){
            controller.selected_externalSourcePrefixName = false;
        }
        //#endregion

        //#region 
        controller.updateSettingsDelimiterPattern = function(){
            factory.settings_delimiterPattern   = controller.settings_delimiterPattern;
            controller.example_replacedTagName  = "fbController" + controller.settings_delimiterPattern + "InterfaceInput"  + controller.settings_delimiterPattern + "SelectProgram" + controller.settings_delimiterPattern + "usnPathID";
        }

        controller.focusDelimiterPattern = function(){
            controller.selected_delimiterPattern = true;
        }

        controller.blurDelimiterPattern = function(){
            controller.selected_delimiterPattern = false;
        }
        //#endregion

        //#region 
        controller.updateSettingsExternalLinkResource = function(){
            factory.settings_externalLinkResource = controller.settings_externalLinkResource;
        }

        controller.focusExternalLinkResource = function(){
            controller.selected_externalLinkResource = true;
        }

        controller.blurExternalLinkResource = function(){
            controller.selected_externalLinkResource = false;
        }
        //#endregion

        //#region 
        controller.updateSettingsOneDigitPrefix = function(){
            factory.settings_oneDigitPrefix     = controller.settings_oneDigitPrefix;
            controller.example_digitPrefix      = controller.settings_oneDigitPrefix;
            controller.example_replacedPCNum    = controller.settings_externalSourcePrefixName + controller.example_digitPrefix + controller.example_pcNum;

        }

        controller.focusOneDigitPrefix = function(){
            controller.selected_oneDigitPrefix  = true;
            controller.example_pcNum            = "1";
            controller.example_pcNumInArray     = "[" + controller.example_pcNum + "]";
            controller.example_digitPrefix      = "00";
            controller.example_replacedPCNum    = controller.settings_externalSourcePrefixName + controller.example_digitPrefix + controller.example_pcNum;
            controller.updateSettingsOneDigitPrefix();
        }

        controller.blurOneDigitPrefix = function(){
            controller.selected_oneDigitPrefix  = false;
            controller.example_pcNum            = "1";
            controller.example_digitPrefix      = "00";
        }
        //#endregion

        //#region 
        controller.updateSettingsTwoDigitPrefix = function(){
            factory.settings_twoDigitPrefix     = controller.settings_twoDigitPrefix;
            controller.example_digitPrefix      = controller.settings_twoDigitPrefix;
            controller.example_replacedPCNum    = controller.settings_externalSourcePrefixName + controller.example_digitPrefix + controller.example_pcNum;
        }

        controller.focusTwoDigitPrefix = function(){
            controller.selected_twoDigitPrefix = true;
            controller.example_pcNum            = "10";
            controller.example_pcNumInArray     = "[" + controller.example_pcNum + "]";
            controller.example_digitPrefix      = "0";
            controller.example_replacedPCNum    = controller.settings_externalSourcePrefixName + controller.example_digitPrefix + controller.example_pcNum;

            controller.updateSettingsTwoDigitPrefix();
        }

        controller.blurTwoDigitPrefix = function(){
            controller.selected_twoDigitPrefix = false;
            controller.example_pcNum            = "10";
            controller.example_digitPrefix      = "0";
        }
        //#endregion


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