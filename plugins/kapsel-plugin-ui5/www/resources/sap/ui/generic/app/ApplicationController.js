/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","./transaction/BaseController","./transaction/TransactionController","sap/ui/generic/app/util/ModelUtil"],function(q,B,T,M){"use strict";var A=B.extend("sap.ui.generic.app.ApplicationController",{constructor:function(m,v){B.apply(this,[m]);this._oGroupChanges={};this.sName="sap.ui.generic.app.ApplicationController";this._initModel(m);this.registerView(v);}});A.prototype.propertyChanged=function(P,c){var t=this,m={batchGroupId:"Changes",changeSetId:"Changes",onlyIfPending:true,noShowResponse:true,noBlockUI:true,draftSave:true},s,e={};if(c&&c instanceof sap.ui.model.Context){var E=M.getEntitySetFromContext(c);var o=c.getModel().getMetaModel();var a=o.getODataEntitySet(E).entityType;e=o.getODataEntityType(a);}for(var p in e){if(q.sap.startsWith(p,"com.sap.vocabularies.Common.v1.SideEffects")){s=e[p];if(s.SourceProperties&&s.SourceProperties.length){for(var i=0;i<s.SourceProperties.length;i++){if(s.SourceProperties[i].PropertyPath===P){t.registerGroupChange(t._getSideEffectsQualifier(p));}}}}}return new Promise(function(r,b){setTimeout(function(){t.triggerSubmitChanges(m).then(function(R){r(R);},function(d){b(d);});});});};A.prototype.registerGroupChange=function(g){this._oGroupChanges[g]=true;};A.prototype.registerView=function(v){var t=this;if(v){this._fnAttachValidateFieldGroup=function(e){var I,o,l,i,a=[];var b=this.getBindingContext();if(!b){return false;}if(!t.getTransactionController().getDraftController().getDraftContext().hasDraft(b)){this.detachValidateFieldGroup(t._fnAttachValidateFieldGroup);return false;}if(e.mParameters.fieldGroupIds){l=e.mParameters.fieldGroupIds.length;}for(i=0;i<l;i++){I=e.mParameters.fieldGroupIds[i];o=v.data(I);if(o){a.push({uuid:I,objid:o});}}t._onValidateFieldGroup(a,v);};v.attachValidateFieldGroup(this._fnAttachValidateFieldGroup);}};A.prototype._initModel=function(m){m.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);m.setRefreshAfterChange(false);m.setDeferredBatchGroups(["Changes"]);m.setChangeBatchGroups({"*":{batchGroupId:"Changes",changeSetId:"Changes",single:false}});};A.prototype._onValidateFieldGroup=function(g,v){var i,l=g.length,r,R={bGlobal:false,aRequests:[]};for(i=0;i<l;i++){this._executeFieldGroup(g[i],R,v);}l=R.aRequests.length;for(i=0;i<l;i++){r=R.aRequests[i];r(R.bGlobal);}if(R.bGlobal){this._oModel.refresh(true,false,"Changes");}var p=this.triggerSubmitChanges({batchGroupId:"Changes",noShowSuccessToast:true,forceSubmit:true,noBlockUI:true,urlParameters:{},draftSave:this._oModel.hasPendingChanges()});this.fireEvent("beforeSideEffectExecution",{promise:p,valueChange:R.bValueChange,validationMessage:R.bValidationMessage,fieldControl:R.bFieldControl});return p;};A.prototype._executeFieldGroup=function(g,r,v){var s,c,S,p={batchGroupId:"Changes",changeSetId:"SideEffects",noShowSuccessToast:true,forceSubmit:true,noBlockUI:true,urlParameters:{}};s=this._getSideEffectsQualifier(g.objid.name);p.urlParameters.SideEffectsQualifier=s;c=this._oModel.getContext(g.objid.context);S=this._getSideEffect(g.objid);if(this._hasClientErrors(g.uuid,v)){return false;}if(!this._oGroupChanges[s]&&!this._oModel.hasPendingChanges()){return false;}this._oGroupChanges[s]=false;this._executeSideEffects(S,c,p,r);return true;};A.prototype._getSideEffectsQualifier=function(a){var s=a.replace("com.sap.vocabularies.Common.v1.SideEffects","");if(s.indexOf("#")===0){s=s.replace("#","");}return s;};A.prototype._executeSideEffectsForActions=function(s,c){var r;var C="_it/";var R={bGlobal:false,aRequests:[]};var p={batchGroupId:"Changes",changeSetId:"SideEffects",noShowSuccessToast:true,forceSubmit:true,noBlockUI:true,urlParameters:{}};var i=0;if(s.TargetEntities&&s.TargetEntities.length){for(i=0;i<s.TargetEntities.length;i++){if(s.TargetEntities[i].NavigationPropertyPath.indexOf(C)===0){s.TargetEntities[i].NavigationPropertyPath=s.TargetEntities[i].NavigationPropertyPath.substr(4);}}}if(s.TargetProperties&&s.TargetProperties.length){for(i=0;i<s.TargetProperties.length;i++){if(s.TargetProperties[i].PropertyPath.indexOf(C)===0){s.TargetProperties[i].PropertyPath=s.TargetProperties[i].PropertyPath.substr(4);}}}for(i=0;i<c.length;i++){this._executeSideEffects(s,c[i],p,R);if(R.aRequests[0]){r=R.aRequests[0];r(R.bGlobal);R.aRequests=[];}}if(R.bGlobal){this._oModel.refresh(true,false,"Changes");}};A.prototype._executeSideEffects=function(s,c,p,r){var t=this,f,m,a={"ValidationMessage":"validateDraft","ValueChange":"prepareDraft"};if(!s.EffectTypes||!s.EffectTypes.EnumMember){s.EffectTypes={EnumMember:"ValueChange"};}if(t.getTransactionController().getDraftController().getDraftContext().hasDraft(c)){m=a[s.EffectTypes.EnumMember];}r.bValueChange=s.EffectTypes.EnumMember==="ValueChange"?true:r.bValueChange;r.bValidationMessage=s.EffectTypes.EnumMember==="ValidationMessage"?true:r.bValidationMessage;r.bFieldControl=s.EffectTypes.EnumMember==="FieldControlChange"?true:r.bFieldControl;this._setSelect(s,p,r,c);f=function(g){if(m){t.getTransactionController().getDraftController()[m](c,p);}if(!g){t._read(c.getPath(),p);}};r.aRequests.push(f);};A.prototype._hasClientErrors=function(g,v){var i,l,c,C;C=v.getControlsByFieldGroupId(g);if(C){l=C.length;for(i=0;i<l;i++){c=C[i];if(c&&c.getParent){c=c.getParent();if(c&&c.checkClientError&&c.checkClientError()){return true;}}}}return false;};A.prototype._setSelect=function(s,p,r,c){var i,l=0,t,S=[],e=[],a=[],n;if(!r.bGlobal){if((!s.TargetEntities||s.TargetEntities.length===0)&&(!s.TargetProperties||s.TargetProperties.length===0)){r.bGlobal=true;return;}if(s.TargetEntities){l=s.TargetEntities.length;if(l>0){for(i=0;i<l;i++){t=s.TargetEntities[i];if(t.NavigationPropertyPath===""){S.push('*');}else{S.push(t.NavigationPropertyPath);if(e.indexOf(t.NavigationPropertyPath)===-1){e.push(t.NavigationPropertyPath);}}a.push(t.NavigationPropertyPath);}}}if(s.TargetProperties){l=s.TargetProperties.length;if(l>0){for(i=0;i<l;i++){t=s.TargetProperties[i];n="";if(t.PropertyPath.indexOf("/")!==-1){var E=M.getEntitySetFromContext(c);var m=this._oModel.getMetaModel();var b=m.getODataEntitySet(E).entityType;var o=m.getODataEntityType(b);var P=t.PropertyPath.split("/");var d;if(P.length>1){for(var j=0;j<(P.length-1);j++){d=m.getODataAssociationEnd(o,P[j]);if(d){o=m.getODataEntityType(d.type);if(n){n=n+"/";}n=n+P[j];}else{break;}}}}if(a.indexOf(n)===-1){if(n&&e.indexOf(n)===-1){e.push(n);}S.push(t.PropertyPath);}}}}}if(S.length>0){p.readParameters=["$select="+S.join(",")];if(e.length>0){p.readParameters.push("$expand="+e.join(','));}}};A.prototype._getSideEffect=function(i){var m,r,s,f;m=this._oModel.getMetaModel();s="getOData"+i.originType.substring(0,1).toUpperCase()+i.originType.substring(1);if(i.originNamespace){f=i.originNamespace+"."+i.originName;}else{f=i.originName;}if(m[s]){r=m[s](f);if(r){return r[i.name];}}throw"Unknown SideEffect originType: "+i.originType;};A.prototype.getTransactionController=function(){if(!this._oTransaction){this._oTransaction=new T(this._oModel,this._oQueue,{noBatchGroups:true});}return this._oTransaction;};A.prototype.invokeActions=function(f,c,P){var C,i,l,a,b=[],s;P=P||{};l=c.length;a=this._getChangeSetFunc(f,c,P.operationGrouping);if(l===0){b.push(this._invokeAction(f,null,null,P.urlParameters));}else{for(i=0;i<l;i++){b.push(this._invokeAction(f,c[i],a(i),P.urlParameters));}}var F=this._oModel.getMetaModel().getODataFunctionImport(f);for(var p in F){if(q.sap.startsWith(p,"com.sap.vocabularies.Common.v1.SideEffects")){s=F[p];break;}}if(s){this._executeSideEffectsForActions(s,c);}P={batchGroupId:"Changes",changeSetId:"Action"+a(i+1),successMsg:"Call of action succeeded",failedMsg:"Call of action failed",forceSubmit:true,context:C};b.push(this.triggerSubmitChanges(P));return this._newPromiseAll(b).then(function(r){var i,d=false;if(r&&r.length>c.length){r.pop();}if(c.length<=r.length){for(i=0;i<c.length;i++){r[i].actionContext=c[i];if(!r[i].error){d=true;}}if(c.length===0){for(i=0;i<r.length;i++){if(!r[i].error){d=true;}}}}if(d){return r;}else{return Promise.reject(r);}});};A.prototype.executeSideEffects=function(c,s,S,f){var o,n,P,e,r,Q;var b=false;var g=!s&&!S;var R={bGlobal:false,aRequests:[]};var m={batchGroupId:"Changes",changeSetId:"SideEffects",noShowSuccessToast:true,forceSubmit:true,noBlockUI:true,urlParameters:{}};var E=M.getEntitySetFromContext(c);var a=c.getModel().getMetaModel();var d=a.getODataEntitySet(E).entityType;var h=a.getODataEntityType(d);var i=0;f=!(f===false);S=S||[];s=s||[];var j=function(o){if(Q){m.urlParameters.SideEffectsQualifier=Q;}else{delete m.urlParameters.SideEffectsQualifier;}this._executeSideEffects(o,c,m,R);if(R.aRequests[0]){r=R.aRequests[0];r(R.bGlobal);R.aRequests=[];}}.bind(this);for(var p in h){if(q.sap.startsWith(p,"com.sap.vocabularies.Common.v1.SideEffects")){o=h[p];e=false;Q=this._getSideEffectsQualifier(p);if(g){if(!o.SourceProperties&&!o.SourceEntities){j(o);e=true;b=true;break;}}else{if(o.SourceEntities&&o.SourceEntities.length){for(i=0;i<o.SourceEntities.length;i++){n=o.SourceEntities[i].NavigationPropertyPath;if(S.indexOf(n)!==-1){e=true;}}}if(!e&&o.SourceProperties&&o.SourceProperties.length){for(i=0;i<o.SourceProperties.length;i++){P=o.SourceProperties[i].PropertyPath;if(s.indexOf(P)!==-1){e=true;}}}if(e){j(o);b=true;}}}}if(R.bGlobal||(g&&!e)){if(g&&f){j({});b=true;}if(f){this._oModel.refresh(true,false,"Changes");b=true;}}var k=null;if(b){k=this.triggerSubmitChanges({batchGroupId:"Changes",noShowSuccessToast:true,forceSubmit:true,noBlockUI:true,urlParameters:{},draftSave:this._oModel.hasPendingChanges()});}else{k=Promise.resolve();}this.fireEvent("beforeSideEffectExecution",{promise:k,valueChange:R.bValueChange,validationMessage:R.bValidationMessage,fieldControl:R.bFieldControl});return k;};A.prototype._newPromiseAll=function(p){var r=[];var R=Promise.resolve(null);p.forEach(function(P){R=R.then(function(){return P;}).then(function(o){r.push({response:o});},function(e){r.push({error:e});});});return R.then(function(){return Promise.resolve(r);});};A.prototype._getChangeSetFunc=function(f,c,o){var l=c.length;var s=function(){return"Changes";};if(l===1){return s;}if(o==="com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet"){return s;}return function(i){return"Changes"+i;};};A.prototype.getNewActionContext=function(f,e,p){var t=this;p=q.extend({batchGroupId:"Changes",changeSetId:"SingleAction",successMsg:"Call of action succeeded",failedMsg:"Call of action failed",forceSubmit:true,context:e,functionImport:this._oMeta.getODataFunctionImport(f.split("/")[1])},p);var F=this._createFunctionContext(e,p);F.result=F.result.then(function(r){return t._normalizeResponse(r,true);},function(r){var o=t._normalizeError(r);throw o;});return F;};A.prototype.submitActionContext=function(e,a,f){var s;var F=this._oModel.getMetaModel().getODataFunctionImport(f);for(var p in F){if(q.sap.startsWith(p,"com.sap.vocabularies.Common.v1.SideEffects")){s=F[p];break;}}if(s){this._executeSideEffectsForActions(s,[e]);}this.triggerSubmitChanges({batchGroupId:"Changes",successMsg:"Call of action succeeded",failedMsg:"Call of action failed",forceSubmit:true,context:a});};A.prototype._invokeAction=function(f,c,C,u){var t=this;var p={batchGroupId:"Changes",changeSetId:C,successMsg:"Call of action succeeded",failedMsg:"Call of action failed",urlParameters:u,forceSubmit:true,context:c};return this._callAction(f,c,p).then(function(r){return t._normalizeResponse(r,true);},function(r){var o=t._normalizeError(r);throw o;});};A.prototype.destroy=function(){B.prototype.destroy.apply(this,[]);if(this._oTransaction){this._oTransaction.destroy();}this._oModel=null;this._oTransaction=null;this._oGroupChanges=null;};return A;},true);
