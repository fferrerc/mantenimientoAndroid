/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/base/Log'],function(L){"use strict";var C=function(){};C.createItemCondition=function(f,k,d){var v=[k,d];if(d===null||d===undefined){v.pop();}return this.createCondition(f,"EEQ",v);};C.createCondition=function(f,o,v){var c={fieldPath:f,operator:o,values:v};return c;};C.checkIsEmpty=function(c,f){if(!Array.isArray(c)){c=[c];}c.forEach(function(o){var O=f.getOperator(o.operator);o.isEmpty=O.isEmpty(o);});};C.updateValues=function(c,f){if(!Array.isArray(c)){c=[c];}c.forEach(function(o){var O=f.getOperator(o.operator);if(o.operator!=="EEQ"){while(o.values.length!=O.valueTypes.length){if(o.values.length<O.valueTypes.length){o.values.push(null);}if(o.values.length>O.valueTypes.length){o.values=o.values.slice(0,o.values.length-1);}}}});};return C;},true);
