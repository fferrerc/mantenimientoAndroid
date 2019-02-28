/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/format/NumberFormat','sap/ui/model/FormatException','sap/ui/model/odata/type/ODataType','sap/ui/model/ParseException','sap/ui/model/ValidateException'],function(q,N,F,O,P,V){"use strict";function g(t){var f;if(!t.oFormat){f=q.extend({groupingEnabled:true},t.oFormatOptions);t.oFormat=N.getIntegerInstance(f);}return t.oFormat;}function a(k,p){return sap.ui.getCore().getLibraryResourceBundle().getText(k,p);}function s(t,c){var n;t.oConstraints=undefined;if(c){n=c.nullable;if(n===false||n==="false"){t.oConstraints={nullable:false};}else if(n!==undefined&&n!==true&&n!=="true"){q.sap.log.warning("Illegal nullable: "+n,null,t.getName());}}t._handleLocalizationChange();}var I=O.extend("sap.ui.model.odata.type.Int",{constructor:function(f,c){O.apply(this,arguments);this.oFormatOptions=f;s(this,c);},metadata:{"abstract":true}});I.prototype._handleLocalizationChange=function(){this.oFormat=null;};I.prototype.formatValue=function(v,t){if(v===undefined||v===null){return null;}if(typeof v!=="number"&&t!=="any"){throw new F("Illegal "+this.getName()+" value: "+v);}switch(this.getPrimitiveType(t)){case"string":return g(this).format(v);case"int":return Math.floor(v);case"float":case"any":return v;default:throw new F("Don't know how to format "+this.getName()+" to "+t);}};I.prototype.parseValue=function(v,S){var r;if(v===null||v===""){return null;}switch(this.getPrimitiveType(S)){case"string":r=g(this).parse(v);if(isNaN(r)){throw new P(a("EnterInt"));}return r;case"float":return Math.floor(v);case"int":return v;default:throw new P("Don't know how to parse "+this.getName()+" from "+S);}};I.prototype.validateValue=function(v){var r=this.getRange();if(v===null){if(this.oConstraints&&this.oConstraints.nullable===false){throw new V(a("EnterInt"));}return;}if(typeof v!=="number"){throw new V(v+" (of type "+typeof v+") is not a valid "+this.getName()+" value");}if(Math.floor(v)!==v){throw new V(a("EnterInt"));}if(v<r.minimum){throw new V(a("EnterNumberMin",[this.formatValue(r.minimum,"string")]));}if(v>r.maximum){throw new V(a("EnterNumberMax",[this.formatValue(r.maximum,"string")]));}};return I;});
