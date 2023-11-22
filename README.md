About:
Utility supports changing of tag paths from internal OPC links to extenal OPC links.
Changing executes according replacement rules from projectNamingRules.json file.

How to use:
1. Chose you project.
2. Click on 'Choose the file' button and select exported xml file of Equipment configuration.
3. Click on 'Convert PLC links' button. If neccesary plc link are found you must see result about replaced tags count.
4. Click on 'Export file' button for exporting changed xml file.




How to add new project into projectNamingRules:

Replaced tags examples:
DynaSmart project
PC001.ProductCarrier.fbController.InterfaceInput.blnAxisXLockedByLidOpeners	
PC001://Root.Objects.5:fastCenter&.fastPLC.3:Resources.7:PC.1:Programs.7:PC.7:fbController.7:InterfaceInput.7:blnAxisLockedXByLidOpeners	

G-Plate project	
TransporterPLC.Transporters.fbTransporter[1].AlarmState.blnAlarm1	
Transporter1://Root.Objects.5:fastCenter&.fastPLC.3:Resources.7:TransporterPLC.1:Programs.7:Transporters.7:fbTransporter.7:[1].7:AlarmState.7:blnAlarm1	


{
    "name": "DynaSmart", -- unique name of project will be showed in project's combobox
    "searchMarkers": [ -- marker in plc link indicates the plc link for changing. attribute can contain like an array also single value
        ".ProductCarrier.fbController.InterfaceInput.",
        ".ProductCarrier.fbController.InterfaceOutput."
    ],
    "resourceNameTo": "PC", -- target's name can be not matched with resource name. Where is need to mark target name for external opc source
    "resourceNameFrom": "PC", -- target's name can be not matched with resource name. Where is need to mark target name for internal opc source (matched with resource name in linePLC project)
    "resourceNameInSAP": "PC", -- target's name in standalone project.
    "programName":"PC", - program's name in standalone project.
    "regExp": "(?:PC.*)\\.ProductCarrier\\.", -- regular expression for replace part of plc link from resource name till rootFbName
    "removedPart":"ProductCarrier.", -- the part will be deleted from defined by regExp group
    "rootFBName": "fbController" -- the fbName marker, will particapting in form of external plc link. As usual it's called fb in the program.
}

2023-11-21:
Utility support G-Plate project.