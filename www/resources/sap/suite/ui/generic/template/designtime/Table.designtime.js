sap.ui.define(["sap/ui/fl/changeHandler/ChangeHandlerMediator","sap/suite/ui/generic/template/designtime/library.designtime"],function(C){"use strict";var r=sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();var t={getDesigntime:function(e){return{name:{singular:function(){return r.getText("FE_TABLE");}},links:{guidelines:[{href:"/table-overview/",text:function(){return r.getText("FE_TABLE_GUIDE");}}]},aggregations:{items:{ignore:true},infoToolbar:{ignore:true},columns:{actions:{move:"moveTableColumns",addODataProperty:function(){var c=C.getAddODataFieldSettings(e);if(c){c.content.requiredLibraries="";return{changeType:"addTableColumn",changeOnRelevantContainer:true,changeHandlerSettings:c};}else{return{changeType:"addTableColumn",changeOnRelevantContainer:true};}}}}}};}};return t;});
