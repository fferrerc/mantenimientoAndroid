/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/suite/ui/generic/template/designtime/Column.designtime","sap/suite/ui/generic/template/designtime/Table.designtime","sap/suite/ui/generic/template/designtime/library.designtime"],function(C,T){"use strict";var r=sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();return{'default':{controllerExtensionTemplate:"sap/suite/ui/generic/template/designtime/ListReportControllerExtensionTemplate",name:{singular:function(){return r.getText("FE_LIST_REPORT");}},aggregations:{content:{ignore:false,propagateMetadata:function(e){if(e.getMetadata().getElementName){switch(e.getMetadata().getElementName()){case"sap.ui.comp.smarttable.SmartTable":return{name:{singular:function(){return r.getText("FE_SMARTTABLE");}}};default:break;}}}}}},'strict':{name:{singular:function(){return r.getText("FE_LIST_REPORT");}},aggregations:{content:{ignore:false,propagateRelevantContainer:true,links:{guidelines:[{href:"/list-report-floorplan-sap-fiori-element/",text:function(){return r.getText("FE_LRP_GUIDE");}}]},propagateMetadata:function(e){if(e.getMetadata().getElementName){switch(e.getMetadata().getElementName()){case"sap.f.DynamicPage":return{name:{singular:function(){return r.getText("FE_DYNAMIC_PAGE");}},aggregations:{footer:{propagateRelevantContainer:true,propagateMetadata:function(e){if(e.getMetadata().getElementName()==="sap.m.OverflowToolbar"){return{name:{singular:function(){return r.getText("FE_FOOTER_TOOLBAR");}},aggregations:{content:{propagateRelevantContainer:true,propagateMetadata:function(e){switch(e.getMetadata().getElementName()){case"sap.m.ToolbarSpacer":return{actions:null};}}}}};}}}}};case"sap.m.Table":return T.getDesigntime(e);case"sap.m.Button":return{name:{singular:function(){return r.getText("FE_BUTTON");}}};case"sap.m.OverflowToolbarButton":return{aggregations:{settings:{ignore:true}},name:{singular:function(){return r.getText("FE_BUTTON");}},links:{developer:[{href:"/topic/8ba009d7b8434dc1a4948c9211e30c40.html",text:function(){return r.getText("FE_SDK_LRP_ACTION");}}],guidelines:[{href:"/table-bar/",text:function(){return r.getText("FE_TOOLBAR_GUIDE");}}]},annotations:{importance:{namespace:"com.sap.vocabularies.UI.v1",annotation:"Importance",target:["Record"],appliesTo:["OverflowToolbar/Button/OverflowToolbarLayoutData"]}}};case"sap.ui.comp.smartfilterbar.SmartFilterBar":case"sap.ui.layout.VerticalLayout":case"sap.ui.layout.AlignedFlowLayout":case"sap.m.OverflowToolbar":return;case"sap.m.MultiComboBox":return{aggregations:{"items":{ignore:true}}};case"sap.suite.ui.generic.template.lib.FlexEnabler":case"sap.ui.comp.smartvariants.SmartVariantManagement":case"sap.ui.comp.filterbar.FilterGroupItem":case"sap.m.MultiInput":case"sap.m.ToolbarSeparator":case"sap.m.ToolbarSpacer":case"sap.m.SearchField":case"sap.m.Title":case"sap.ui.comp.smartvariants.PersonalizableInfo":return{actions:null};case"sap.f.DynamicPageHeader":return{name:{singular:function(){return r.getText("FE_DYNAMIC_PAGE_HEADER");}}};case"sap.f.DynamicPageTitle":return{name:{singular:function(){return r.getText("FE_DYNAMIC_PAGE_TITLE");}},aggregations:{actions:{ignore:true},snappedContent:{ignore:true},content:{ignore:true},heading:{ignore:true}}};case"sap.ui.comp.smarttable.SmartTable":return{name:{singular:function(){return r.getText("FE_SMARTTABLE");}},aggregations:{"semanticKeyAdditionalControl":{ignore:true}},annotations:{phoneNumber:{ignore:true},emailAddress:{ignore:true},sortable:{ignore:true},filterable:{ignore:true},columnLabelOnProperty:{ignore:true},columnVisible:{ignore:true},columnCurrencyCode:{ignore:true},columnUnitOfMeasure:{ignore:true},columnUpperCase:{ignore:true},columnImportance:{ignore:true},columnDataField:{ignore:true},columnText:{ignore:true},textArrangement:{ignore:true},columnIsImageURL:{ignore:true},columnDataFieldWithUrl:{ignore:true},columnCriticality:{ignore:true},columnCriticalityRepresentationType:{ignore:true},columnCalendarDate:{ignore:true},lineItem:{ignore:true},semanticKey:{ignore:true},semanticObject:{ignore:true},headerLabel:{namespace:"com.sap.vocabularies.UI.v1",annotation:"HeaderInfo",target:["EntityType"],whiteList:{properties:["TypeNamePlural"]},appliesTo:["SmartTable/header"],links:{developer:[{href:"/topic/f9962074132a43db9e1381291f8f3af8.html",text:function(){return r.getText("FE_SDK_GUIDE_ST_HEADER");}}],guidelines:[]},group:["Appearance"]},presentationVariant:{ignore:true}}};case"sap.m.Column":return C.getDesigntime(e);default:return{actions:null};}}else{return{actions:null};}}}},actions:{},annotations:{}}};},true);
