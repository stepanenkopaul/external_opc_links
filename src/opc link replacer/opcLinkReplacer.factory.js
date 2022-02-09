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
        var service                         = this;
        var x2js                            = new X2JS();

        service.replacedTagsAmount            = 0;
        service.jsonArea                      = "";
        service.xmlArea                       = "";
        service.xmlAreaResult                 = "";
        service.messages_ChooseTheFile        = false;
        service.messages_ChooseTheFileText    = "";
        service.messages_NoDataToExport       = false;
        service.messages_NoDataToExportText   = "";
        service.messages_importedFileName     = "";
   
        service.settings_plcResourceName             = "";
        service.settings_fbResourceName              = ""; 
        service.settings_repeatedPartName            = "";
        service.settings_linkVariablesContainer      = "";
        service.settings_externalSourcePrefixName    = "";
        service.settings_delimiterPattern            = "";
        service.settings_externalLinkResource        = "";
        service.settings_fileName                    = "";

        service.settings_oneDigitPrefix             = "";
        service.settings_twoDigitPrefix             = "";

        //----------- service functions
        service.returnReplacedTagsAmount = function(){
            return service.replacedTagsAmount;
        }

        service.readFile = function(){
            service.messages_ChooseTheFile        = false;
            service.messages_ChooseTheFileText    = "";

            var f = document.getElementById('input__file').files[0], r = new FileReader();
          

            if(!f){
                service.messages_ChooseTheFile      = true;
                service.messages_ChooseTheFileText  = "Choose the file!";
                console.log("Choose the file");
                return;
            }
            r.onloadend = function(e) {
                var data = e.target.result;
                
                service.xmlArea = data;
                
            }
            r.readAsBinaryString(f);
            console.log("read file done");
            return true;
        }



        service.expFile = function(){
            var fileName = service.settings_fileName;

            service.xmlAreaResult = service.xmlAreaResult.replace(/\'/g, "\"");
            saveTextAsFile(service.xmlAreaResult, fileName);
            
            
        }

        service.convertXml2JSon = function(){
            service.jsonArea = JSON.stringify(x2js.xml_str2json(service.xmlArea));

            console.log("before");
            var jsonStructure           = JSON.parse(service.jsonArea);
            console.log(jsonStructure);

            console.log("xml=>json done");
            return true;
        }
        
        service.convertJSon2XML = function(){
            var jsonStructure           = JSON.parse(service.jsonArea);
            service.replacedTagsAmount  = 0;


            forechJSONEquipmentTree(jsonStructure);
            service.xmlAreaResult       = x2js.json2xml_str(jsonStructure);
            console.log("after");
            console.log(jsonStructure);
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
                        
                        // convert only tags, not structures
                        if(obj[k].toString().includes('.InterfaceInput.') || obj[k].toString().includes('.InterfaceOutput.')){
                            console.log("obj[k]= " + obj[k]);
                            obj[k] = ConvertDefaultLinkToExternal(obj[k]);
                            
                        }

                    

                    }
                }
            }
        }
        
        function ConvertDefaultLinkToExternal(textDefault){
            
            try{
                var tag = textDefault;//"PC001.ProductCarrier.fbController.InterfaceInput.SelectProgram.udnProgramID";
                var pcPrefix = "";
                if (tag.match(/PC[0-9]{3}/)){
                    pcPrefix = tag.replace("ProductCarrier.", "");

                    service.replacedTagsAmount = service.replacedTagsAmount + 1;
                }


                pcPrefix = pcPrefix.replace(/\./g, ".7:");
                pcPrefix = pcPrefix.replace(".7:fbController", "://Root.Objects.5:fastCenter&.fastPLC.3:Resources.7:PC.1:Programs.7:PC.7:fbController");
                
            }
            catch(e){
                alert("Error: " + e.description);
            }
            return pcPrefix;//textExternal;

            /*
            var textExternal                = "";
              
            var plcResourceName             = service.settings_plcResourceName;
            var fbResourceName              = service.settings_fbResourceName; 
            var repeatedPartName            = service.settings_repeatedPartName;
            var linkVariablesContainer      = service.settings_linkVariablesContainer;
            var externalSourcePrefixName    = service.settings_externalSourcePrefixName;
            var delimiterPattern            = service.settings_delimiterPattern;
            var externalLinkResource        = service.settings_externalLinkResource;

            var reMatch = new RegExp(plcResourceName);
  
            var repeatedPartsDictionary         = {};
            var tempRegExpDescription           = "";
            var counter                         = 0;
              
            var tempRegExpDescription           = plcResourceName + "\\." + fbResourceName + "\\."+ repeatedPartName +"\\[[0-9]{1}\\]";
            repeatedPartsDictionary[counter]    = {"regExp" : new RegExp(tempRegExpDescription), "prefix" : service.settings_oneDigitPrefix};
            counter++;
  
            var tempRegExpDescription           = plcResourceName + "\\." + fbResourceName + "\\."+ repeatedPartName +"\\[[0-9]{2}\\]";
            repeatedPartsDictionary[counter]    = {"regExp" : new RegExp(tempRegExpDescription), "prefix" : service.settings_twoDigitPrefix};
            counter++;


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
                textExternal = textExternal.replace(/\./g, delimiterPattern);
                textExternal = textExternal.replace("]" + delimiterPattern + linkVariablesContainer, externalLinkResource + linkVariablesContainer);
            
                
            }
            catch(e)
            {
                alert("Error: " + e.description);
            }
            return textExternal;
            */
        }

        function saveTextAsFile (data, filename){
            service.messageNoDataToExport   = false;
            if(!data) {
                service.messages_NoDataToExport       = true;
                service.messages_NoDataToExportText   = "There is no data to export!";
                console.log('Console.save: No data')
                return;
            }
            
            // add date to file name
            var today = new Date();
            var fileNameDate = "_" + today.toLocaleDateString() + "_" + today.toLocaleTimeString();
            
            console.log("filename1: " + filename);

            if((!filename)) filename = service.messages_importedFileName;
            
            console.log("filename2: " + filename);
            console.log("filename2: " + service.messages_importedFileName);

            filename = filename.replace(/\.xml/g, "");
            filename = filename + fileNameDate +".xml";



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

            service.messages_NoDataToExport       = true;
            service.messages_NoDataToExportText   = "File saved as " + filename;
            var today = new Date().toDateString();   //  07-06-2016 06:38:34
            console.log(today);
        }

    }

    
  
    })();