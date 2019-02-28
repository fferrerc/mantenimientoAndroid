/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/mdc/experimental/provider/adapter/base/FieldAdapter","sap/ui/mdc/experimental/provider/adapter/odata/v2/ODataBaseAdapter","sap/ui/mdc/experimental/provider/adapter/AdapterFactory","sap/ui/thirdparty/jquery"],function(F,O,a,q){"use strict";var b=F.extend("sap.ui.mdc.experimental.provider.adapter.odata.v2.ODataFieldAdapter",{_parentCache:{},constructor:function(m,M,c){F.prototype.constructor.apply(this,[m,M,c,O]);}});b.prototype.allowEmptyValue=function(){return true;};b.prototype.defaultValue=function(){switch(this.ui5Type){case"sap.ui.model.odata.type.Boolean":return false;case"sap.ui.model.odata.type.Byte":case"sap.ui.model.odata.type.Decimal":case"sap.ui.model.odata.type.Double":case"sap.ui.model.odata.type.Guid":case"sap.ui.model.odata.type.Int16":case"sap.ui.model.odata.type.Int32":case"sap.ui.model.odata.type.Int64":case"sap.ui.model.odata.type.SByte":case"sap.ui.model.odata.type.Single":return 0;case"sap.ui.model.odata.type.Date":case"sap.ui.model.odata.type.DateTimeOffset":case"sap.ui.model.odata.type.TimeOfDay":return new Date();case"Edm.String":return"";default:return"";}};b.prototype.precision=function(){return this["//"]["Precision"];};b.prototype.scale=function(){return this["//"]["Scale"];};b.prototype.maximum=function(){return 0;};b.prototype.exclusiveMaximum=function(){return false;};b.prototype.minimum=function(){return 0;};b.prototype.exclusiveMinimum=function(){return false;};b.prototype.maxLength=function(){var m=this["//"]["maxLength"];return isNaN(m)?undefined:parseInt(m);};b.prototype.minLength=function(){var m=this["//"]["minLength"];return isNaN(m)?undefined:parseInt(m);};b.prototype.multipleOf=function(){return 1;};b.prototype.pattern=function(){return"/.*?/";};b.prototype.unit=function(){};b.prototype.textAlign=function(){};b.prototype.visible=function(){return O.utils.visible(O.annotations.HIDDEN,this);};b.prototype.ui5Type=function(){if(this.oMetaModel.getUI5Type){return this.oMetaModel.getUI5Type(this.sMetaPath);}switch(this.schema.type){case"Edm.Boolean":return"sap.ui.model.odata.type.Boolean";case"Edm.Byte":return"sap.ui.model.odata.type.Byte";case"Edm.Date":return"sap.ui.model.odata.type.Date";case"Edm.DateTime":return"sap.ui.model.odata.type.DateTime";case"Edm.DateTimeOffset":return"sap.ui.model.odata.type.DateTimeOffset";case"Edm.Decimal":return"sap.ui.model.odata.type.Decimal";case"Edm.Double":return"sap.ui.model.odata.type.Double";case"Edm.Guid":return"sap.ui.model.odata.type.Guid";case"Edm.Int16":return"sap.ui.model.odata.type.Int16";case"Edm.Int32":return"sap.ui.model.odata.type.Int32";case"Edm.Int64":return"sap.ui.model.odata.type.Int64";case"Edm.SByte":return"sap.ui.model.odata.type.SByte";case"Edm.Single":return"sap.ui.model.odata.type.Single";case"Edm.String":return"sap.ui.model.odata.type.String";case"Edm.TimeOfDay":return"sap.ui.model.odata.type.TimeOfDay";default:if(this["//"]["sap:display-format"]=="Date"){return"sap.ui.model.odata.type.Date";}return"sap.ui.model.odata.type.String";}};b.prototype.formatOptions=function(){var f="";switch(this.ui5Type){case"sap.ui.model.odata.type.Boolean":break;case"sap.ui.model.odata.type.Byte":break;case"sap.ui.model.odata.type.Date":break;case"sap.ui.model.odata.type.DateTimeOffset":break;case"sap.ui.model.odata.type.Decimal":break;case"sap.ui.model.odata.type.Double":break;case"sap.ui.model.odata.type.Guid":break;case"sap.ui.model.odata.type.Int16":break;case"sap.ui.model.odata.type.Int32":break;case"sap.ui.model.odata.type.Int64":break;case"sap.ui.model.odata.type.SByte":break;case"sap.ui.model.odata.type.Single":break;case"sap.ui.model.odata.type.String":break;case"sap.ui.model.odata.type.TimeOfDay":break;default:break;}return f;};b.prototype.semantics=function(){if(this.getAnnotation(this.annotations.SEMANTICS.PASSWORD)!=null){return F.Semantics.password;}if(this.getAnnotation(this.annotations.SEMANTICS.EMAIL)!=null){return F.Semantics.eMail;}if(this.getAnnotation(this.annotations.SEMANTICS.PHONE)!=null){return F.Semantics.phoneNumber;}if(this.getAnnotation(this.annotations.SEMANTICS.URL)!=null){return F.Semantics.url;}if(this.getAnnotation(this.annotations.SEMANTICS.CURRENCY)!=null){return F.Semantics.currency;}if(this.getAnnotation(this.annotations.SEMANTICS.UNIT)!=null){return F.Semantics.measure;}return F.Semantics.text;};b.prototype.required=function(){return O.utils.required("nullable",this);};b.prototype.filterable=function(){return(this.filterRestrictions.NonFilterableProperties.indexOf(this.schema.name)===-1);};b.prototype.requiredInFilter=function(){return(this.filterRestrictions.RequiredProperties.indexOf(this.schema.name)!==-1);};b.prototype.sortable=function(){return true;};b.prototype.valueHelp=function(){var r=null;var v=this.getAnnotation(this.annotations.VALUE_LIST);if(v){r={};var e="/"+v.CollectionPath.String;r.valuesPath=this.asPath(e);r.parameters=[];var p,i,l,V;for(i=0;i<v.Parameters.length;i++){p=v.Parameters[i];l=p.LocalDataProperty?p.LocalDataProperty.PropertyPath:null;V=p.ValueListProperty.PropertyPath;var o=new b(this.oModel,this.sModelName,this.sContextName);o.switchMetaContext(null,e+"/"+V);r.parameters.push({targetProperty:l,sourceAdapter:o});}}return r;};b.prototype.describedBy=function(){var t=this["//"][this.annotations.TEXT];if(!t){return this;}return this.resolveNavi(t.Path,b);};b.prototype._collectAnnotations=function(A){var p=this["//"];var Q={};for(var s in p){var n=s.split("#")[0];var c=s.split("#")[1]||"";if(typeof A=="string"&&A.length>0&&n.startsWith(A)&&(typeof A=="string"&&A.length>0&&n.endsWith(A))){Q[c]={annotation:p[s]};}}return Q;};b.prototype.semanticObject=function(){var Q=this._collectAnnotations(this.annotations.SEMANTIC_OBJECT);var A=Object.keys(Q).filter(function(s){return!!s;}).map(function(s){return Q[s].annotation["String"];});return{defaultSemanticObject:(Q[""]?Q[""].annotation["String"]:undefined),additionalSemanticObjects:A};};b.prototype.semanticObjectMapping=function(){var g=function(c){if(!Array.isArray(c)){return{};}var r={};c.forEach(function(p){r[p.LocalProperty.PropertyPath]=p.SemanticObjectProperty.String;});return r;};var s=this._collectAnnotations(this.annotations.SEMANTIC_OBJECT);if(q.isEmptyObject(s)){return{};}var S=this._collectAnnotations(this.annotations.SEMANTIC_OBJECT_MAPPING);if(q.isEmptyObject(S)){return{};}var o={};for(var Q in s){o[s[Q].annotation["String"]]=g(S[Q].annotation);}return o;};b.prototype.parent=function(){var p,P=this.sPath.split("/");if(P[0]!==""){return null;}P[1]=O.utils.stripKeyPredicate(P[1]);P.splice(-1,1);p=P.join("/");if(!this._parentCache[p]){this._parentCache[p]=a.newAdapter("object",this.oModel,this.sModelName,this.sContextName,p,true);}return this._parentCache[p];};return b;});
