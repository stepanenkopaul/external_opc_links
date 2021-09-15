(function () {
    'use strict';
    
    angular.module('OPCLinksReplaceApp', [])
    
    .controller('OPCLinksReplaceAppController', OPCLinkReplaceAppController)
    .directive('onReadFile', OnReadFileDirective);

    OPCLinkReplaceAppController.$inject = ['$scope'];
    function OPCLinkReplaceAppController($scope) {
        //var $ctrl = this;
        var x2js = new X2JS();

        $scope.dict = {};
 

        $scope.jsonArea = "";
        $scope.xmlArea = "";

        $scope.xmlAreaResult = "";
        $scope.content = "";
        
        $scope.parsedJSON;

        $scope.convertXml2JSon = function()  {
            $scope.jsonArea = JSON.stringify(x2js.xml_str2json($scope.xmlArea));
            console.log("xml=>json done");
        }
        $scope.convertJSon2XML = function()  {
            $scope.xmlArea = x2js.json2xml_str(JSON.parse($scope.jsonArea));
        }

        $scope.showContent = function(content){
            $scope.content = content;
            $scope.xmlArea = content;
        };

        $scope.add = function() {
            var f = document.getElementById('file').files[0],
                r = new FileReader();
        
            r.onloadend = function(e) {
              var data = e.target.result;
              //send your binary data via $http or $resource or do anything else with it
              $scope.xmlArea = data;
              console.log("add done");
            }
        
            r.readAsBinaryString(f);
        }

        function saveTextAsFile (data, filename){

            if(!data) {
                console.error('Console.save: No data')
                return;
            }
    
            if(!filename) filename = 'console.json'
    
            var blob = new Blob([data], {type: 'text/plain'}),
                e    = document.createEvent('MouseEvents'),
                a    = document.createElement('a')
            // FOR IE:
            
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            }
            else{
                var e = document.createEvent('MouseEvents'),
                    a = document.createElement('a');
            
                a.download = filename;
                a.href = window.URL.createObjectURL(blob);
                a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
                e.initEvent('click', true, false, window,
                    0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
            }
        }


        $scope.expFile = function() {
            var fileText = "I am the first part of the info being emailed.\r\nI am the second part.\r\nI am the third part.";
            var fileName = "newfile001.xml";
            $scope.xmlAreaResult = $scope.xmlAreaResult.replace(/\'/g, "\"");
            saveTextAsFile($scope.xmlAreaResult, fileName);
        }
        

        $scope.showDictionary = function(){

            var jsonStructure = JSON.parse($scope.jsonArea);

           // console.log(jsonStructure);

            function forechJSONTree(obj) {
                for (let k in obj) {
                  if (typeof obj[k] === "object") {
                    forechJSONTree(obj[k])
                  } else {
                    // base case, stop recurring
                    if (k == "_plc_link"){
                        obj[k] = ConvertDefaultLinkToExternal(obj[k]);
                        //console.log(k + ":" + obj[k]);
                        
                    }
                  }
                }
              }
              
            
              forechJSONTree(jsonStructure);
              $scope.xmlAreaResult = x2js.json2xml_str(jsonStructure);


           
            //var k = "_plc_link";
            //console.log($scope.jsonArea);
            // console.log(jsonStructure);
            // console.log(jsonStructure.equipment_configuration.ec_device._element_name);
            // console.log(jsonStructure.equipment_configuration.ec_device.ec_device._element_name);
            // console.log(jsonStructure.equipment_configuration.ec_device.ec_device.ec_device._element_name);
            // console.log(jsonStructure.equipment_configuration.ec_device.ec_device.ec_device.ec_device._element_name);
            

            // for(var key in jsonStructure){
            //     if (key.equipment_configuration.ec_device._element_name == "Tool"){
            //         console.log(key.equipment_configuration.ec_device);
            //     }
            // }

            // console.log(jsonStructure.equipment_configuration.ec_device._element_name["Tool"]);

            // var dict = jsonStructure.equipment_configuration.ec_device.ec_device.ec_device.ec_device.ec_device;


            // for(var key in dict) {
            //     if (dict[key]._element_name == "Interface"){
            //         console.log(key, dict[key]);
            //     }
                
            
            // }
            console.log("showDictionary done");
        }

        function ConvertDefaultLinkToExternal(textDefault){
                
                
            var textExternal = "";
            
            var plcResourceName         = "PCs_Physical";
            var fbResourceName          = "ProductCarriers"; 
            var repeatedPartName        = "ProductCarrier";
            var linkVariablesContainer  = "fbController";

            var reMatch = new RegExp(plcResourceName);

            var repeatedPartsDictionary = {};
            var tempRegExpDescription = "";
            var counter = 0;
            
            var tempRegExpDescription  = plcResourceName + "\\." + fbResourceName + "\\."+ repeatedPartName +"\\[[0-9]{1}\\]";
            repeatedPartsDictionary[counter] = {"regExp" : new RegExp(tempRegExpDescription), "prefix" : '00'};
            counter++;

            var tempRegExpDescription  = plcResourceName + "\\." + fbResourceName + "\\."+ repeatedPartName +"\\[[0-9]{2}\\]";
            repeatedPartsDictionary[counter] = {"regExp" : new RegExp(tempRegExpDescription), "prefix" : '0'};


            try
            {


                // rename PLC resources to template name
                if (!textDefault || !textDefault.match(reMatch)){
                    return textDefault || "";
                }
                else{
                    textDefault = plcResourceName + "." + textDefault.substring(textDefault.indexOf(fbResourceName + "."), textDefault.length);
            
                }
                
                var textPC = "PC";

               
              

                for(var key in repeatedPartsDictionary){
                    //console.log(repeatedPartsDictionary[key]);

                    if (repeatedPartsDictionary.hasOwnProperty(key)) {


                        if (textDefault.match(repeatedPartsDictionary[key].regExp)){
                            textPC += repeatedPartsDictionary[key].prefix;
                        }
                    } 
                      
                    



                }
                
                textExternal = textDefault.replace(plcResourceName + "." + fbResourceName + "." + repeatedPartName + "[", textPC);
                
                textExternal = textExternal.replace(/\[/g, ".[");
                textExternal = textExternal.replace(/\./g, ".7:");
                textExternal = textExternal.replace("].7:" + linkVariablesContainer, "://Root.Objects.5:fastCenter&.fastPLC.3:Resources.7:PC.1:Programs.7:PC.7:" + linkVariablesContainer);
            }
            catch(e)
            {
                alert("Error: " + e.description);
            }
            return textExternal;
        }


    };

    OnReadFileDirective.$inject = ['$parse'];
    function OnReadFileDirective ($parse) {
        return {
            restrict: 'A',
            scope: {
                onReadFile : "&"
            },
            link: function(scope, element, attrs) {
                element.on('change', function(e) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        scope.$apply(function() {
                           scope.onReadFile({$content:e.target.result});
                        });
                    };
                    reader.readAsText((e.srcElement || e.target).files[0]);
                });
            }
        };
    };
    
    })();



 