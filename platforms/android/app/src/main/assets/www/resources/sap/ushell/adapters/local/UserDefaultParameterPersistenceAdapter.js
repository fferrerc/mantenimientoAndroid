// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/services/Personalization'],function(P){"use strict";var U=function(s,p,c){this._oConfig=c&&c.config;};U.prototype._getPersonalizationService=function(){return sap.ushell.Container.getService("Personalization");};U.prototype.saveParameterValue=function(p,v){var d=new jQuery.Deferred();if(!(typeof p==="string"&&p.length<=40&&/^[A-Za-z0-9.-_]+$/.exec(p))){jQuery.sap.log.error("Illegal Parameter Key, less than 40 characters and [A-Za-z0-9.-_]+ :\""+p+"\"");}this._getUDContainer().done(function(c){c.setItemValue(p,v);c.saveDeferred(50).done(d.resolve.bind(d)).fail(d.reject.bind(d));}).fail(function(m){jQuery.sap.log.error(m);d.reject(m);});return d.promise();};U.prototype.deleteParameter=function(p,v){var d=new jQuery.Deferred();if(!(typeof p==="string"&&p.length<=40&&/^[A-Za-z0-9.-_]+$/.exec(p))){jQuery.sap.log.error("Illegal Parameter Key, less than 40 characters and [A-Za-z0-9.-_]+ :\""+p+"\"");}this._getUDContainer().done(function(c){c.delItem(p);c.save().done(d.resolve.bind(d)).fail(d.reject.bind(d));}).fail(function(m){jQuery.sap.log.error(m);d.reject(m);});return d.promise();};U.prototype.loadParameterValue=function(p){var d=new jQuery.Deferred();this._getUDContainer().done(function(c){var v=c.getItemValue(p);if(v){d.resolve(v);}else{d.reject("no value ");}}).fail(function(m){jQuery.sap.log.error(m);d.reject(m);});return d.promise();};U.prototype.getStoredParameterNames=function(){var d=new jQuery.Deferred();this._getUDContainer().done(function(c){var v=c.getItemKeys();d.resolve(v);}).fail(function(m){jQuery.sap.log.error(m);d.reject(m);});return d.promise();};U.prototype._getUDContainer=function(){var p=this._getPersonalizationService();if(this._oPromise){return this._oPromise;}this._oPromise=p.getContainer("sap.ushell.UserDefaultParameter",{keyCategory:p.constants.keyCategory.FIXED_KEY,writeFrequency:p.constants.writeFrequency.LOW,clientStorageAllowed:true});return this._oPromise;};return U;},true);
