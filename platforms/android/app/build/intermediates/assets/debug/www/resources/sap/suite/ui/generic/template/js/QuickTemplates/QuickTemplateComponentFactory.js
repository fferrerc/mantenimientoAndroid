sap.ui.define(["sap/ui/base/Object","sap/ui/core/UIComponent","sap/ui/model/resource/ResourceModel","sap/ui/core/mvc/ViewType","sap/ui/model/json/JSONModel","sap/ui/generic/app/ApplicationController","sap/base/Log"],function(B,U,R,V,J,A,L){"use strict";var f=B.extend("sap.suite.ui.generic.template.js.QuickTemplates.QuickTemplateComponentFactory");function e(o){var I=new R({bundleName:"sap/suite/ui/generic/template/QuickCreate/i18n/i18n"});var q=new R({bundleName:"sap/suite/ui/generic/template/QuickView/i18n/i18n"});I.enhance(q.getResourceBundle());var t=o.getModel("i18n");if(t){I.enhance(t.getResourceBundle());}o.setModel(I,"i18n");}function d(o){return o.getMetadata().getComponentName()+"::"+o.getViewName()+"::"+o.getEntitySet();}function c(o,s){var a=o.getTransactionController().getDraftController().getDraftContext().isDraftEnabled(o.getEntitySet());var S=null;var b=o.oContainer.getSettings();S=jQuery.extend({},b);delete S.appComponent;delete S.entitySet;delete S.navigationProperty;return new J({entitySet:o.getEntitySet(),entityType:s,"sap-ui-debug":window["sap-ui-debug"],isDraftEnabled:a,settings:S,manifest:o.getManifest()});}function C(o){return new Promise(jQuery.proxy(function(r,a){var v=null;var m=this.getModel().getMetaModel();m.loaded().then(jQuery.proxy(function(){var b=m.getODataEntitySet(this.getEntitySet());if(!b||!b.entityType){L.error("The specified entity set "+this.getEntitySet()+" was not found in loaded metadata of service");if(a){a();}return;}var s=d(this);v=sap.ui.getCore().byId(s);if(v){L.warning("View with ID: "+s+" already exists - old view is getting destroyed now!");try{v.destroy();}catch(g){L.warning("Error destroying view: "+g);}v=null;}var p=this.getComponentData()?this.getComponentData().preprocessorsData:null;v=sap.ui.view({async:false,viewData:{component:this},preprocessors:{xml:{bindingContexts:{meta:m.createBindingContext(m.getODataEntityType(b.entityType,true)),entitySet:m.createBindingContext(m.getODataEntitySet(this.getEntitySet(),true))},models:{meta:m,entitySet:m,parameter:c(this,b.entityType)},preprocessorsData:p}},id:s,type:V.XML,viewName:this.getViewName(),height:"100%"});r(v);},this));},o));}function i(){U.prototype.init.apply(this,arguments);this._oApplicationController=new A(this.getModel());}function E(){if(this._oApplicationController){this._oApplicationController.destroy();}this._oApplicationController=null;}f.createQuickTemplateComponent=function(o,a){var g={metadata:{library:"sap.suite.ui.generic.template",properties:{viewName:{type:"string",defaultValue:null},entitySet:{type:"string",defaultValue:null}}},getAppComponent:function(){return this;},onBeforeRendering:function(){var j=this.oContainer;var m=!this.createViewStarted&&this.getModel();if(m){m.getMetaModel().loaded().then(function(){if(!this.createViewStarted){this.createViewStarted=true;C(this).then(function(v){this.setAggregation("rootControl",v);if(this.oQuickCreateAPI){this.oQuickCreateAPI.fireQuickCreateViewCreated();}e(this);var k=this.getModel("i18n");if(k){v.setModel(k,"i18n");}j.invalidate();}.bind(this));}}.bind(this));}},getTransactionController:function(){return this._oApplicationController.getTransactionController();},getApplicationController:function(){return this._oApplicationController;}};var b=a.init;a.init=function(){i.apply(this,arguments);if(typeof b==="function"){b.apply(this,arguments);}};var h=a.exit;a.exit=function(){E.apply(this,arguments);if(typeof h==="function"){h.apply(this,arguments);}};jQuery.extend(true,g,a);return U.extend(o,g);};return f;});