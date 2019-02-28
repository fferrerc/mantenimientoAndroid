/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/now","sap/base/util/Version","sap/base/assert","sap/base/Log","sap/ui/dom/getComputedStyleFix","sap/ui/dom/activeElementFix","sap/ui/dom/includeScript","sap/ui/dom/includeStylesheet","sap/ui/core/support/Hotkeys","sap/ui/security/FrameOptions","sap/ui/performance/Measurement","sap/ui/performance/trace/Interaction","sap/ui/base/syncXHRFix","sap/base/util/LoaderExtensions","sap/ui/Device","sap/ui/thirdparty/URI","sap/ui/thirdparty/jquery","sap/ui/thirdparty/jqueryui/jquery-ui-position","ui5loader-autoconfig","jquery.sap.stubs"],function(now,Version,assert,Log,getComputedStyleFix,activeElementFix,includeScript,includeStylesheet,SupportHotkeys,FrameOptions,Measurement,Interaction,syncXHRFix,LoaderExtensions,Device,URI,jQuery){"use strict";if(!jQuery){throw new Error("Loading of jQuery failed");}var ui5loader=sap.ui.loader;if(!ui5loader||!ui5loader._){throw new Error("The UI5 compatilbility module requires a UI5 specific AMD implementation");}var _ui5loader=ui5loader._;var _earlyLogs=[];function _earlyLog(l,m){_earlyLogs.push({level:l,message:m});}var oJQVersion=Version(jQuery.fn.jquery);(function(){jQuery.support=jQuery.support||{};jQuery.support.retina=Device.support.retina;jQuery.support.touch=Device.support.touch;jQuery.support.cssTransforms=true;jQuery.support.cssTransforms3d=true;jQuery.support.cssTransitions=true;jQuery.support.cssAnimations=true;jQuery.support.cssGradients=true;jQuery.support.flexBoxPrefixed=false;jQuery.support.flexBoxLayout=false;jQuery.support.newFlexBoxLayout=true;jQuery.support.ie10FlexBoxLayout=false;jQuery.support.hasFlexBoxSupport=true;}());if(Device.browser.msie){jQuery.support.cors=true;if(window.ActiveXObject!==undefined&&oJQVersion.inRange("1.11","2")){var fnCreateStandardXHR=function(){try{return new XMLHttpRequest();}catch(e){}};var fnCreateActiveXHR=function(){try{return new ActiveXObject("Microsoft.XMLHTTP");}catch(e){}};jQuery.ajaxSettings=jQuery.ajaxSettings||{};jQuery.ajaxSettings.xhr=function(){return!this.isLocal?fnCreateStandardXHR():fnCreateActiveXHR();};}}if(Device.browser.firefox){getComputedStyleFix();}if(Device.browser.msie||Device.browser.edge){activeElementFix();}if(Device.browser.firefox&&window.Proxy){syncXHRFix();}var oCfgData=window["sap-ui-config"]=(function(){function n(o){for(var i in o){var v=o[i];var b=i.toLowerCase();if(!o.hasOwnProperty(b)){o[b]=v;delete o[i];}}return o;}function l(u){var b="sap-ui-config.json",d;Log.warning("Loading external bootstrap configuration from \""+u+"\". This is a design time feature and not for productive usage!");if(u!==b){Log.warning("The external bootstrap configuration file should be named \""+b+"\"!");}var x=new XMLHttpRequest();x.addEventListener('load',function(e){if(x.status===200&&x.responseText){try{d=JSON.parse(x.responseText);}catch(f){Log.error("Parsing externalized bootstrap configuration from \""+u+"\" failed! Reason: "+f+"!");}}else{Log.error("Loading externalized bootstrap configuration from \""+u+"\" failed! Response: "+x.status+"!");}});x.open('GET',u,false);try{x.send();}catch(f){Log.error("Loading externalized bootstrap configuration from \""+u+"\" failed! Reason: "+f+"!");}d=d||{};d.__loaded=true;return d;}function g(){function b(o,f){var u=o&&o.getAttribute("src");var M=f.exec(u);if(M){return{tag:o,url:u,resourceRoot:M[1]||""};}}var r=/^((?:.*\/)?resources\/)/,d,S,i,R;R=b(document.querySelector('SCRIPT[src][id=sap-ui-bootstrap]'),r);if(!R){S=document.querySelectorAll('SCRIPT[src]');d=/^(.*\/)?(?:sap-ui-(core|custom|boot|merged)(?:-.*)?)\.js(?:[?#]|$)/;for(i=0;i<S.length;i++){R=b(S[i],d);if(R){break;}}}return R||{};}var _=g(),s=_.tag,c=window["sap-ui-config"];if(typeof c==="string"){c=l(c);}c=n(c||{});c.resourceroots=c.resourceroots||{};c.themeroots=c.themeroots||{};if(/(^|\/)(sap-?ui5|[^\/]+-all).js([?#]|$)/.test(_.url)){Log.error("The all-in-one file 'sap-ui-core-all.js' has been abandoned in favour of standard preloads."+" Please migrate to sap-ui-core.js and consider to use async preloads.");c.preload='sync';}if(s){var C=s.getAttribute("data-sap-ui-config");if(C){try{var p;try{p=JSON.parse("{"+C+"}");}catch(e){Log.error("JSON.parse on the data-sap-ui-config attribute failed. Please check the config for JSON syntax violations.");p=(new Function("return {"+C+"};"))();}Object.assign(c,n(p));}catch(e){Log.error("failed to parse data-sap-ui-config attribute: "+(e.message||e));}}for(var i=0;i<s.attributes.length;i++){var a=s.attributes[i];var m=a.name.match(/^data-sap-ui-(.*)$/);if(m){m=m[1].toLowerCase();if(m==='resourceroots'){Object.assign(c[m],JSON.parse(a.value));}else if(m==='theme-roots'){Object.assign(c.themeroots,JSON.parse(a.value));}else if(m!=='config'){c[m]=a.value;}}}}return c;}());var syncCallBehavior=0;if(oCfgData['xx-nosync']==='warn'||/(?:\?|&)sap-ui-xx-nosync=(?:warn)/.exec(window.location.search)){syncCallBehavior=1;}if(oCfgData['xx-nosync']===true||oCfgData['xx-nosync']==='true'||/(?:\?|&)sap-ui-xx-nosync=(?:x|X|true)/.exec(window.location.search)){syncCallBehavior=2;}ui5loader.config({reportSyncCalls:syncCallBehavior});if(syncCallBehavior&&oCfgData.__loaded){_earlyLog(syncCallBehavior===1?"warning":"error","[nosync]: configuration loaded via sync XHR");}if(oCfgData.noconflict===true||oCfgData.noconflict==="true"||oCfgData.noconflict==="x"){jQuery.noConflict();}jQuery.sap=jQuery.sap||{};jQuery.sap.Version=Version;jQuery.sap.now=now;var fnMakeLocalStorageAccessor=function(k,t,c){return function(v){try{if(v!=null||t==='string'){if(v){localStorage.setItem(k,t==='boolean'?'X':v);}else{localStorage.removeItem(k);}c(v);}v=localStorage.getItem(k);return t==='boolean'?v==='X':v;}catch(e){Log.warning("Could not access localStorage while accessing '"+k+"' (value: '"+v+"', are cookies disabled?): "+e.message);}};};jQuery.sap.debug=fnMakeLocalStorageAccessor.call(this,'sap-ui-debug','',function(d){alert("Usage of debug sources is "+(d?"on":"off")+" now.\nFor the change to take effect, you need to reload the page.");});jQuery.sap.setReboot=fnMakeLocalStorageAccessor.call(this,'sap-ui-reboot-URL','string',function(r){if(r){alert("Next time this app is launched (only once), it will load UI5 from:\n"+r+".\nPlease reload the application page now.");}});jQuery.sap.statistics=fnMakeLocalStorageAccessor.call(this,'sap-ui-statistics','boolean',function(u){alert("Usage of Gateway statistics "+(u?"on":"off")+" now.\nFor the change to take effect, you need to reload the page.");});jQuery.sap.log=Object.assign(Log.getLogger(),{Level:Log.Level,getLogger:Log.getLogger,getLogEntries:Log.getLogEntries,addLogListener:Log.addLogListener,removeLogListener:Log.removeLogListener,logSupportInfo:Log.logSupportInfo,LogLevel:Log.Level,getLog:Log.getLogEntries});var sWindowName=(typeof window==="undefined"||window.top==window)?"":"["+window.location.pathname.split('/').slice(-1)[0]+"] ";jQuery.sap.assert=function(r,m){if(!r){var M=typeof m==="function"?m():m;assert(r,sWindowName+M);}};oCfgData.loglevel=(function(){var m=/(?:\?|&)sap-ui-log(?:L|-l)evel=([^&]*)/.exec(window.location.search);return m&&m[1];}())||oCfgData.loglevel;if(oCfgData.loglevel){Log.setLevel(Log.Level[oCfgData.loglevel.toUpperCase()]||parseInt(oCfgData.loglevel));}Log.info("SAP Logger started.");jQuery.each(_earlyLogs,function(i,e){Log[e.level](e.message);});_earlyLogs=null;jQuery.sap.factory=function factory(p){function F(){}F.prototype=p;return F;};jQuery.sap.newObject=function newObject(p){return Object.create(p||null);};jQuery.sap.getter=function(v){return function(){return v;};};jQuery.sap.getObject=function(n,N,c){var o=c||window,a=(n||"").split("."),l=a.length,e=isNaN(N)?0:l-N,i;if(syncCallBehavior&&c===window){Log.error("[nosync] getObject called to retrieve global name '"+n+"'");}for(i=0;o&&i<l;i++){if(!o[a[i]]&&i<e){o[a[i]]={};}o=o[a[i]];}return o;};jQuery.sap.setObject=function(n,v,c){var o=c||window,N=(n||"").split("."),l=N.length,i;if(l>0){for(i=0;o&&i<l-1;i++){if(!o[N[i]]){o[N[i]]={};}o=o[N[i]];}o[N[l-1]]=v;}};jQuery.sap.measure=Measurement;jQuery.sap.measure.clearInteractionMeasurements=Interaction.clear;jQuery.sap.measure.startInteraction=Interaction.start;jQuery.sap.measure.endInteraction=Interaction.end;jQuery.sap.measure.getPendingInteractionMeasurement=Interaction.getPending;jQuery.sap.measure.filterInteractionMeasurements=Interaction.filter;jQuery.sap.measure.getAllInteractionMeasurements=Interaction.getAll;jQuery.sap.measure.getRequestTimings=function(){if(window.performance.getEntriesByType){return window.performance.getEntriesByType("resource");}return[];};jQuery.sap.measure.clearRequestTimings=function(){if(window.performance.clearResourceTimings){window.performance.clearResourceTimings();}};jQuery.sap.measure.setRequestBufferSize=function(s){if(window.performance.setResourceTimingBufferSize){window.performance.setResourceTimingBufferSize(s);}};var getModuleSystemInfo=(function(){var l=_ui5loader.logger=Log.getLogger("sap.ui.ModuleSystem",(/sap-ui-xx-debug(M|-m)odule(L|-l)oading=(true|x|X)/.test(location.search)||oCfgData["xx-debugModuleLoading"])?Log.Level.DEBUG:Log.Level.INFO),k=LoaderExtensions.getKnownSubtypes(),r;(function(){var s="";for(var t in k){s=(s?s+"|":"")+"(?:(?:"+k[t].join("\\.|")+"\\.)?"+t+")";}s="\\.(?:"+s+"|[^./]+)$";l.debug("constructed regexp for file sub-types :"+s);r=new RegExp(s);}());function u(N){if(/^jquery\.sap\./.test(N)){return N;}return N.replace(/\./g,"/");}jQuery.sap.getModulePath=function(m,s){return jQuery.sap.getResourcePath(u(m),s);};jQuery.sap.getResourcePath=function(R,s){if(arguments.length===1&&R!=''){var S=R.split(/\//);var m=r.exec(S[S.length-1]);if(m){s=m[0];S[S.length-1]=S[S.length-1].slice(0,m.index);R=S.join('/');}else{s="";}}return _ui5loader.getResourcePath(R,s);};jQuery.sap.registerModulePath=function registerModulePath(m,v){m=m.replace(/\./g,"/");v=v||'.';jQuery.sap.registerResourcePath(m,v);};jQuery.sap.registerResourcePath=function(R,v){if(!v){v={url:null};}if(!f[R]){var s;if(typeof v==="string"||v instanceof String){s=v;}else{s=v.url;if(v.final){f[R]=v.final;}}var o=_ui5loader.toUrl(R);var c;if(s!==o||v.final){c={paths:{}};c.paths[R]=s;ui5loader.config(c);l.info("jQuery.sap.registerResourcePath ('"+R+"', '"+s+"')"+(v['final']?" (final)":""));}}else{l.warning("jQuery.sap.registerResourcePath with prefix "+R+" already set as final. This call is ignored.");}};var f=Object.create(null);jQuery.sap.registerModuleShims=function(s){ui5loader.config({shim:s});};jQuery.sap.isDeclared=function isDeclared(m,i){var s=_ui5loader.getModuleState(u(m)+".js");return s&&(i||s>0);};jQuery.sap.isResourceLoaded=function isResourceLoaded(R){return!!_ui5loader.getModuleState(R);};jQuery.sap.getAllDeclaredModules=LoaderExtensions.getAllRequiredModules;var p={};for(var n in oCfgData.resourceroots){p[u(n)]=oCfgData.resourceroots[n]||".";}ui5loader.config({paths:p});var U=_ui5loader.getUrlPrefixes();l.info("URL prefixes set to:");for(var n in U){l.info("  "+(n?"'"+n+"'":"(default)")+" : "+U[n]+(f[n]?" (final)":""));}jQuery.sap.declare=function(m,c){var N=m;if(typeof(m)==="object"){N=m.modName;m=u(m.modName)+(m.type?"."+m.type:"")+".js";}else{m=u(m)+".js";}_ui5loader.declareModule(m);if(c!==false){jQuery.sap.getObject(N,1);}};jQuery.sap.require=function(m){if(arguments.length>1){for(var i=0;i<arguments.length;i++){jQuery.sap.require(arguments[i]);}return this;}if(typeof(m)==="object"){m=u(m.modName)+(m.type?"."+m.type:"");}else{m=u(m);}sap.ui.requireSync(m);};Object.defineProperty(jQuery.sap.require,"_hook",{get:function(){return _ui5loader.translate;},set:function(h){_ui5loader.translate=h;}});jQuery.sap.preloadModules=function(P,a,s){Log.error("jQuery.sap.preloadModules was never a public API and has been removed. Migrate to Core.loadLibrary()!");};jQuery.sap.registerPreloadedModules=function(d){var m=d.modules;if(Version(d.version||"1.0").compareTo("2.0")<0){m={};for(var N in d.modules){m[u(N)+".js"]=d.modules[N];}}sap.ui.require.preload(m,d.name,d.url);};jQuery.sap.unloadResources=_ui5loader.unloadResources;jQuery.sap.getResourceName=function(m,s){return u(m)+(s==null?".js":s);};jQuery.sap.loadResource=LoaderExtensions.loadResource;jQuery.sap._loadJSResourceAsync=_ui5loader.loadJSResourceAsync;return function(){return{modules:_ui5loader.getAllModules(),prefixes:_ui5loader.getUrlPrefixes()};};}());jQuery.sap.includeScript=includeScript;jQuery.sap.includeStyleSheet=includeStylesheet;if(!(oCfgData.productive===true||oCfgData.productive==="true"||oCfgData.productive==="x")){SupportHotkeys.init(getModuleSystemInfo,oCfgData);}if(oJQVersion.compareTo("2.2.3")!=0){Log.warning("SAPUI5's default jQuery version is 2.2.3; current version is "+jQuery.fn.jquery+". Please note that we only support version 2.2.3.");}jQuery.sap.FrameOptions=FrameOptions;jQuery.sap.globalEval=function(){eval(arguments[0]);};(function(){var b=Device.browser;var i=b.name;if(!jQuery.browser){jQuery.browser=(function(u){var r=/(webkit)[ \/]([\w.]+)/,a=/(opera)(?:.*version)?[ \/]([\w.]+)/,c=/(msie) ([\w.]+)/,d=/(mozilla)(?:.*? rv:([\w.]+))?/,u=u.toLowerCase(),m=r.exec(u)||a.exec(u)||c.exec(u)||u.indexOf("compatible")<0&&d.exec(u)||[],e={};if(m[1]){e[m[1]]=true;e.version=m[2]||"0";if(e.webkit){e.safari=true;}}return e;}(window.navigator.userAgent));}if(i===b.BROWSER.CHROME){jQuery.browser.safari=false;jQuery.browser.chrome=true;}else if(i===b.BROWSER.SAFARI){jQuery.browser.safari=true;jQuery.browser.chrome=false;}if(i){jQuery.browser.fVersion=b.version;jQuery.browser.mobile=b.mobile;}}());return jQuery;});
