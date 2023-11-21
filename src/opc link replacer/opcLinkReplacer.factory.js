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

    

    function OPCLinkReplaceAppService() {
       
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
   
        
        service.settings_fileName                    = "";
        service.settings_selectedProjectName         = "";
        service.settings_projectNames                = [];
        service.settings_projectsJSON                = {};

    
        //----------- service functions
        service.returnReplacedTagsAmount = function(){
            try{
                return service.replacedTagsAmount;
            }
            catch(e){
                alert("Error: " + e.description);
            }
        }

        service.readFile = function(){
            try{
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
            catch(e){
                alert("Error: " + e.description);
            }
        }



        service.expFile = function(){
            try{
                var fileName = service.settings_fileName;
                service.xmlAreaResult = service.xmlAreaResult.replace(/\'/g, "\"");
                saveTextAsFile(service.xmlAreaResult, fileName);
            }
            catch(e){
                alert("Error: " + e.description);
            }
        }

        service.convertXml2JSon = function(){
            try{
                service.jsonArea = JSON.stringify(x2js.xml_str2json(service.xmlArea));
                //console.log("before");
               // var jsonStructure           = JSON.parse(service.jsonArea);
               // console.log(jsonStructure);
                console.log("xml=>json done");
                return true;
                
            }
            catch(e){
                alert("Error: " + e.description);
            }
        }
        
        service.convertJSon2XML = function(){
            try{
                var jsonStructure           = JSON.parse(service.jsonArea);
                service.replacedTagsAmount  = 0;
    
                forechJSONEquipmentTree(jsonStructure);
                //console.log(jsonStructsure);
                service.xmlAreaResult       = x2js.json2xml_str(jsonStructure);
                //console.log("after");
                //console.log(jsonStructure);
                console.log("json=>xml done");
                return true;
            }
            catch(e){
                alert("Error: " + e.description);
            }

            
        }



        //----------- called functions
        function forechJSONEquipmentTree(equipmentTree){
           try{
                for (var node in equipmentTree) {

                    // if node is object - go inside
                    if (typeof equipmentTree[node] === "object") {
                        forechJSONEquipmentTree(equipmentTree[node])
                    }    
                    
                    // search in ec_tag_param, no need to replace links for devices
                    if (node == "ec_tag_param"){

                        var isArray = Array.isArray(equipmentTree.ec_tag_param);
                        // only one tag inside structure
                        if(!isArray){
                            if(equipmentTree.ec_tag_param._plc_link){
                                var plcLink = equipmentTree.ec_tag_param._plc_link;
                                var plcLinkMatched = getSearchMarkers(plcLink);

                                if(plcLinkMatched){
                                    equipmentTree.ec_tag_param._plc_link = ConvertDefaultLinkToExternal(equipmentTree.ec_tag_param._plc_link);
                                }
                            }
                        }
                        // a few tags inside structure
                        else{
                            for (var tag in equipmentTree.ec_tag_param){
                                if(equipmentTree.ec_tag_param[tag]._plc_link){
                                    var plcLink = equipmentTree.ec_tag_param[tag]._plc_link;  
                                    var plcLinkMatched = getSearchMarkers(plcLink);

                                    if(plcLinkMatched){
                                        equipmentTree.ec_tag_param[tag]._plc_link = ConvertDefaultLinkToExternal(equipmentTree.ec_tag_param[tag]._plc_link);
                                    }
                                }
                            }
                        }
                    }

                }
           }
           catch(e){
                alert("Error: " + e.description);
            }

        }
        
        function ConvertDefaultLinkToExternal(textDefault){
            
            try{
                var tag         = textDefault;
                var pcPrefix    = "";
                  
                var regExp = getProjectAttributes("regExp");

                if (tag.match(regExp)){
                    
                    var matchPart   = tag.match(regExp)[0];
                    var updatedPart = matchPart.replace(getProjectAttributes("resourceNameFrom"), getProjectAttributes("resourceNameTo"));
                    updatedPart     = updatedPart.replace(getProjectAttributes("removedPart"), "");
                    
                    pcPrefix        = tag.replace(matchPart, updatedPart);
                    service.replacedTagsAmount = service.replacedTagsAmount + 1;
                }

                var rootFBName          = getProjectAttributes("rootFBName");
                var resourceNameInSAP   = getProjectAttributes("resourceNameInSAP");
                var programName         = getProjectAttributes("programName");

                pcPrefix = pcPrefix.replace(/\./g, ".7:");
                pcPrefix = pcPrefix.replace(/\[/g, ".7:[");
                pcPrefix = pcPrefix.replace(
                    (".7:" +rootFBName), 
                    ("://Root.Objects.5:fastCenter&.fastPLC.3:Resources.7:" + resourceNameInSAP +".1:Programs.7:" + programName + ".7:" + rootFBName)
                );
                //console.log(pcPrefix);
                return pcPrefix;
            }
            catch(e){
                alert("Error: " + e.description);

            }



        }

        function saveTextAsFile (data, filename){
            try{
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
            }
            catch(e){
                alert("Error: " + e.description);
            }

            
        }


        function getProjectAttributes(attribute){
            try{
                for(var i in service.settings_projectsJSON.projects){
                
                    if(service.settings_projectsJSON.projects[i].name == service.settings_selectedProjectName){
                        switch (attribute) {
                            case 'searchMarkers':
                              return service.settings_projectsJSON.projects[i].searchMarkers;
                              break;
                            case 'resourceNameFrom':
                                return service.settings_projectsJSON.projects[i].resourceNameFrom;
                                break;
                            case 'resourceNameTo':
                                return service.settings_projectsJSON.projects[i].resourceNameTo;
                                break;    
                            case 'resourceNameInSAP':
                                return service.settings_projectsJSON.projects[i].resourceNameInSAP;
                                break;       
                            case 'regExp':
                                return service.settings_projectsJSON.projects[i].regExp;
                                break;   
                            case 'rootFBName':
                                return service.settings_projectsJSON.projects[i].rootFBName;
                                break;     
                            case 'removedPart':
                                return service.settings_projectsJSON.projects[i].removedPart;
                                break;    
                            case 'programName':
                                return service.settings_projectsJSON.projects[i].programName;
                                break;   
                            default:
                              '';
                          }
                    }
                }
            }
            catch(e){
                alert("Error: " + e.description);
            }

        }

        function getSearchMarkers(plcLink){
            
            try{
                var plcLinkMatched = false;
                for(var project in service.settings_projectsJSON.projects){
                    
                    if(service.settings_projectsJSON.projects[project].name == service.settings_selectedProjectName){

                        var isArray = Array.isArray(service.settings_projectsJSON.projects[project].searchMarkers);

                        if(!isArray){
                            if(plcLink.includes(service.settings_projectsJSON.projects[project].searchMarkers)){
                                plcLinkMatched = true;
                                return plcLinkMatched;
                            } 
                        }
                        else{
                            for (var marker in service.settings_projectsJSON.projects[project].searchMarkers){
    
                                if(plcLink.includes(service.settings_projectsJSON.projects[project].searchMarkers[marker])){
                                    plcLinkMatched = true;
                                    return plcLinkMatched;
                                }   
                            }
                        }
 
                    }
                }
                
            }
            catch(e){
                
                alert("Error: " + e.description);
                return plcLinkMatched;
            }


        }

    }

    
  
    })();