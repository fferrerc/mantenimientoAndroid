/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/ui/model/json/JSONModel','sap/ui/model/base/ManagedObjectModel','sap/ui/core/cache/CacheManager',"sap/base/Log",'sap/ui/core/mvc/View'],function(q,J,M,C,L){"use strict";function a(){this.currentPath='/';this.lastPath='';this.set=function(n){while(n.indexOf('../')===0){this.currentPath=this.currentPath.substr(0,this.currentPath.lastIndexOf(this.lastPath)-1);this.lastPath=this.currentPath.substr(this.currentPath.lastIndexOf('/')+1);n=n.substr(3);}if(n){this.lastPath=n;}this.currentPath+=n;L.info('Current path is now : '+this.currentPath);};this.get=function(){return this.currentPath;};}function c(p){var V=p.viewName,A=p.appComponent,e=p.entitySet,m=p.viewData,o=p.model.getMetaModel(),s=p.viewId,d=null,f;var P=b(V);var k=A.getMetadata().getName()+"_"+s+"_"+sap.ui.getCore().getConfiguration().getLanguageTag(),g=[];g.push(Promise.all([C.get(k),o.requestObject("/")]).then(function(r){var h=r[0];function i(u,n){var E=o.getETags();return new Promise(function(t,w){if(!E[u]){q.ajax(u,{method:'GET'}).then(function(R,T,x){if(n!==x.getResponseHeader('ETag')&&n!==x.getResponseHeader('Last-Modified')){t(false);}else{t(true);}},function(x,T,y){t(false);});}else if(n!==E[u]){t(false);}else{t(true);}});}function j(n){var t=[];Object.keys(n).forEach(function(u){t.push(i(u,n[u]));});return Promise.all(t);}if(h){return j(JSON.parse(h.newCacheKey)).then(function(n){f=h.newCacheKey;if(n.every(function(t){return t;})){d={keys:[h.oldCacheKey]};}else{d={keys:[f]};}});}else{f='initial';var E=o.getETags();Object.keys(E).forEach(function(u){if(!E[u]){f=null;}});d={keys:[f]};}}));g=g.concat(b("loadFirst"));return Promise.all(g).then(function(){var D=new J(sap.ui.Device),h=new J(A.getMetadata().getManifest()),i=new J(m),j=new J({currentPath:new a()}),n={type:"XML",async:true,preprocessors:{xml:{bindingContexts:{entitySet:e?o.createBindingContext("/"+e):null,viewData:m?i.createBindingContext("/"):null},models:{entitySet:o,'sap.ui.mdc.metaModel':o,'sap.fe.deviceModel':D,'manifest':h,'viewData':i,'metaPath':j}}},id:s,viewName:V,viewData:m,cache:d,height:"100%"};D.setDefaultBindingMode("OneWay");return A.runAsOwner(function(){var r=sap.ui.view(n);r.setModel(new M(r),"$view");return Promise.all(P).then(function(){return r.loaded();}).then(function(r){var t=JSON.stringify(o.getETags());if(f&&f!==t){var u={};u.newCacheKey=t;u.oldCacheKey=f;C.set(k,u);}return r;});});});}var l={"loadFirst":["sap.ui.mdc"],"sap.fe.templates.ListReport":["sap.m","sap.f","sap.ui.fl"],"sap.fe.templates.ObjectPage":["sap.m","sap.f","sap.uxap","sap.ui.layout"]};function b(V){var d=[];var e=l[V]||[];for(var i=0;i<e.length;i++){d.push(sap.ui.getCore().loadLibrary(e[i],{async:true}));}return d;}var v={create:c};return v;});
