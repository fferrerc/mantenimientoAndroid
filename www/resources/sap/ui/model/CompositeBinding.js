/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/DataType','./BindingMode','./ChangeReason','./PropertyBinding','./CompositeType','./CompositeDataState',"sap/base/util/deepEqual","sap/base/assert","sap/base/Log","sap/ui/thirdparty/jquery"],function(D,B,C,P,a,b,d,c,L,q){"use strict";var e=P.extend("sap.ui.model.CompositeBinding",{constructor:function(f,r,i){P.apply(this,[null,""]);this.aBindings=f;this.aValues=null;this.bRawValues=r;this.bPreventUpdate=false;this.bInternalValues=i;},metadata:{publicMethods:["getBindings","attachChange","detachChange"]}});e.prototype.getPath=function(){c(null,"Composite Binding has no path!");return null;};e.prototype.getModel=function(){c(null,"Composite Binding has no model!");return null;};e.prototype.getContext=function(){c(null,"Composite Binding has no context!");return null;};e.prototype.isResolved=function(){var r=false;q.each(this.aBindings,function(i,o){r=o.isResolved();if(!r){return false;}});return r;};e.prototype.setType=function(t,i){if(t&&!(t instanceof a)){throw new Error("Only CompositeType can be used as type for composite bindings!");}P.prototype.setType.apply(this,arguments);if(this.oType){this.bRawValues=this.oType.getUseRawValues();this.bInternalValues=this.oType.getUseInternalValues();if(this.bRawValues&&this.bInternalValues){throw new Error(this.oType+" has both 'bUseRawValues' & 'bUseInternalValues' set to true. Only one of them is allowed to be true");}}};e.prototype.setContext=function(o){q.each(this.aBindings,function(i,f){if(!o||f.updateRequired(o.getModel())){f.setContext(o);}});};e.prototype.setValue=function(v){var V;if(this.bSuspended){return;}q.each(this.aBindings,function(i,o){V=v[i];if(V!==undefined){o.setValue(V);}});this.getDataState().setValue(this.getValue());};e.prototype.getValue=function(){var v=[],V;q.each(this.aBindings,function(i,o){V=o.getValue();v.push(V);});return v;};e.prototype.getOriginalValue=function(){var v=[],V;q.each(this.aBindings,function(i,o){V=o.getDataState().getOriginalValue();v.push(V);});return v;};e.prototype.getExternalValue=function(){var v=[],i,V;switch(this.sInternalType){case"raw":return this.getRawValue();case"internal":return this.getInternalValue();default:i=this.sInternalType&&D.getType(this.sInternalType);if(this.bRawValues){v=this.getValue();}else{this.aBindings.forEach(function(o){v.push(this.bInternalValues?o.getInternalValue():o.getExternalValue());}.bind(this));}if(this.fnFormatter){V=this.fnFormatter.apply(this,v);}else if(this.oType){V=this.oType.formatValue(v,this.sInternalType);}else if(i instanceof D&&i.isArrayType()){V=v;}else if(v.length>1){V=v.join(" ");}else{V=v[0];}return V;}};e.prototype.setExternalValue=function(v){var V,f,I,o;if(this.sInternalType==="raw"){this.setRawValue(v);return;}else if(this.sInternalType==="internal"){this.setInternalValue(v);return;}I=this.sInternalType&&D.getType(this.sInternalType);if(this.fnFormatter){L.warning("Tried to use twoway binding, but a formatter function is used");return;}o=this.getDataState();if(this.oType){try{if(this.oType.getParseWithValues()){f=[];if(this.bRawValues){f=this.getValue();}else{q.each(this.aBindings,function(i,g){f.push(g.getExternalValue());});}}V=this.oType.parseValue(v,this.sInternalType,f);this.oType.validateValue(V);}catch(E){o.setInvalidValue(v);this.checkDataState();throw E;}}else if(Array.isArray(v)&&I instanceof D&&I.isArrayType()){V=v;}else if(typeof v=="string"){V=v.split(" ");}else{V=[v];}this.aBindings.forEach(function(g,i){v=V[i];if(v!==undefined){if(this.bRawValues){g.setRawValue(v);}else if(this.bInternalValues){g.setInternalValue(v);}else{g.setExternalValue(v);}}}.bind(this));o.setValue(this.getValue());o.setInvalidValue(undefined);};e.prototype.getInternalValue=function(){return this.aBindings.map(function(o){return o.getInternalValue();});};e.prototype.setInternalValue=function(v){var o=this.getDataState(),V=v;if(this.oType){try{if(!this.bInternalValues){V=this.aBindings.map(function(f,i){return f._internalToRaw(V[i]);});if(!this.bRawValues){V=this.aBindings.map(function(f,i){return f._rawToExternal(V[i]);});}}this.oType.validateValue(V);}catch(E){o.setInvalidValue(v);this.checkDataState();throw E;}}this.aBindings.forEach(function(f,i){var g=v[i];if(g!==undefined){f.setInternalValue(g);}});o.setValue(this.getValue());o.setInvalidValue(undefined);};e.prototype.getRawValue=function(){return this.aBindings.map(function(o){return o.getRawValue();});};e.prototype.setRawValue=function(v){var o=this.getDataState(),V=v;if(this.oType){try{if(!this.bRawValues){if(this.bInternalValues){V=this.aBindings.map(function(f,i){return f._rawToInternal(V[i]);});}else{V=this.aBindings.map(function(f,i){return f._rawToExternal(V[i]);});}}this.oType.validateValue(V);}catch(E){o.setInvalidValue(v);this.checkDataState();throw E;}}this.aBindings.forEach(function(f,i){var g=v[i];if(g!==undefined){f.setRawValue(g);}});o.setValue(this.getValue());o.setInvalidValue(undefined);};e.prototype.getBindings=function(){return this.aBindings;};e.prototype.hasValidation=function(){if(this.getType()){return true;}var f=this.getBindings();for(var i=0;i<f.length;++i){if(f[i].hasValidation()){return true;}}return false;};e.prototype.attachChange=function(f,l){var t=this;this.fChangeHandler=function(E){if(t.bSuspended){return;}var o=E.getSource();if(o.getBindingMode()==B.OneTime){o.detachChange(t.fChangeHandler);}t.checkUpdate(true);};this.attachEvent("change",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.attachChange(t.fChangeHandler);});}};e.prototype.detachChange=function(f,l){var t=this;this.detachEvent("change",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.detachChange(t.fChangeHandler);});}};e.prototype.attachDataStateChange=function(f,l){var t=this;this.fDataStateChangeHandler=function(E){var o=E.getSource();if(o.getBindingMode()==B.OneTime){o.detachDataStateChange(t.fChangeHandler);}t.checkDataState();};this.attachEvent("DataStateChange",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.attachEvent("DataStateChange",t.fDataStateChangeHandler);});}};e.prototype.detachDataStateChange=function(f,l){var t=this;this.detachEvent("DataStateChange",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.detachEvent("DataStateChange",t.fDataStateChangeHandler);});}};e.prototype.attachAggregatedDataStateChange=function(f,l){var t=this;if(!this.fDataStateChangeHandler){this.fDataStateChangeHandler=function(E){var o=E.getSource();if(o.getBindingMode()==B.OneTime){o.detachDataStateChange(t.fChangeHandler);}t.checkDataState();};}this.attachEvent("AggregatedDataStateChange",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.attachEvent("DataStateChange",t.fDataStateChangeHandler);});}};e.prototype.detachAggregatedDataStateChange=function(f,l){var t=this;this.detachEvent("AggregatedDataStateChange",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.detachEvent("DataStateChange",t.fDataStateChangeHandler);});}};e.prototype.updateRequired=function(m){var u=false;q.each(this.aBindings,function(i,o){u=u||o.updateRequired(m);});return u;};e.prototype.initialize=function(){this.bPreventUpdate=true;if(this.aBindings){q.each(this.aBindings,function(i,o){o.initialize();});}this.bPreventUpdate=false;if(!this.bSuspended){this.checkUpdate(true);}return this;};e.prototype.getDataState=function(){if(!this.oDataState){this.oDataState=new b(this.aBindings.map(function(o){return o.getDataState();}));}return this.oDataState;};e.prototype.suspend=function(){this.bSuspended=true;q.each(this.aBindings,function(i,o){o.suspend();});};e.prototype.resume=function(){q.each(this.aBindings,function(i,o){o.resume();});this.bSuspended=false;this.checkUpdate(true);};e.prototype.checkUpdate=function(f){var g=false;if(this.bPreventUpdate||(this.bSuspended&&!f)){return;}var o=this.getDataState();var O=this.getOriginalValue();if(f||!d(O,this.aOriginalValues)){this.aOriginalValues=O;o.setOriginalValue(O);g=true;}var v=this.getValue();if(!d(v,this.aValues)||f){this.aValues=v;o.setValue(v);this._fireChange({reason:C.Change});g=true;}if(g){this.checkDataState();}};return e;});
