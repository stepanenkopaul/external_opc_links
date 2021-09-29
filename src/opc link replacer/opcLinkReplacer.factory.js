(function () {
    'use strict';
    
    angular.module('OPCLinksReplaceApp')
    .factory('OPCLinkReplaceAppFactory', OPCLinkReplaceAppFactory);
     
    function OPCLinkReplaceAppFactory() {
        var factory = function () {
          return new OPCLinkReplaceAppService();
        };
      
        return factory;
    }

    function OPCLinkReplaceAppService(){
        var service                     = this;
        var x2js                        = new X2JS();

        service.replacedTagsAmount      = 0;
        service.jsonArea                = "";
        service.xmlArea                 = "";
        service.xmlAreaResult           = "";
        service.warningChooseTheFile    = false;
        service.warningNoDataToExport   = false;
  
        //----------- service functions
        service.returnReplacedTagsAmount = function(){
            return service.replacedTagsAmount;
        }

        service.readFile = function(){
            service.warningChooseTheFile        = false;
            var f = document.getElementById('input__file').files[0], r = new FileReader();
          
            if(!f){
                service.warningChooseTheFile    = true;
                console.log("Choose the file");
                return;
            }
            r.onloadend = function(e) {
                var data = e.target.result;
                //send your binary data via $http or $resource or do anything else with it
                service.xmlArea = data;
                
            }
            r.readAsBinaryString(f);
            console.log("read file done");
            return true;
        }



        service.expFile = function(){
            var fileName = "newfile001.xml";
            service.xmlAreaResult = service.xmlAreaResult.replace(/\'/g, "\"");
            saveTextAsFile(service.xmlAreaResult, fileName);
            
        }

        service.convertXml2JSon = function(){
            service.jsonArea = JSON.stringify(x2js.xml_str2json(service.xmlArea));
            console.log("xml=>json done");
            return true;
        }
        
        service.convertJSon2XML = function(){
            var jsonStructure           = JSON.parse(service.jsonArea);
            service.replacedTagsAmount  = 0;

            forechJSONEquipmentTree(jsonStructure);
            service.xmlAreaResult       = x2js.json2xml_str(jsonStructure);
            console.log("json=>xml done");
            return true;
            
        }

        //----------- called functions
        function forechJSONEquipmentTree(obj){
            for (let k in obj) {
                if (typeof obj[k] === "object") {
                    forechJSONEquipmentTree(obj[k])
                } else {
                    // base case, stop recurring
                    if (k == "_plc_link"){
                        obj[k] = ConvertDefaultLinkToExternal(obj[k]);
                        

                    }
                }
            }
        }
        
        function ConvertDefaultLinkToExternal(textDefault){
            
            var textExternal = "";
              
            var plcResourceName             = "PCs_Physical";
            var fbResourceName              = "ProductCarriers"; 
            var repeatedPartName            = "ProductCarrier";
            var linkVariablesContainer      = "fbController";
            var externalSourcePrefixName    = "PC";

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
                  
                var textPC = externalSourcePrefixName;
  
                 
                for(var key in repeatedPartsDictionary){
  
                    if (repeatedPartsDictionary.hasOwnProperty(key)) {
  
  
                        if (textDefault.match(repeatedPartsDictionary[key].regExp)){
                             textPC += repeatedPartsDictionary[key].prefix;

                             // count tags
                            service.replacedTagsAmount = service.replacedTagsAmount + 1;
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

        function saveTextAsFile (data, filename){
            service.warningNoDataToExport   = false;
            if(!data) {
                service.warningNoDataToExport   = true;
                console.log('Console.save: No data')
                return;
            }
            
            if(!filename) filename = 'default.xml';
            
            var blob = new Blob([data], {type: 'text/plain'}),
                e    = document.createEvent('MouseEvents'),
                a    = document.createElement('a')
        
            if (window.navigator && window.navigator.msSaveOrOpenBlob){
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

    }

    
  
    })();