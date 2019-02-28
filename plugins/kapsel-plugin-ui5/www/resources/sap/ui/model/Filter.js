/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/Object','./FilterOperator'],function(q,B,F){"use strict";var c=B.extend("sap.ui.model.Filter",{constructor:function(f,o,v,V){if(typeof f==="object"&&!Array.isArray(f)){this.sPath=f.path;this.sOperator=f.operator;this.oValue1=f.value1;this.oValue2=f.value2;this.sVariable=f.variable;this.oCondition=f.condition;this.aFilters=f.filters||f.aFilters;this.bAnd=f.and||f.bAnd;this.fnTest=f.test;this.fnCompare=f.comparator;this.bCaseSensitive=f.caseSensitive;}else{if(Array.isArray(f)){this.aFilters=f;}else{this.sPath=f;}if(q.type(o)==="boolean"){this.bAnd=o;}else if(q.type(o)==="function"){this.fnTest=o;}else{this.sOperator=o;}this.oValue1=v;this.oValue2=V;if(this.sOperator===F.Any||this.sOperator===F.All){throw new Error("The filter operators 'Any' and 'All' are only supported with the parameter object notation.");}}if(this.sOperator===F.Any){if(this.sVariable&&this.oCondition){this._checkLambdaArgumentTypes();}else if(!this.sVariable&&!this.oCondition){}else{throw new Error("When using the filter operator 'Any', a lambda variable and a condition have to be given or neither.");}}else if(this.sOperator===F.All){this._checkLambdaArgumentTypes();}else{if(Array.isArray(this.aFilters)&&!this.sPath&&!this.sOperator&&!this.oValue1&&!this.oValue2){this._bMultiFilter=true;if(!this.aFilters.every(i)){q.sap.log.error("Filter in Aggregation of Multi filter has to be instance of sap.ui.model.Filter");}}else if(!this.aFilters&&this.sPath!==undefined&&((this.sOperator&&this.oValue1!==undefined)||this.fnTest)){this._bMultiFilter=false;}else{q.sap.log.error("Wrong parameters defined for filter.");}}}});c.prototype._checkLambdaArgumentTypes=function(){if(!this.sVariable||typeof this.sVariable!=="string"){throw new Error("When using the filter operators 'Any' or 'All', a string has to be given as argument 'variable'.");}if(!i(this.oCondition)){throw new Error("When using the filter operator 'Any' or 'All', a valid instance of sap.ui.model.Filter has to be given as argument 'condition'.");}};function i(v){return v instanceof c;}c.defaultComparator=function(a,b){if(a==b){return 0;}if(a==null||b==null){return NaN;}if(typeof a=="string"&&typeof b=="string"){return a.localeCompare(b);}if(a<b){return-1;}if(a>b){return 1;}return NaN;};return c;});
