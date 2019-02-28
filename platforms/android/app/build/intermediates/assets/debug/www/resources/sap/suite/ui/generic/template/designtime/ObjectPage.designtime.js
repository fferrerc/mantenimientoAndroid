/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/suite/ui/generic/template/designtime/library.designtime","sap/suite/ui/generic/template/designtime/SmartForm.designtime","sap/suite/ui/generic/template/designtime/Group.designtime","sap/suite/ui/generic/template/designtime/ObjectPageLayout.designtime","sap/suite/ui/generic/template/designtime/ObjectPageSection.designtime","sap/suite/ui/generic/template/designtime/GroupElement.designtime","sap/suite/ui/generic/template/designtime/ObjectPageHeader.designtime","sap/suite/ui/generic/template/designtime/ObjectPageHeaderActionButton.designtime","sap/suite/ui/generic/template/designtime/ObjectPageDynamicHeaderTitle.designtime","sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils"],function(l,S,G,O,a,b,c,d,e,U,D){"use strict";var r=sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();var f=function(E,p){while(E){if(E.getMetadata().getElementName()===p){return true;}else if(E.getMetadata().getElementName()==='sap.ui.core.mvc.XMLView'){break;}else if(E.getParent()){E=E.getParent();}else{break;}}return false;};var g=function(t,p){var A=[];if(t.getId().indexOf("-template::ObjectPage::FooterToolbar")>-1){A=t.getContent();}else{A=t.getParent().getContent();}var C="addFooterActionButton";return D.addSettingsHandler(t,p,A,C);};return{'default':{controllerExtensionTemplate:"sap/suite/ui/generic/template/designtime/ObjectPageControllerExtensionTemplate"},'strict':{name:{singular:function(){return r.getText("FE_OBJECT_PAGE");}},aggregations:{content:{ignore:false,propagateRelevantContainer:true,propagateMetadata:function(E){if(E.getMetadata().getElementName){var t=U.getTemplatingInfo(E);switch(E.getMetadata().getElementName()){case"sap.uxap.ObjectPageLayout":return O.getDesigntime(E);case"sap.uxap.ObjectPageSection":return a.getDesigntime(E);case"sap.uxap.ObjectPageSubSection":return{aggregations:{customAnchorBarButton:{ignore:true}}};case"sap.ui.comp.smartform.SmartForm":if(f(E,"sap.uxap.ObjectPageSubSection")===true){return S.getDesigntime(E);}break;case"sap.ui.comp.smartform.Group":if(f(E,"sap.uxap.ObjectPageSubSection")===true){return G.getDesigntime(E);}break;case"sap.ui.comp.smartform.GroupElement":if(f(E,"sap.uxap.ObjectPageSubSection")===true){return b.getDesigntime(E);}break;case"sap.m.Table":return{aggregations:{items:{ignore:true}}};case"sap.ui.comp.smarttable.SmartTable":return{name:{singular:function(){return r.getText("FE_SMARTTABLE");}},aggregations:{items:{actions:null}}};case"sap.uxap.ObjectPageHeader":return c.getDesigntime(E);case"sap.uxap.ObjectPageDynamicHeaderTitle":return e.getDesigntime(E);case"sap.uxap.ObjectPageHeaderActionButton":var h=/.+(sap.suite.ui.generic.template.ObjectPage.view.Details::).+(?:--edit|--delete|--relatedApps|--template::Share|--template::NavigationUp|--template::NavigationDown|--fullScreen|--exitFullScreen|--closeColumn)$/;if(h.test(E.getId())||!t){return{actions:null};}return d.getDesigntime(E);case"sap.ui.comp.smartfield.SmartField":case"sap.ui.comp.navpopover.SmartLink":return{ignore:true};case"sap.ui.comp.smartfield.Configuration":case"sap.ui.comp.smartfield.ControlProposal":case"sap.ui.comp.smartfield.ObjectStatus":case"sap.ui.comp.navpopover.SemanticObjectController":case"sap.m.DraftIndicator":return{actions:null};case"sap.m.Button":if(E.getId().indexOf("::Determining")>=0){return{getCommonInstanceData:function(E){var t=U.getTemplatingInfo(E);if(t&&t.path){var T=t.target+'/'+t.path.substr(t.path.indexOf("com.sap.vocabularies.UI.v1.Identification"));return{target:T,annotation:t.annotation,qualifier:null};}},name:{singular:function(){return r.getText("FE_BUTTON");}},links:{developer:[{href:"/topic/1743323829e5474eb3829d2e9ab022ae",text:function(){return r.getText("FE_SDK_GUIDE_DETERMINING_ACTIONS");}}]},actions:{remove:{changeType:"removeHeaderAndFooterActionButton",changeOnRelevantContainer:true},rename:null,reveal:null,settings:{name:"Add Action Button",handler:g,icon:"sap-icon://add"}},annotations:{dataFieldForAction:{namespace:"com.sap.vocabularies.UI.v1",annotation:"DataFieldForAction",whiteList:{properties:["Action","Label","Criticality","InvocationGrouping"]},ignore:function(){var T=U.getTemplatingInfo(E);var R=T&&T.annotationContext;return!R||R.RecordType!=="com.sap.vocabularies.UI.v1.DataFieldForAction";},appliesTo:["Button"],links:{developer:[{href:"/topic/1743323829e5474eb3829d2e9ab022ae",text:function(){return r.getText("FE_SDK_GUIDE_DETERMINING_ACTIONS");}}]}},dataFieldForIBN:{namespace:"com.sap.vocabularies.UI.v1",annotation:"DataFieldForIntentBasedNavigation",whiteList:{properties:["Action","Label","Criticality","SemanticObject"]},ignore:function(){var T=U.getTemplatingInfo(E);var R=T&&T.annotationContext;return!R||R.RecordType!=="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";},appliesTo:["Button"],links:{developer:[{href:"/topic/1743323829e5474eb3829d2e9ab022ae",text:function(){return r.getText("FE_SDK_GUIDE_DETERMINING_ACTIONS");}}]}},importance:{namespace:"com.sap.vocabularies.UI.v1",annotation:"Importance",defaultValue:null,target:["Record"],appliesTo:["Button"],links:{developer:[{href:"/topic/1743323829e5474eb3829d2e9ab022ae",text:function(){return r.getText("FE_SDK_GUIDE_DETERMINING_ACTIONS");}}]}}}};}else{return{actions:null};}break;case"sap.m.OverflowToolbar":if(E.getId().indexOf("--template::ObjectPage::FooterToolbar")>=0){return{name:{singular:function(){return r.getText("FE_FOOTER_TOOLBAR");}},actions:{settings:{name:"Add Action Button",handler:g,icon:"sap-icon://add"},reveal:null},aggregations:{content:{propagateRelevantContainer:true,actions:{move:function(E){switch(E.getMetadata().getElementName()){case"sap.m.Button":if(E.getId().indexOf("::Determining")>=0){return"moveHeaderAndFooterActionButton";}}}}}}};}else{return{actions:null};}break;default:return{actions:null};}}else{return{actions:null};}}}},actions:{},annotations:{}}};},true);
