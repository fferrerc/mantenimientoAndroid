/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global",'sap/ui/core/mvc/ControllerExtension',"sap/m/MessagePage","sap/m/Link","sap/m/MessageBox","sap/ui/core/routing/HashChanger","sap/fe/viewFactory","sap/ui/model/json/JSONModel","sap/base/Log"],function(q,C,M,L,a,H,v,J,b){'use strict';var u;var P;var E=C.extend('sap.fe.controllerextensions.Routing',{navigateToContext:function(c,p){p=p||{};var r=this._getOwnerComponent().getRootControl(),i=c&&c.getBinding().getMetadata().getName()==="sap.ui.model.odata.v4.ODataListBinding",s;if(c.getIndex()===undefined||c.isTransient()){u=c;}if(i){P=c.getBinding();}if(!p.noHistoryEntry&&r&&r.getMetadata().getName()==="sap.m.NavContainer"){r.setBusy(true);}if(p.useCanonicalPath){s=c.getCanonicalPath();}else{s=c.getPath();var d=c.getCanonicalPath();if(s.indexOf('/-1')!==-1){var U=d.split('(')[1];s=s.substring(0,s.indexOf('/-1'))+'('+U;}else{s=c.getPath();}}while(s.indexOf('/')===0){s=s.substr(1);}if(p.noHistoryEntry){this._getHashChanger().replaceHash(s);}else{this._getHashChanger().setHash(s);}return Promise.resolve();},setBreadcrumbLinks:function(c,l){if(l.length&&c!==null){if((c===undefined)&&(l[0].getBindingContext()!==null)){l.forEach(function(o){o.setBindingContext(null);});return;}else if(c&&c.getPath()){var n=c.getPath();var s=l[l.length-1].getElementBinding()&&l[l.length-1].getElementBinding().getPath();if(s&&n.indexOf(s)>-1){return;}var A=this._getHashChanger().hrefForAppSpecificHash("");var p="",d=n.split("/");A=A.split("/")[0];d.shift();d.splice(-1,1);for(var i=0;i<l.length;i++){var o=l[i];p=p+"/"+d[i];o.setHref(A+p);o.bindElement({path:p,parameters:{$$groupId:'$auto.associations'}});}}}},createBreadcrumbLinks:function(p,m){if(m&&p){var l=[],s="",c=p.split("/");c.splice(-1,1);for(var i=0;i<c.length;i++){s=s+"/"+c[i];l.push({'oLinkContext':m.getMetaModel().getMetaContext(s.replace(/ *\([^)]*\) */g,"")+"/$Type")});}return l;}else{return[];}},navigateOutbound:function(o,c){var O=this._getOutbounds(),d=O[o];if(d){var p={};if(d.parameters){for(var s in d.parameters){if(d.parameters[s].value.format==="binding"){p[s]=c.getProperty(d.parameters[s].value.value);}}}var e=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("CrossApplicationNavigation");e&&e.toExternal({target:{semanticObject:d.semanticObject,action:d.action},params:p});return Promise.resolve();}else{throw new Error("outbound target "+o+" not found in cross navigation definition of manifest");}},navigateToMessagePage:function(e,p){var n=p.navContainer||this._getOwnerComponent().getRootControl();if(!this.oMessagePage){this.oMessagePage=new M({showHeader:false,icon:"sap-icon://message-error"});n.addPage(this.oMessagePage);}this.oMessagePage.setText(e);if(p.technicalMessage){this.oMessagePage.setCustomDescription(new L({text:p.description||p.technicalMessage,press:function(){a.show(p.technicalMessage,{icon:a.Icon.ERROR,title:p.title,actions:[a.Action.OK],defaultAction:a.Action.OK,details:p.technicalDetails||"",contentWidth:"60%"});}}));}else{this.oMessagePage.setDescription(p.description||'');}n.to(this.oMessagePage);},setDirtyState:function(c,d){if(typeof c==="string"){sap.fe.controllerextensions.Routing.mAppDirtyState[c]=d;}else{var p=c.getPath();if(p){if(p.indexOf('/-1')!==-1){p=p.substring(0,p.indexOf('/-1'));}else{p=p.substring(0,p.lastIndexOf('('));}if(p.lastIndexOf('/')!==-1){p=p.substring(0,p.lastIndexOf('/'));}sap.fe.controllerextensions.Routing.mAppDirtyState[p]=d;}else{b.error(p+" could not be marked dirty");}}},resetDirtyState:function(){sap.fe.controllerextensions.Routing.mAppDirtyState=[];},getDirtyState:function(p){return p?sap.fe.controllerextensions.Routing.mAppDirtyState[p]:sap.fe.controllerextensions.Routing.mAppDirtyState;},initializeRouting:function(A){var r=A.getRouter(),m=A.getMetadata(),U=m.getManifestEntry("sap.ui5"),t=U&&U.routing&&U.routing.targets,V={},n=false,R,c=this;r._oViews._getViewWithGlobalId=function(d){if(d.id.indexOf("---")){d.id=d.id.split("---")[1];}var T;var f=function(){if(!V[d.id]){var l=c.createBreadcrumbLinks(c._getHashChanger().getHash(),A.getModel());if(d.name){d.viewName=d.name;}V[d.id]=v.create({viewId:d.id,viewName:d.viewName,appComponent:A,entitySet:T.entitySet,viewData:q.extend(T.viewData,{links:l?l:[]}),model:A.getModel()});}return V[d.id];};for(var p in t){T=t[p];if(T.viewId===d.id){return{loaded:f,isA:function(){return true;}};}}};R=function(e){var B,s,o=q.noop,O=q.noop,d,f=e.getParameters().arguments,g=t[e.getParameter("config").target].viewId,h=V[g],i=A.getRootControl(),T="";if(!n&&i&&i.getMetadata().getName()==="sap.m.NavContainer"){i.attachAfterNavigate(function(){i.setBusy(false);});n=true;}if(Object.keys(f).length>0){T=e.getParameters().config.pattern;T=T.replace(":?query:","");for(var p in f){T=T.replace('{'+p+'}',f[p]);}T=T&&'/'+T;}if(h){h.then(function(j){B=j.getBindingContext();s=B&&B.getPath();if(s!==T){d=j.getController();if(d){o=d.onBeforeBinding&&d.onBeforeBinding.bind(d);O=d.onAfterBinding&&d.onAfterBinding.bind(d);}if(T){Promise.resolve(o()).then(function(){if(u){j.setBindingContext(u);O(u,{parentBinding:P});u=null;P=null;}else{var B=j.getModel().bindContext(T,null,{$$patchWithoutSideEffects:true}).getBoundContext(),D=function(e){var k=e&&e.getParameter("error");if(k){sap.ui.getCore().getLibraryResourceBundle("sap.fe",true).then(function(l){c.navigateToMessagePage(l.getText('SAPFE_DATA_RECEIVED_ERROR'),{title:l.getText('SAPFE_ERROR'),description:k,navContainer:A.getRootControl()});});}else{O(B,{parentBinding:P});P=null;}};B.getBinding().attachEventOnce("dataReceived",D);j.setBindingContext(B);}});}else if(T===""){O();}}else if(Object.keys(sap.fe.controllerextensions.Routing.mAppDirtyState).length>0){B=j.getModel().bindContext(T,null,{$$patchWithoutSideEffects:true}).getBoundContext();B.getBinding().refresh();j.setBindingContext(B);}});}};r.attachRouteMatched(R);r.initialize();},_getHashChanger:function(){if(!this.oHashChanger){this.oHashChanger=H.getInstance();}return this.oHashChanger;},_getOutbounds:function(){if(!this.outbounds){if(!this.manifest){this.manifest=this._getOwnerComponent().getMetadata().getManifest();}this.outbounds=this.manifest["sap.app"]&&this.manifest["sap.app"].crossNavigation&&this.manifest["sap.app"].crossNavigation.outbounds;}return this.outbounds;},_getOwnerComponent:function(){return this.base.getView().getController().getOwnerComponent();}});sap.fe.controllerextensions.Routing.mAppDirtyState={};return E;});