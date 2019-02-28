// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/_CommonDataModel/PersonalizationProcessor"],function(P){"use strict";var S="sap.ushell.services.CommonDataModel",a="sap.ushell.StaticAppLauncher",b="sap.ushell.DynamicAppLauncher";function C(A,c,p,s){var t=this,o=new jQuery.Deferred();function f(m){o.reject(m);}this._oAdapter=A;this._oPersonalizationProcessor=new P();this._oSitePromise=o.promise();this._oContentProviderIndex={};A.getSite().done(function(d){t._oOriginalSite=jQuery.extend(true,{},d);A.getPersonalization().done(function(e){t._oPersonalizationProcessor.mixinPersonalization(d,e).done(function(g){t._oPersonalizedSite=t._ensureCompleteSite(g);t._oPersonalizedSite=t._ensureStandardVizTypesPresent(t._oPersonalizedSite);o.resolve(t._oPersonalizedSite);}).fail(f);}).fail(f);}).fail(f);}C.prototype.getHomepageGroups=function(){var d=new jQuery.Deferred();this._oSitePromise.then(function(s){var g=(s&&s.site&&s.site.payload&&s.site.payload.groupsOrder)?s.site.payload.groupsOrder:[];d.resolve(g);});return d.promise();};C.prototype.getGroups=function(){var d=new jQuery.Deferred();this._oSitePromise.then(function(s){var g=[];Object.keys(s.groups).forEach(function(k){g.push(s.groups[k]);});d.resolve(g);});return d.promise();};C.prototype.getGroup=function(i){var d=new jQuery.Deferred();this._oSitePromise.then(function(s){var g=s.groups[i];if(g){d.resolve(g);}else{d.reject("Group "+i+" not found");}});return d.promise();};C.prototype.getSite=function(){return this._oSitePromise;};C.prototype.getGroupFromOriginalSite=function(g){var d=new jQuery.Deferred();if(typeof g==="string"&&this._oOriginalSite&&this._oOriginalSite.groups&&this._oOriginalSite.groups[g]){d.resolve(jQuery.extend(true,{},this._oOriginalSite.groups[g]));}else{d.reject("Group does not exist in original site.");}return d.promise();};C.prototype.save=function(){var d=new jQuery.Deferred(),t=this;this._oPersonalizationProcessor.extractPersonalization(this._oPersonalizedSite,this._oOriginalSite).done(function(e){if(e){t._oAdapter._storePersonalizationData(e).done(function(){d.resolve();}).fail(function(m){d.reject(m);});}else{d.resolve();}});return d.promise();};function l(){var p=sap.ushell.Container.getService("PluginManager");return p.loadPlugins("ContentProvider");}C.prototype._getUnreferencedCatalogApplications=function(e){var u={};var A=Object.keys(e.applications).map(function(s){return e.applications[s]["sap.app"].id;}).reduce(function(i,s){i[s]=true;return i;},{});var c=e.catalogs;Object.keys(c).forEach(function(s){var d=c[s].payload.appDescriptors;d.map(function(o){return o.id;}).filter(function(f){return!A[f];}).forEach(function(B){if(!u.hasOwnProperty(s)){u[s]={};}u[s][B]=true;});});return u;};C.prototype._formatUnreferencedApplications=function(c,u){return"One or more apps from "+c+" content provider are not listed among the applications section of the extended site and will be discarded - "+Object.keys(u).map(function(s){var B=Object.keys(u[s]).map(function(U){return"'"+U+"'";});return"From catalog '"+s+"': "+B.join(", ");}).join("; ");};C.prototype._removeUnreferencedApplications=function(e,u){Object.keys(e.catalogs).forEach(function(c){var o=e.catalogs[c].payload;var A=o.appDescriptors;o.appDescriptors=A.filter(function(d){return u[c]&&!u[c][d.id];});});};C.prototype.getExtensionSites=function(){var t=this;var d=new jQuery.Deferred();l().done(function(){var c=Object.keys(t._oContentProviderIndex),T=c.length;if(T===0){d.resolve([]);return;}var g=c.map(function(s,i){var o=t._oContentProviderIndex[s];var G;try{G=o.getSite();if(!G||typeof G.then!=="function"){throw"getSite does not return a Promise";}}catch(e){G=Promise.reject("call to getSite failed: "+e);}return G.then(function(s,E){var f=jQuery.extend(true,{},E);var u=t._getUnreferencedCatalogApplications(E);if(Object.keys(u).length>0){var h=t._formatUnreferencedApplications(s,u);jQuery.sap.log.error(h,null,S);t._removeUnreferencedApplications(f,u);}var L={providerId:s,success:true,site:f};d.notify(L);return L;}.bind(null,s),function(s,E){return{providerId:s,success:false,error:E};}.bind(null,s));});Promise.all(g).then(function(L){d.resolve(L);});});return d.promise();};C.prototype.registerContentProvider=function(i,s){if(this._oContentProviderIndex[i]){jQuery.sap.log.error("a content provider with ID '"+i+"' is already registered",null,S);return;}this._oContentProviderIndex[i]=s;jQuery.sap.log.debug("ContentProvider '"+i+"' was registered",null,S);};C.prototype._ensureCompleteSite=function(p){if(p.groups){var g=p.groups;Object.keys(g).forEach(function(k){if(!g[k]){delete g[k];}else{if(!g[k].payload){g[k].payload={};}if(!g[k].payload.links){g[k].payload.links=[];}if(!g[k].payload.tiles){g[k].payload.tiles=[];}if(!g[k].payload.groups){g[k].payload.groups=[];}}});}return p;};C.prototype.getPlugins=(function(){var d,e,p;e=function(s,o){var c,n=Object.keys(o).length;if(n===0){return{};}if(!o.hasOwnProperty("Shell-plugin")){jQuery.sap.log.error("Cannot find inbound with id 'Shell-plugin' for plugin '"+s+"'","plugin startup configuration cannot be determined correctly",S);return{};}if(n>1){jQuery.sap.log.warning("Multiple inbounds are defined for plugin '"+s+"'","plugin startup configuration will be determined using "+"the signature of 'Shell-plugin' inbound.",S);}c=jQuery.sap.getObject("signature.parameters",undefined,o["Shell-plugin"])||{};return Object.keys(c).reduce(function(r,N){var D=jQuery.sap.getObject(N+".defaultValue.value",undefined,c);if(typeof D==="string"){r[N]=D;}return r;},{});};d=function(o){Object.keys(o).filter(function(s){return typeof o[s]==="object";}).forEach(function(s){o[s]=d(o[s]);});return Object.freeze(o);};return function(o){if(o!==undefined){p=o;}if(p){return jQuery.when(p);}p={};return this.getSite().then(function(s){var A=s.applications||{};Object.keys(A).filter(function(c){return"plugin"===jQuery.sap.getObject("type",undefined,this[c]["sap.flp"]);},A).forEach(function(c){var f,g,h=this[c],i={};if(!jQuery.isPlainObject(h["sap.platform.runtime"])){jQuery.sap.log.error("Cannot find 'sap.platform.runtime' section for plugin '"+c+"'","plugin might not be started correctly","sap.ushell.services.CommonDataModel");}else if(!jQuery.isPlainObject(h["sap.platform.runtime"].componentProperties)){jQuery.sap.log.error("Cannot find 'sap.platform.runtime/componentProperties' section for plugin '"+c+"'","plugin might not be started correctly","sap.ushell.services.CommonDataModel");}else{i=h["sap.platform.runtime"].componentProperties;}p[c]={url:i.url,component:h["sap.ui5"].componentName};var j=jQuery.sap.getObject("crossNavigation.inbounds",undefined,h["sap.app"])||{};g=e(c,j);f=jQuery.extend(i.config||{},g);if(f){p[c].config=f;}if(i.asyncHints){p[c].asyncHints=i.asyncHints;}},A);return d(p);},function(E){return E;});};})();C.prototype._ensureStandardVizTypesPresent=function(s){if(!(s._version&&s._version.startsWith("3."))){return s;}if(!s.vizTypes){s.vizTypes={};}if(!s.vizTypes[a]){s.vizTypes[a]=jQuery.sap.loadResource("sap/ushell/components/tiles/cdm/applauncher/manifest.json");}if(!s.vizTypes[b]){s.vizTypes[b]=jQuery.sap.loadResource("sap/ushell/components/tiles/cdm/applauncherdynamic/manifest.json");}return s;};C.hasNoAdapter=false;return C;},true);
