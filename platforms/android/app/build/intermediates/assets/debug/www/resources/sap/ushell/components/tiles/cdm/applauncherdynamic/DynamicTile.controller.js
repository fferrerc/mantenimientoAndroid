// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ui/core/mvc/Controller','sap/ushell/components/tiles/utils','sap/ui/core/format/NumberFormat','sap/ushell/Config'],function(C,u,N,a){"use strict";return C.extend("sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",{timer:null,_aDoableObject:{},oDataRequest:null,_getConfiguration:function(){var v=this.getView().getViewData(),c={},U,h;c.configuration=v.configuration;c.properties=v.properties;c.properties.info=c.properties.info||"";c.properties.number_value='...';c.properties.number_value_state='Neutral';c.properties.number_state_arrow='None';c.properties.number_factor='';c.properties.number_unit='';var s=c.configuration["sap-system"];var t=c.properties.targetURL;if(t&&s){U=sap.ushell.Container.getService("URLParsing");if(U.isIntentUrl(t)){h=U.parseShellHash(t);if(!h.params){h["params"]={};}h.params["sap-system"]=s;t="#"+U.constructShellHash(h);}else{t+=((t.indexOf("?")<0)?"?":"&")+"sap-system="+s;}c.properties.targetURL=t;}c.properties.sizeBehavior=a.last("/core/home/sizeBehavior");c.properties.wrappingType=a.last("/core/home/wrappingType");return c;},onInit:function(){var v=this.getView();var m=new sap.ui.model.json.JSONModel();m.setData(this._getConfiguration());v.setModel(m);this._aDoableObject=a.on("/core/home/sizeBehavior").do(function(s){m.setProperty("/properties/sizeBehavior",s);});},refreshHandler:function(){this.loadData(0);},visibleHandler:function(i){if(i){if(!this.oDataRequest){this.refreshHandler(this);}}else{this.stopRequests();}},updateVisualPropertiesHandler:function(n){var p=this.getView().getModel().getProperty("/properties");var c=false;if(typeof n.title!=='undefined'){p.title=n.title;c=true;}if(typeof n.subtitle!=='undefined'){p.subtitle=n.subtitle;c=true;}if(typeof n.icon!=='undefined'){p.icon=n.icon;c=true;}if(typeof n.targetURL!=='undefined'){p.targetURL=n.targetURL;c=true;}if(typeof n.info!=='undefined'){p.info=n.info;c=true;}if(c){this.getView().getModel().setProperty("/properties",p);}},stopRequests:function(){if(this.timer){clearTimeout(this.timer);}if(this.oDataRequest){try{this.oDataRequest.abort();}catch(e){jQuery.sap.log.warning(e.name,e.message);}}},onPress:function(e){var r={},R=sap.ushell.Container.getRenderer("fiori2");if(e.getSource().getScope&&e.getSource().getScope()===sap.m.GenericTileScope.Display){var t=this.getView().getModel().getProperty("/properties/targetURL"),T=this.getView().getModel().getProperty("/properties/title");if(!t){return;}else if(t[0]==='#'){hasher.setHash(t);}else{r.title=T;r.appType="App";r.url=t;r.appId=t;R.logRecentActivity(r);window.open(t,'_blank');}}},initUpdateDynamicData:function(){var v=this.getView(),s=v.getModel().getProperty("/configuration/serviceUrl"),S=v.getModel().getProperty("/configuration/serviceRefreshInterval");if(!S){S=0;}else if(S<10){jQuery.sap.log.warning("Refresh Interval "+S+" seconds for service URL "+s+" is less than 10 seconds, which is not supported. Increased to 10 seconds automatically.",null,"sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile.controller");S=10;}if(s){this.loadData(S);}},extractData:function(d){var n,k=["results","icon","title","number","numberUnit","info","infoState","infoStatus","targetParams","subtitle","stateArrow","numberState","numberDigits","numberFactor"];if(typeof d==="object"&&Object.keys(d).length===1){n=Object.keys(d)[0];if(jQuery.inArray(n,k)===-1){return d[n];}}return d;},successHandleFn:function(r){var c=this.getView().getModel().getProperty("/configuration");var d=r;this.oDataRequest=undefined;if(typeof r==="object"){var b=jQuery.sap.getUriParameters(c.serviceUrl).get("$inlinecount");if(b&&b==="allpages"){d={number:r.__count};}else{d=this.extractData(d);}}else if(typeof r==="string"){d={number:r};}this.updatePropertiesHandler(d);},errorHandlerFn:function(m){this.oDataRequest=undefined;var M=m&&m.message?m.message:m,r=u.getResourceBundleModel().getResourceBundle(),U=this.getView().getModel().getProperty("/configuration/serviceUrl");if(m.response){M+=" - "+m.response.statusCode+" "+m.response.statusText;}jQuery.sap.log.error("Failed to update data via service "+U+": "+M,null,"sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile");this.updatePropertiesHandler({number:"???",info:r.getText("dynamic_data.error")});},loadData:function(s){var U=this.getView().getModel().getProperty("/configuration/serviceUrl"),l,S;if(!U){return;}if(s>0){jQuery.sap.log.info("Wait "+s+" seconds before calling "+U+" again",null,"sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile.controller");this.timer=setTimeout(this.loadData.bind(this,s,false),(s*1000));}if(!this.oDataRequest){if(sap.ushell.Container){l=sap.ushell.Container.getUser().getLanguage();S=sap.ushell.Container.getLogonSystem()?sap.ushell.Container.getLogonSystem().getClient():"";}if((l)&&(U.indexOf("sap-language=")==-1)){U=U+(U.indexOf("?")>=0?"&":"?")+"sap-language="+l;}this.oDataRequest=OData.read({requestUri:U,headers:{"Cache-Control":"no-cache, no-store, must-revalidate","Pragma":"no-cache","Expires":"0","Accept-Language":(sap.ui&&sap.ui.getCore().getConfiguration().getLanguage())||"","sap-client":(S||""),"sap-language":(l||"")}},this.successHandleFn.bind(this),this.errorHandlerFn.bind(this));}},onExit:function(){this.stopRequests();this._aDoableObject.off();},addParamsToUrl:function(U,t){var p="",b=U.indexOf("?")!==-1,i;if(t&&t.length>0){for(i=0;i<t.length;i=i+1){p+=t[i];if(i<t.length-1){p+="&";}}}if(p.length>0){if(!b){U+="?";}else{U+="&";}U+=p;}return U;},_normalizeNumber:function(n,m,b,i){var c;if(isNaN(n)){c=n;}else{var o=sap.ui.core.format.NumberFormat.getFloatInstance({maxFractionDigits:i});if(!b){var d=Math.abs(n);if(d>=1000000000){b='B';n/=1000000000;}else if(d>=1000000){b='M';n/=1000000;}else if(d>=1000){b='K';n/=1000;}}c=o.format(n);}var e=c;var f=e[m-1];m-=(f==='.'||f===',')?1:0;e=e.substring(0,m);return{displayNumber:e,numberFactor:b};},updatePropertiesHandler:function(d){var e=u.getResourceBundleModel().getResourceBundle().getText("dynamic_data.error");var b=0,i,n,c,s,p=this.getView().getModel().getProperty("/properties"),U={title:d.title||p.title||"",subtitle:d.subtitle||p.subtitle||"",icon:d.icon||p.icon||"",targetURL:d.targetURL||p.targetURL||"",number_value:!isNaN(d.number)?d.number:"...",number_digits:d.numberDigits>=0?d.numberDigits:4,info:p.info==e?d.info||"":d.info||p.info||"",number_unit:d.numberUnit||p.number_unit||"",number_state_arrow:d.stateArrow||p.number_state_arrow||"None",number_value_state:d.numberState||p.number_value_state||"Neutral",number_factor:d.numberFactor||p.number_factor||""};var t=[];if(d.targetParams){t.push(d.targetParams);}if(d.results){for(i=0,n=d.results.length;i<n;i=i+1){c=d.results[i].number||0;if(typeof c==="string"){c=parseInt(c,10);}b=b+c;s=d.results[i].targetParams;if(s){t.push(s);}}U.number_value=b;}if(t.length>0){U.targetURL=this.addParamsToUrl(U.targetURL,t);}if(!isNaN(d.number)){if(typeof d.number==="string"){d.number=d.number.trim();}var S=this._shouldProcessDigits(d.number,d.numberDigits),m=U.icon?4:5;if(d.number&&d.number.length>=m||S){var o=this._normalizeNumber(d.number,m,d.numberFactor,d.numberDigits);U.number_factor=o.numberFactor;U.number_value=o.displayNumber;}else{var f=N.getFloatInstance({maxFractionDigits:m});U.number_value=f.format(d.number);}}if(U.number_value_state){switch(U.number_value_state){case"Positive":U.number_value_state="Good";break;case"Negative":U.number_value_state="Error";break;}}U.sizeBehavior=a.last("/core/home/sizeBehavior");this.getView().getModel().setProperty("/properties",U);},_shouldProcessDigits:function(d,D){var n;d=typeof(d)!=='string'?d.toString():d;if(d.indexOf('.')!==-1){n=d.split(".")[1].length;if(n>D){return true;}}return false;}});},true);