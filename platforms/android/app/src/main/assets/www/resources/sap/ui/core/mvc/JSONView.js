/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','./View','./JSONViewRenderer','./EventHandlerResolver','sap/base/util/merge','sap/ui/base/ManagedObject','sap/ui/core/library','sap/ui/model/resource/ResourceModel','sap/base/Log','sap/base/util/LoaderExtensions'],function(q,V,J,E,m,M,l,R,L,a){"use strict";var b=l.mvc.ViewType;var c=V.extend("sap.ui.core.mvc.JSONView",{metadata:{library:"sap.ui.core"}});c.create=function(o){var p=m({},o);for(var O in p){if(O==='preprocessors'){delete p['preprocessors'];L.warning("JSView.create does not support the option preprocessors!");}}p.type=b.JSON;return V.create(p);};sap.ui.jsonview=function(i,v){return sap.ui.view(i,v,b.JSON);};c._sType=b.JSON;c.asyncSupport=true;c.prototype.initViewSettings=function(s){if(!s){throw new Error("mSettings must be given");}if(s.viewName&&s.viewContent){throw new Error("View name and view content are given. There is no point in doing this, so please decide.");}else if(!s.viewName&&!s.viewContent){throw new Error("Neither view name nor view content is given. One of them is required.");}var t=this;var i=function(){if((t._oJSONView.resourceBundleName||t._oJSONView.resourceBundleUrl)&&(!s.models||!s.models[t._oJSONView.resourceBundleAlias])){var o=new R({bundleName:t._oJSONView.resourceBundleName,bundleUrl:t._oJSONView.resourceBundleUrl,async:s.async});var B=o.getResourceBundle();if(B instanceof Promise){return B.then(function(){t.setModel(o,t._oJSONView.resourceBundleAlias);});}t.setModel(o,t._oJSONView.resourceBundleAlias);}};if(s.viewName){if(s.async){return this._loadTemplate(s.viewName,{async:true}).then(i);}else{this._loadTemplate(s.viewName);i();}}else if(s.viewContent){this.mProperties["viewContent"]=s.viewContent;if(typeof s.viewContent==="string"){this._oJSONView=q.parseJSON(s.viewContent);if(!this._oJSONView){throw new Error("error when parsing viewContent: "+s.viewContent);}}else if(typeof s.viewContent==="object"){this._oJSONView=s.viewContent;}else{throw new Error("viewContent must be a JSON string or object, but is a "+(typeof s.viewContent));}if(s.async){return Promise.resolve().then(i);}else{i();}}};c.prototype.onControllerConnected=function(C){var t=this;M.runWithPreprocessors(function(){t.applySettings({content:t._oJSONView.content},C);},{id:function(i){return t.createId(i);},settings:function(s){var o=this.getMetadata(),v=o.getJSONKeys(),k,d,K;for(k in s){if((K=v[k])!==undefined){d=s[k];switch(K._iKind){case 3:if(typeof d==="string"){s[k]=t.createId(d);}break;case 5:if(typeof d==="string"){s[k]=E.resolveEventHandler(d,C);}break;}}}}});};c.prototype._loadTemplate=function(t,o){var r=t.replace(/\./g,"/")+".view.json";if(!o||!o.async){this._oJSONView=a.loadResource(r);}else{var d=this;return a.loadResource(r,o).then(function(j){d._oJSONView=j;});}};c.prototype.getControllerName=function(){return this._oJSONView.controllerName;};return c;});
