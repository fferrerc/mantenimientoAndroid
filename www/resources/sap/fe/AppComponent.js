/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/UIComponent","sap/m/NavContainer","sap/fe/core/BusyHelper","sap/fe/model/DraftModel","sap/fe/model/NamedBindingModel","sap/fe/controllerextensions/Routing","sap/ui/model/resource/ResourceModel","sap/base/Log"],function(U,N,B,D,a,R,b,L){"use strict";var A=U.extend("sap.fe.AppComponent",{metadata:{config:{fullWidth:true},routing:{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","controlId":"appContent","controlAggregation":"pages","async":true}},library:"sap.fe"},_getText:function(i){var r=sap.ui.getCore().getLibraryResourceBundle("sap.fe");return r.getText(i);},constructor:function(){this._oRouting=new R();this._oTemplateContract={oAppComponent:this};U.apply(this,arguments);return this.getInterface();},init:function(){var s,u;s=sap.ui.core.service.ServiceFactoryRegistry.get("sap.ushell.ui5service.ShellUIService");this._oTemplateContract.oShellServicePromise=(s&&s.createInstance())||Promise.reject();this._oTemplateContract.oShellServicePromise.catch(function(){L.warning("No ShellService available");});var m=this.getModel();if(m){u=U.prototype.init;a.upgrade(m).then(function(){u.apply(this,arguments);if(this._oTemplateContract.oBusyHelper){this._oTemplateContract.oBusyHelper.setBusy(this._oTemplateContract.oShellServicePromise);this._oTemplateContract.oBusyHelper.setBusyReason("initAppComponent",false);}D.isDraftModel(m).then(function(I){if(I){D.upgrade(m).then(function(){this.setModel(m.getDraftAccessModel(),"$draft");}.bind(this));}}.bind(this));}.bind(this));m.getMetaModel().requestObject("/$EntityContainer/").catch(function(e){this._oRouting.navigateToMessagePage(this._getText("SAPFE_APPSTART_TECHNICAL_ISSUES"),{title:this._getText('SAPFE_ERROR'),description:e.message,navContainer:this._oTemplateContract.oNavContainer});}.bind(this));}var i=new b({bundleName:"sap/fe/messagebundle",async:true});i.getResourceBundle().then(function(r){i.getResourceBundle=function(){return r;};});this.setModel(i,"sap.fe.i18n");},exit:function(){if(this._oTemplateContract.oNavContainer){this._oTemplateContract.oNavContainer.destroy();}},createContent:function(){if(!this._oTemplateContract.oNavContainer){this._oTemplateContract.oNavContainer=new N({id:"appContent"});this._oTemplateContract.oBusyHelper=new B(this._oTemplateContract);this._oTemplateContract.oBusyHelper.setBusyReason("initAppComponent",true,true);this._oRouting.initializeRouting(this);}return this._oTemplateContract.oNavContainer;}});return A;});
