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
        }
        $scope.convertJSon2XML = function()  {
            $scope.xmlArea = x2js.json2xml_str(JSON.parse($scope.jsonArea));
        }

        $scope.showContent = function(content){
            $scope.content = content;
            $scope.xmlArea = content;
        };

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

            console.log(jsonStructure);

            function forechJSONTree(obj) {
                for (let k in obj) {
                  if (typeof obj[k] === "object") {
                    forechJSONTree(obj[k])
                  } else {
                    // base case, stop recurring
                    if (k == "_plc_link"){
                        obj[k] = ConvertDefaultLinkToExternal(obj[k]);
                        console.log(k + ":" + obj[k]);
                        
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

        }

        function ConvertDefaultLinkToExternal(textDefault)
			{
				var textExternal = "";
				try
				{
					if (!textDefault || !(textDefault.match(/PCs_Physical\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
										  textDefault.match(/PCs_Physical_2\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
										  textDefault.match(/PCs_Physical_3\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
										  textDefault.match(/PCs_Physical_4\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
										  textDefault.match(/PCs_Physical_5\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
										  textDefault.match(/PCs_Physical_6\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
										  textDefault.match(/PCs_Physical_7\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/)))
					{
						return textDefault || "";
					}
					
					var textPC = "PC";
					if (textDefault.match(/PCs_Physical\.ProductCarriers\.ProductCarrier\[[0-9]{1}\]/) ||
						textDefault.match(/PCs_Physical_2\.ProductCarriers\.ProductCarrier\[[0-9]{1}\]/) ||
						textDefault.match(/PCs_Physical_3\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
						textDefault.match(/PCs_Physical_4\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
						textDefault.match(/PCs_Physical_5\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
						textDefault.match(/PCs_Physical_6\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
						textDefault.match(/PCs_Physical_7\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/))
					{
						textPC += '00';
					}
					else if (textDefault.match(/PCs_Physical\.ProductCarriers\.ProductCarrier\[[0-9]{2}\]/) ||
							textDefault.match(/PCs_Physical_2\.ProductCarriers\.ProductCarrier\[[0-9]{2}\]/) ||
							textDefault.match(/PCs_Physical_3\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
							textDefault.match(/PCs_Physical_4\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
							textDefault.match(/PCs_Physical_5\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
							textDefault.match(/PCs_Physical_6\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/) ||
							textDefault.match(/PCs_Physical_7\.ProductCarriers\.ProductCarrier\[[0-9]{1,3}\]/))
					{
						textPC += '0';
					}
					
					textExternal = textDefault.replace("PCs_Physical.ProductCarriers.ProductCarrier[", textPC);
					textExternal = textExternal.replace("PCs_Physical_2.ProductCarriers.ProductCarrier[", textPC);
					textExternal = textExternal.replace("PCs_Physical_3.ProductCarriers.ProductCarrier[", textPC);
					textExternal = textExternal.replace("PCs_Physical_4.ProductCarriers.ProductCarrier[", textPC);
					textExternal = textExternal.replace("PCs_Physical_5.ProductCarriers.ProductCarrier[", textPC);
					textExternal = textExternal.replace("PCs_Physical_6.ProductCarriers.ProductCarrier[", textPC);
					textExternal = textExternal.replace("PCs_Physical_7.ProductCarriers.ProductCarrier[", textPC);
					
					textExternal = textExternal.replace(/\[/g, ".[");
					textExternal = textExternal.replace(/\./g, ".7:");
					textExternal = textExternal.replace("].7:fbController", "://Root.Objects.5:fastCenter&.fastPLC.3:Resources.7:PC.1:Programs.7:PC.7:fbController");
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



 