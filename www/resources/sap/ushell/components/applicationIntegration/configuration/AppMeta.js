// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/services/AppConfiguration','sap/ushell/components/applicationIntegration/elements/model','sap/ui/Device','sap/ushell/Config','sap/ushell/utils','sap/ushell/resources','sap/ushell/EventHub','sap/ushell/components/applicationIntegration/relatedShellElements/RelatedShellElements'],function(A,E,D,C,u,r,a,R){"use strict";function b(){var i,t=this,c,s,d;this.getIsTitleChanged=function(){return i;};this.getIsRelatedAppsChanged=function(){return d;};this.getHierarchyDefaultValue=function(){var h=[];var e=C.last("/core/shell/model/currentState/stateName");if(e&&((e==="app"||e==="embedded"))){h=[{icon:"sap-icon://home",title:r.i18n.getText("actionHomePage"),intent:s?"#"+s:"#"}];}return h;};this.init=function(I){s=I;};this.getIsHierarchyChanged=function(){return c;};this.onHierarchyChange=function(e){c=true;var h=e.getParameters().data,H,f=[],g=C.last("/core/shell/model/currentState/stateName");if(!h){h=[];}H=t.getHierarchyDefaultValue();h.forEach(function(I,j){f[j]=jQuery.extend({},I);});f=f.concat(H);if(g==="home"){E.updateStateProperty("application/hierarchy",f,false,["home"]);}E.updateStateProperty("application/hierarchy",f,true);};this.onRelatedAppsChange=function(e){d=true;var o=e.getParameters().data,f=C.last("/core/shell/model/currentState/stateName");if(!o){o=[];}if(f==="home"){E.updateStateProperty("application/relatedApps",o,false,["home"]);}E.updateStateProperty("application/relatedApps",o,true);};this.resetShellUIServiceHandlers=function(){d=false;c=false;i=false;};this.onTitleChange=function(e){i=true;var T=e.getParameters().data;if(!T){T=this.getAppMeta().getTitleDefaultValue();}var f=C.last("/core/shell/model/currentState/stateName");if(f==="home"){E.updateStateProperty("application/title",T,false,["home"]);}E.updateStateProperty("application/title",T,true);R.genericSetItem("application/title",T);window.document.title=T;u.setPerformanceMark("FLP -- title change");a.emit("TitleChanged",T);};this._getDefaultFavIcon=function(p){var f=p.get('sapUiShellFavicon');if(f){var m=/url[\s]*\('?"?([^\'")]*)'?"?\)/.exec(f);if(m){f=m[1];}else if(f==="''"||f==="none"){f=null;}}if(!f){var M=jQuery.sap.getModulePath("sap.ushell");return M+'/themes/base/img/launchpad_favicon.ico';}return f;};this.getFavIconHref=function(){return jQuery('link').filter('[rel="shortcut icon"]').attr('href')||'';};this.getAppIcon=function(){var I="sap-icon://folder",e=A.getMetadata();if(e&&e.icon){I=e.icon;}return I;};this.setAppIcons=function(m){sap.ui.require(["sap/ui/core/theming/Parameters"],function(P){jQuery.sap.measure.start("FLP:ShellController.setAppIcons","setAppIcons","FLP");var M=jQuery.sap.getModulePath("sap.ushell"),l=(m&&m.homeScreenIconPhone)||(M+'/themes/base/img/launchicons/57_iPhone_Desktop_Launch.png'),L=(m&&m["homeScreenIconPhone@2"])||(M+'/themes/base/img/launchicons/114_iPhone-Retina_Web_Clip.png'),o=(m&&m.homeScreenIconTablet)||(M+'/themes/base/img/launchicons/72_iPad_Desktop_Launch.png'),e=(m&&m["homeScreenIconTablet@2"])||(M+'/themes/base/img/launchicons/144_iPad_Retina_Web_Clip.png'),f=(m&&m.favIcon)||(this._getDefaultFavIcon(P)),g=this.getFavIconHref();if(D.os.ios){jQuery.sap.setIcons({'phone':l,'phone@2':L,'tablet':o,'tablet@2':e,'favicon':f,'precomposed':false});}else if(g!==f){jQuery.sap.setIcons({'phone':'','phone@2':'','tablet':'','tablet@2':'','favicon':f,'precomposed':true});}jQuery.sap.measure.end("FLP:ShellController.setAppIcons");}.bind(this));};this._applyContentDensityByPriority=function(e){var f;if(e===undefined){if(D.system.combi){var g=sap.ushell.Container.getService("UserInfo"),U=g.getUser(),h="autoDetect";if(U){h=U.getContentDensity();}switch(h){case"cozy":e=false;break;case"compact":e=true;break;default:f=A.getMetadata();if(f.compactContentDensity&&!f.cozyContentDensity){e=true;}else{e=false;}}}else{f=A.getMetadata();if(f.compactContentDensity&&!f.cozyContentDensity){e=true;}else if(!f.compactContentDensity&&f.cozyContentDensity){e=false;}else{e=this._isCompactContentDensityByDevice();}}}this._applyContentDensityClass(e);};this._applyContentDensityClass=function(e){var I=this._isCompactContentDensityByDevice();return new Promise(function(f,g){function h(j){jQuery('body').toggleClass('sapUiSizeCompact',j).toggleClass('sapUiSizeCozy',!j);f();}if(e===undefined){sap.ushell.Container.getServiceAsync("UserInfo").then(function(j){var U=j.getUser?j.getUser():undefined;h(U&&U.getContentDensity()==='cozy'?false:I);});}else{h(!!e);}});};this._isCompactContentDensityByDevice=function(){return!D.support.touch||D.system.combi;};this.getTitleDefaultValue=function(){var T="",e=A.getMetadata();if(e&&e.title){T=e.title;}return T;};this.create=function(){};this.restore=function(I){this._applyContentDensityByPriority();this.setAppIcons(I);};this.store=function(I){};this.destroy=function(I){};}return new b();},true);
