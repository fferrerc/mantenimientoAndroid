/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","sap/ui/mdc/experimental/adapter/odata/ODataBaseAdapter","sap/ui/base/ManagedObject"],function(q,O,M){"use strict";var a=O.extend("sap.ui.mdc.experimental.adapter.odata.v4.ODataPropertyAdapter",{constructor:function(m){O.prototype.constructor.apply(this,[m,{tooltip:function(){var t=this.getAnnotation("@com.sap.vocabularies.Common.v1.QuickInfo");return this.flattenSimpleAnnotation(t);},visible:function(){var h=this.flattenSimpleAnnotation(this.getAnnotation("@com.sap.vocabularies.UI.v1.Hidden"));var v=h?!h:true;if(v&&this.schema.$fieldControl){v=this.schema.$fieldControl.path?"{= $"+this.convertToSimpleBinding(this.schema.$fieldControl.path)+" === 7}":this.schema.$fieldControl.visible;}return v;},name:function(){return this.getAnnotation("@sapui.name");},required:function(){var r=this.getAnnotation("$Nullable");var R=r!=null?(r==="false"||r===false):false;if(this.schema.$fieldControl){R=this.schema.$fieldControl.path?"{= $"+this.convertToSimpleBinding(this.schema.$fieldControl.path)+" !== 0}":this.schema.$fieldControl.required;}else{R=R&&this.editable;}return R;},value:function(){return new Promise(function(r){Promise.all([this.path,this.modelTypeName]).then(function(R){r(this.convertToSimpleBinding(R[0],R[1]));}.bind(this));}.bind(this));},valueBinding:function(){return new Promise(function(r){this.value.then(function(v){r(M.bindingParser(v));});}.bind(this));},href:function(){if(this.dataField&&this.dataField.Url){return this.flattenSimpleAnnotation(this.dataField.Url);}},textArrangement:function(){var t=this.getAnnotation("@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement");if(t){var A=t.$EnumMember;if(A.endsWith("TextFirst")){return this.constants.TextArrangement.TextFirst;}if(A.endsWith("TextLast")){return this.constants.TextArrangement.TextLast;}if(A.endsWith("TextOnly")){return this.constants.TextArrangement.TextOnly;}}return this.constants.TextArrangement.TextSeparate;},textProperty:function(){var t=this.getAnnotation("@com.sap.vocabularies.Common.v1.Text/$Path");t=t?this.parentPath+"/"+t:null;return this.sibling(t);},defaultValue:function(){return this.getAnnotation("$DefaultValue");},formattedValue:function(){return new Promise(function(r){this.textProperty.then(function(t){Promise.all([this.textArrangement,this.value,t.value]).then(function(R){var f;switch(R[0]){case this.constants.TextArrangement.TextFirst:f=R[2]+" ("+R[1]+")";break;case this.constants.TextArrangement.TextLast:f=R[1]+" ("+R[2]+")";break;case this.constants.TextArrangement.TextOnly:f=R[2];break;default:f=R[1];}r(f);}.bind(this));}.bind(this));}.bind(this));},unitProperty:function(){var u=this.getAnnotation("@Org.OData.Measures.V1.Unit/$Path");if(!u){u=this.getAnnotation("@Org.OData.Measures.V1.ISOCurrency/$Path");}u=u?this.parentPath+"/"+u:null;return this.sibling(u);},maxLength:function(){return parseInt(this.getAnnotation("$MaxLength")||255);},minLength:function(){return parseInt(this.getAnnotation("$MinLength")||-1);},scale:function(){return this.getAnnotation("$Scale")||1;},precision:function(){return this.getAnnotation("$Precision")||1;},editable:function(){var u=this.getAnnotation("@Org.OData.Core.V1.Immutable")||this.getAnnotation("@Org.OData.Core.V1.Computed");var U=this.flattenSimpleAnnotation(u);var e=U!=null?(U==="false"||U===false):true;if(e&&this.schema.$fieldControl){e=this.schema.$fieldControl.path?"{= $"+this.convertToSimpleBinding(this.schema.$fieldControl.path)+" !== 1}":this.schema.$fieldControl.editable;}return e;},type:function(){var t=this;function b(T){if(T){switch(T){case"sap.ui.model.odata.type.Boolean":return"boolean";case"sap.ui.model.odata.type.Byte":return"byte";case"sap.ui.model.odata.type.Date":return"date";case"sap.ui.model.odata.type.DateTime":case"sap.ui.model.odata.type.DateTimeOffset":return"date-time";case"sap.ui.model.odata.type.Decimal":case"sap.ui.model.odata.type.Double":return"number";case"sap.ui.model.odata.type.Guid":return"string";case"sap.ui.model.odata.type.Int16":case"sap.ui.model.odata.type.Int32":case"sap.ui.model.odata.type.Int64":return"integer";case"sap.ui.model.odata.type.SByte":case"sap.ui.model.odata.type.Single":return"number";case"sap.ui.model.odata.type.String":return"string";case"sap.ui.model.odata.type.TimeOfDay":return"time";default:if(this["//"]["sap:display-format"]=="Date"){return"date";}return"string";}}}return new Promise(function(r,c){t.modelType.then(function(T){if(t.schema.$kind!=="NavigationProperty"){r(b(T.getName()));}else{if(t.schema.$isCollection){r("array");}else{r("object");}}});});},label:function(){var l;if(this.dataField){l=this.oMetaModel.getObject(this.metaPath+"/Label");}if(!l){l=this.getAnnotation("@com.sap.vocabularies.Common.v1.Label");}return this.flattenSimpleAnnotation(l);},parent:function(){var p={model:this.oModel,path:this.parentPath+"/"};return this.parentPromise("sap/ui/mdc/experimental/adapter/odata/v4/ODataObjectAdapter",p);},reference:function(){var c=this.path.lastIndexOf("/"+this.name);var p=this.path.substring(0,c);var r={model:this.oModel};if(this.schema.$kind=="NavigationProperty"){if(this.schema.$isCollection){r.path=p;return this.parentPromise("sap/ui/mdc/experimental/adapter/odata/v4/ODataListAdapter",r);}else{r.path=p+"/";return this.parentPromise("sap/ui/mdc/experimental/adapter/odata/v4/ODataObjectAdapter",r);}}return this.parent;},modelType:function(){if(this.dataField){return this.oMetaModel.fetchUI5Type(this.dataFieldPath);}return this.oMetaModel.fetchUI5Type(this.metaPath);},modelTypeName:function(){return new Promise(function(r){this.modelType.then(function(t){r(t.getName());});}.bind(this));},filterable:function(){var f=this.oModel.createBindingContext(this.parentPath+"##@Org.OData.Capabilities.V1.FilterRestrictions");var t=this;return new Promise(function(r,b){t.oMetaModel.requestObject(f.getPath()).then(function(F){var s=(F.Filterable!=null)?F.Filterable:true;if(!s){r(false);return;}if(F&&F.NonFilterableProperties){if(t.nameInPropertyPathArray(F.NonFilterableProperties,t.getAnnotation("@sapui.name"))){return r(false);}else{return r(true);}}r(true);});});},filterProperty:function(){return this;},minConditions:function(){var t=this;return new Promise(function(r,b){t.filterable.then(function(f){if(f){var F=t.oModel.createBindingContext(t.parentPath+"##@Org.OData.Capabilities.V1.FilterRestrictions");var o=F.getObject();if(o&&o.RequiredProperties){if(t.nameInPropertyPathArray(o.RequiredProperties,t.getAnnotation("@sapui.name"))){return r(1);}else{return r(0);}}}r(0);});});},maxConditions:function(){var t=this;return new Promise(function(r,b){t.filterable.then(function(f){if(f){r(undefined);}else{r(0);}});});},sortable:function(){var s=this.oModel.createBindingContext(this.parentPath+"##@Org.OData.Capabilities.V1.SortRestrictions");var n=s.getPath()+"/NonSortableProperties";var t=this;return new Promise(function(r,b){t.oMetaModel.requestObject(n).then(function(N){N=N||[];if(t.nameInPropertyPathArray(N,t.getAnnotation("@sapui.name"))){return r(false);}else{return r(true);}});});},sortProperty:function(){return this;},status:function(){function i(c,t){if(!c){return t.constants.Status.None;}if(c.$Path){return t.convertToSimpleBinding(c.$Path);}else{var C=c.$EnumMember;if(C.endsWith("VeryNegative")){return t.constants.Status.VeryNegative;}if(C.endsWith("Negative")){return t.constants.Status.Negative;}if(C.endsWith("Neutral")){return t.constants.Status.Neutral;}if(C.endsWith("VeryPositive")){return t.constants.Status.VeryPositive;}if(C.endsWith("Positive")){return t.constants.Status.Positive;}}}return new Promise(function(r,b){this.oMetaModel.requestObject(this.metaPath+"/@com.sap.vocabularies.UI.v1.Criticality").then(function(c){r(i(c,this));}.bind(this));}.bind(this));},importance:function(){function i(I,t){if(!I){return t.constants.Importance.None;}if(I.$Path){return t.convertToSimpleBinding(I.$Path);}else{var s=I.$EnumMember;if(s.endsWith("Low")){return t.constants.Importance.Low;}if(s.endsWith("Medium")){return t.constants.Importance.Medium;}if(s.endsWith("High")){return t.constants.Importance.High;}}}return new Promise(function(r,b){this.oMetaModel.requestObject(this.metaPath+"/@com.sap.vocabularies.UI.v1.Importance").then(function(I){r(i(I,this));}.bind(this));}.bind(this));},semanticObject:function(){var Q=this.collectAnnotations("@com.sap.vocabularies.Common.v1.SemanticObject");if(q.isEmptyObject(Q)){return undefined;}var A=Object.keys(Q).filter(function(s){return!!s;}).map(function(s){return Q[s].annotation;});return{defaultSemanticObject:(Q[""]?Q[""].annotation:undefined),additionalSemanticObjects:A};},semanticObjectMapping:function(){var g=function(b){if(!q.isArray(b)){return undefined;}var r={};b.forEach(function(p){r[p.LocalProperty.$PropertyPath]=p.SemanticObjectProperty;});return r;};var s=this.collectAnnotations("@com.sap.vocabularies.Common.v1.SemanticObject");if(q.isEmptyObject(s)){return undefined;}var S=this.collectAnnotations("@com.sap.vocabularies.Common.v1.SemanticObjectMapping");if(q.isEmptyObject(S)){return undefined;}var o={};for(var Q in s){o[s[Q].annotation]=g(S[Q].annotation);}return o;}}]);},init:function(){O.prototype.init.apply(this);if(this.iSeparator>-1){var v=this.getAttribute(this.schema,"PropertyPath");if(!v&&this._isDataField()){var t=this.getAttribute(this.schema,"Target");var T=t&&this._getTargetContext();var V=(T||this.oMetaContext).getObject("Value");if(V){v=this.getAttribute(V,"Path");this.dataField=this.schema;}}if(v){this.path=this.path.substring(0,this.iSeparator)+"/"+v;this.oMetaContext=this.oMetaModel.getMetaContext(this.path);this.schema=this.oMetaContext.getObject("");this.dataFieldPath=this.oMetaContext.getPath();}}var c=this.path.lastIndexOf(this.getAnnotation("@sapui.name")||this.schema.name);this.parentPath=this.path.substring(0,c-1);this._initFieldControl();}});a.prototype._getTargetContext=function(){return this.oMetaModel.createBindingContext("Target/$AnnotationPath/",this.oMetaContext);};a.prototype._isDataField=function(){if(this.dataField){return true;}return this.schema.$Type?(this.schema.$Type.indexOf("DataField"))>-1:false;};return a;});
