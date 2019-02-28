/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/ManagedObject","sap/m/MessageBox","sap/ui/layout/form/SimpleForm","sap/ui/comp/smartfield/SmartField","sap/ui/comp/smartfield/SmartLabel","sap/m/Dialog","sap/ui/generic/app/util/ModelUtil","sap/m/VBox","sap/m/Text"],function(q,M,a,S,b,c,D,d,V,T){"use strict";var A=M.extend("sap.ui.generic.app.util.ActionUtil",{metadata:{properties:{controller:{type:"object",group:"Misc",defaultValue:null},applicationController:{type:"object",group:"Misc",defaultValue:null},contexts:{type:"object",group:"Misc",defaultValue:null},successCallback:{type:"function",group:"Misc",defaultValue:null},operationGrouping:{type:"string",group:"Misc",defaultValue:null}}}});A.prototype.call=function(f,F){var t=this;return new Promise(function(r,e){var m;t._oActionPromiseCallback={resolve:r,reject:e};t._sFunctionImportPath=f;var C=t.getController();if(!C){e("Controller not provided");}t._oMetaModel=C.getView().getModel().getMetaModel();var s=f.split('/')[1];t._oFunctionImport=t._oMetaModel.getODataFunctionImport(s);t._sFunctionImportLabel=F||s;if(!t._oFunctionImport){e("Unknown Function Import "+s);}if(t._isActionCritical()){var g="ACTION_CONFIRM|"+s;var h;var R=C.getOwnerComponent().getAppComponent&&C.getOwnerComponent().getAppComponent().getModel("i18n")&&C.getOwnerComponent().getAppComponent().getModel("i18n").getResourceBundle();if(R&&R.hasText(g)){h=R.getText(g);}else{h=sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.app").getText("ACTION_CONFIRM");h=q.sap.formatMessage(h,t._sFunctionImportLabel);}a.confirm(h,{title:t._sFunctionImportLabel,onClose:function(o){if(o==="OK"){m=t._prepareParameters(t.getContexts());t._initiateCall(m);}else if(o==="CANCEL"){t._oActionPromiseCallback.reject();}},sClass:t._getCompactModeStyleClass()});}else{m=t._prepareParameters(t.getContexts());t._initiateCall(m);}});};A.prototype._getCompactModeStyleClass=function(){if(this.getController().getView().$().closest(".sapUiSizeCompact").length){return"sapUiSizeCompact";}return"";};A.prototype._isActionCritical=function(){var C=this._oFunctionImport["com.sap.vocabularies.Common.v1.IsActionCritical"];if(!C){return false;}if(C.Bool===undefined){return true;}return this._toBoolean(C.Bool);};A.prototype._toBoolean=function(p){if(typeof p==="string"){var v=p.toLowerCase();return!(v=="false"||v==""||v==" ");}return!!p;};A.prototype._prepareParameters=function(C){var s,e=null;if(q.isArray(C)&&C.length!=1){return undefined;}else{s=C[0];}var o=s.getObject();if(s&&s.getPath()){var E=d.getEntitySetFromContext(s);var f=this._oMetaModel.getODataEntitySet(E,false);e=this._oMetaModel.getODataEntityType(f.entityType,false);}var k=this._getPropertyKeys(e);var p;var m={parameterData:{},additionalParameters:[]};if(this._oFunctionImport.parameter){for(var i=0;i<this._oFunctionImport.parameter.length;i++){var P=this._oFunctionImport.parameter[i];this._addParameterLabel(P,e);var g=P.name;var I=!!k[g];p=undefined;if(o.hasOwnProperty(g)){p=o[g];}else if(I){q.sap.log.error("Key parameter of action not found in current context: "+g);throw new Error("Key parameter of action not found in current context: "+g);}m.parameterData[g]=p;if(!I&&P.mode.toUpperCase()=="IN"){m.additionalParameters.push(P);}}}return m;};A.prototype._getPropertyKeys=function(e){var k={};if(e&&e.key&&e.key.propertyRef){for(var i=0;i<e.key.propertyRef.length;i++){var K=e.key.propertyRef[i].name;k[K]=true;}}return k;};A.prototype._initiateCall=function(m){if(m!=undefined&&m.additionalParameters.length==0){this._call(m.parameterData);}else if(m!=undefined&&m.additionalParameters.length>0){var t=this;var p={urlParameters:{}};var e=this.getContexts()[0];var f=this.getApplicationController().getNewActionContext(this._sFunctionImportPath,e,p);f.context.then(function(o){var P=t._buildParametersForm(m,o);for(var k in m.parameterData){o.oModel.setProperty(k,m.parameterData[k],o);}var g=false;var h=new D({title:t._sFunctionImportLabel,content:[P.form],beginButton:new sap.m.Button({text:t._sFunctionImportLabel,press:function(E){if(P.hasNoClientErrors()){if(P.getEmptyMandatoryFields().length==0){h.close();t._oActionPromiseCallback.resolve({executionPromise:f.result.then(function(R){t._bExecutedSuccessfully=true;return R;},function(j){t._bExecutedSuccessfully=false;throw j;})});g=true;var F=t._sFunctionImportPath.split('/')[1];t.getApplicationController().submitActionContext(e,o,F);}else{var C=new V();var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.app").getText("ACTION_MISSING_MANDATORY");for(var i=0;i<P.getEmptyMandatoryFields().length;i++){var s=q.sap.formatMessage(r,P.getEmptyMandatoryFields()[i].getTextLabel());C.addItem(new T({text:s}));}a.error(C,{sClass:t._getCompactModeStyleClass()});}}}}),endButton:new sap.m.Button({text:sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.app").getText("ACTION_CANCEL"),press:function(){h.close();t._oActionPromiseCallback.reject();g=true;}}),afterClose:function(C){h.destroy();if(!g){t._oActionPromiseCallback.reject();}}}).addStyleClass("sapUiNoContentPadding");h.addStyleClass(t._getCompactModeStyleClass());h.setModel(o.oModel);h.open();});}else{this._call();}};A.prototype._call=function(u){var C=this.getContexts();var p={urlParameters:u,operationGrouping:this.getOperationGrouping()};var o=this.getController();var e=this.getApplicationController()||o.getApplicationController();var t=this;t._oActionPromiseCallback.resolve({executionPromise:e.invokeActions(this._sFunctionImportPath,C,p).then(function(r){t._bExecutedSuccessfully=true;return r;},function(E){t._bExecutedSuccessfully=false;throw E;})});};A.prototype._getActionParameterData=function(p){var m=[];var r=p.getObject('/');var P={};for(var i=0;i<this._oFunctionImport.parameter.length;i++){var o=this._oFunctionImport.parameter[i];var s=o.name;if(r.hasOwnProperty(s)){var v=r[s];if(v===undefined){if(!this._toBoolean(o.nullable)){if(o.type==='Edm.Boolean'){P[s]=false;}else{m.push(o);}}}else{P[s]=v;}}else{throw new Error("Unknown parameter: "+s);}}return{preparedParameterData:P,missingMandatoryParameters:m};};A.prototype._buildParametersForm=function(p,C){var f=new S({editable:true});f.setBindingContext(C);var F;var e=[];var l;for(var i=0;i<p.additionalParameters.length;i++){var P=p.additionalParameters[i];var v=P["com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]?"fixed-values":undefined;F=new b({value:'{'+P.name+'}',textLabel:this._getParameterName(P)});F.data("configdata",{"configdata":{isInnerControl:false,path:P.name,entitySetObject:{},annotations:{valuelist:P["com.sap.vocabularies.Common.v1.ValueList"],valuelistType:v},modelObject:C.oModel,entityType:P.type,property:{property:P,typePath:P.name}}});if(P.nullable=="false"){F.setMandatory(true);}e.push(F);l=new c();l.setLabelFor(F);f.addContent(l);f.addContent(F);}var h=function(){var n=true;for(var i=0;i<e.length;i++){if(e[i].getValueState()!="None"){n=false;break;}}return n;};var g=function(){var m=q.grep(e,function(F){return(F.getMandatory()==true&&F.getValue()==""&&F.getDataType()!="Edm.Boolean");});return m;};return{form:f,hasNoClientErrors:h,getEmptyMandatoryFields:g};};A.prototype._getParameterName=function(p){return p["com.sap.vocabularies.Common.v1.Label"]?p["com.sap.vocabularies.Common.v1.Label"].String:p.name;};A.prototype._addParameterLabel=function(p,e){if(e&&p&&!p["com.sap.vocabularies.Common.v1.Label"]){var P=this._oMetaModel.getODataProperty(e,p.name,false);if(P&&P["com.sap.vocabularies.Common.v1.Label"]){p["com.sap.vocabularies.Common.v1.Label"]=P["com.sap.vocabularies.Common.v1.Label"];}}};A.prototype.getFunctionImportLabel=function(){return this._sFunctionImportLabel;};A.prototype.getExecutedSuccessfully=function(){return this._bExecutedSuccessfully;};return A;},true);
