// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/appRuntime/ui5/AppCommunicationMgr"],function(AppCommunicationMgr){"use strict";var instance;function AppRuntimeService(){this.oAppCommManager=AppCommunicationMgr.getInstance();}AppRuntimeService.prototype.sendMessageToOuterShell=function(m,p){return this.oAppCommManager.sendMessageToOuterShell(m,p);};AppRuntimeService.prototype.jsonParseFn=function(sJson){var sResult={};if(sJson&&typeof sJson==="string"&&sJson.length>0){sResult=JSON.parse(sJson,function(key,value){if(typeof value!='string'){return value;}return(value.substring(0,8)=='function')?eval('('+value+')'):value;});}return sResult;};return{getInstance:function(){if(!instance){instance=new AppRuntimeService();}return instance;}};},false);
