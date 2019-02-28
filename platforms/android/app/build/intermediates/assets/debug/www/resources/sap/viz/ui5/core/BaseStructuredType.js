/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2018 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/core/Element','sap/viz/library','./BaseChartMetadata',"sap/base/util/ObjectPath","sap/base/Log"],function(E,l,B,O,L){"use strict";var a=E.extend("sap.viz.ui5.core.BaseStructuredType",{metadata:{"abstract":true,library:"sap.viz"}},B);a.prototype._getOrCreate=function(n){var o=this.getAggregation(n);if(!o){var m=this.getMetadata(),A=m.getAggregation(n);if(A&&A._oParent===m){jQuery.sap.require(A.type);var F=O.get(A.type||"");o=new F();this.setAggregation(n,o);}}return o;};a.prototype._getOptions=function(i){var m=this.getMetadata(),o={},p,d,A,n,v;function t(n){n=(n==='toolTip'?'tooltip':n);return n;}function b(n){var r=n;switch(n){case'triangleUp':r='triangle-up';break;case'triangleDown':r='triangle-down';break;case'triangleLeft':r='triangle-left';break;case'triangleRight':r='triangle-right';break;}return r;}m.getJSONKeys();var p=m.getAllProperties();var d=m.getPropertyDefaults();for(n in p){if(p[n]._oParent===m){v=this.getProperty(n);if(v instanceof Array){if(i||!d[n]||v.toString()!==d[n].toString()){o[t(n)]=b(v);}}else{if(i||v!==d[n]){o[t(n)]=b(v);}}}}var A=m.getAllAggregations();for(n in A){if(A[n]._oParent==m){v=this.getAggregation(n,null);if(v!==null){o[t(n)]=v._getOptions(i);}}}return o;};a._convertAggregatedObject=function(A,o,m){if(o!=null){var b=this.getMetadata().getAllAggregations()[A];var c=o.getMetadata&&o.getMetadata().getName();if(b&&c!==b.type){jQuery.sap.require(b.type);var C=O.get(b.type||"");o=new C(o._getOptions(true));L.warning("[Deprecated] Type of aggregation '"+this.getMetadata().getName()+"."+A+" has been changed from '"+c+"' to '"+b.type+"'.");}}return o;};a.prototype.validateProperty=function(p,v){if(/^(lineSize|size)$/.test(p)){var P=this.getMetadata().getAllProperties()[p];if(P&&P.type==="int"&&typeof v!=="number"){v=v?parseInt(v):null;}}return E.prototype.validateProperty.call(this,p,v);};a.prototype.validateAggregation=function(A,o,m){if(A==="selectability"){o=a._convertAggregatedObject.call(this,A,o,m);}return E.prototype.validateAggregation.call(this,A,o,m);};return a;});
