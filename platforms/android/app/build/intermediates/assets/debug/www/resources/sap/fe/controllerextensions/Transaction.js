/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(['sap/ui/core/mvc/ControllerExtension','sap/fe/actions/draft','sap/fe/actions/nonDraft','sap/fe/actions/sticky','sap/fe/actions/operations','sap/fe/model/DraftModel',"sap/ui/model/json/JSONModel",'sap/fe/actions/messageHandling','sap/m/Text','sap/m/Button','sap/m/Popover','sap/m/VBox','sap/m/MessageBox'],function(C,d,n,s,o,D,J,m,T,B,P,V,M){'use strict';function g(p){if(p&&p.getMetadata&&p.getMetadata().getName()==='sap.ui.base.Event'){p={};}return p||{};}var E=C.extend('sap.fe.controllerextensions.Transaction',{getProgrammingModel:function(b){var t=this,a=b.getModel(),c=b.getModel().getMetaModel().getMetaPath(b.getPath());if(!this.sProgrammingModel){return D.upgradeOnDemand(a).then(function(i){if(i){t.sProgrammingModel='Draft';}else{if(a.getMetaModel().getObject(c+'@com.sap.vocabularies.Session.v1.StickySessionSupported')){t.sProgrammingModel='Sticky';}else{t.sProgrammingModel='NonDraft';a.sUpdateGroupId="nondraft";}}return t.sProgrammingModel;});}else{return Promise.resolve(this.sProgrammingModel);}},getUIModel:function(){if(!this.uiModel){this.uiModel=new J({editable:'Display',busy:false,draftStatus:'Clear'});}return this.uiModel;},createDocument:function(l){var u=this.getUIModel(),N;if(u.getProperty("/busy")){return Promise.reject("Action can only be called once at a time");}return this.getProgrammingModel(l).then(function(p){switch(p){case'Draft':u.setProperty("/busy",true);N=l.create();return N.created().then(function(){u.setProperty("/busy",false);return m.showUnboundMessages().then(function(){return N;});});case'Sticky':u.setProperty("/busy",true);return s.createDocumentInStickySession(l).then(function(a){u.setProperty("/busy",false);return m.showUnboundMessages().then(function(){return a;});});case'NonDraft':N=l.create();return N;}}).catch(function(e){u.setProperty("/busy",false);m.showUnboundMessages();return Promise.reject(e);});},deleteDocument:function(c,p){var u=this.getUIModel(),r,R;if(u.getProperty("/busy")){return Promise.reject("Action can only be called once at a time");}u.setProperty("/busy",true);p=g(p);var l=sap.ui.getCore().getLibraryResourceBundle("sap.fe"),a,b={title:l.getText("OBJECT_PAGE_DELETE")};if(p.title){if(p.description){a=[p.title,p.description];b.text=l.getText("OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTINFO",a);}else{a=[p.title];b.text=l.getText("OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTTITLE",a);}}else{b.text=l.getText("OBJECT_PAGE_CONFIRM_GENERIC_DELETE");}M.show(b.text,{icon:M.Icon.WARNING,title:b.title,actions:[M.Action.DELETE,M.Action.CANCEL],onClose:function(A){if(A===M.Action.DELETE){var e=Array.isArray(c)?c:[c];return Promise.all(e.map(function(f){f.delete().then(function(){u.setProperty("/busy",false);r();}).catch(function(h){u.setProperty("/busy",false);m.showUnboundMessages();R();});}));}u.setProperty("/busy",false);}});return new Promise(function(e,f){R=f;r=e;});},editDocument:function(c){var t=this;var u=this.getUIModel();if(u.getProperty("/busy")){return Promise.reject("Action can only be called once at a time");}return this.getProgrammingModel(c).then(function(p){switch(p){case'Draft':t.activeContext=c;u.setProperty("/busy",true);return d.createDraftFromActiveDocument(c,{bPreserveChanges:true});case'NonDraft':return c;case'Sticky':u.setProperty("/busy",true);return s.editDocumentInStickySession(c);}}).then(function(N){u.setProperty("/editable",'Editable');u.setProperty("/busy",false);return m.showUnboundMessages().then(function(){return N;});}).catch(function(e){u.setProperty("/busy",false);m.showUnboundMessages();return Promise.reject(e);});},updateDocument:function(){return Promise.resolve();},cancelDocument:function(c,p){var t=this,u=t.getUIModel(),i,a,b;if(u.getProperty("/busy")){return Promise.reject("Action can only be called once at a time");}if(!c){return Promise.reject("No context exists. Pass a meaningful context");}var p=g(p),e=c,f=p.cancelButton,h=e.getModel();return this.getProgrammingModel(c).then(function(j){a=j;if(j==="Draft"){u.setProperty("/busy",true);var k=h.bindContext(e.getPath()+'/DraftAdministrativeData').getBoundContext();return k.requestObject().then(function(l){i=!(l.CreationDateTime===l.LastChangeDateTime);return i;});}else if(j==="Sticky"){return true;}else if(j==="NonDraft"){i=e.hasPendingChanges();return i;}}).then(function(j){return t._showDiscardPopover(f,j);}).then(function(){switch(a){case'Draft':var j=e.getObject(),H=j&&j.HasActiveEntity;if(!H){e.delete();return H;}else{var A=t.activeContext||h.bindContext(e.getPath()+'/SiblingEntity').getBoundContext();return A.requestCanonicalPath().then(function(k){b=k;return e.delete();}).then(function(){if(A.getPath()!==b){A=h.bindContext(b).getBoundContext();}return A;});}break;case'Sticky':u.setProperty("/busy",true);return s.discardDocument(c);case'NonDraft':if(e===c&&i){c.getBinding().resetChanges();}break;}}).then(function(j){u.setProperty("/editable",'Display');u.setProperty("/busy",false);return m.showUnboundMessages().then(function(){return j;});}).catch(function(j){u.setProperty("/busy",false);m.showUnboundMessages();return Promise.reject(j);});},saveDocument:function(c){var u=this.getUIModel(),a;if(u.getProperty("/busy")){return Promise.reject("Action can only be called once at a time");}u.setProperty("/busy",true);return this.getProgrammingModel(c).then(function(p){switch(p){case'Draft':return d.activateDocument(c);case'Sticky':return s.activateDocument(c);case'NonDraft':a=c.getModel();a.submitBatch(a.getUpdateGroupId());return c;}}).then(function(A){u.setProperty("/editable",'Display');u.setProperty("/busy",false);return m.showUnboundMessages().then(function(){return A;});}).catch(function(e){u.setProperty("/busy",false);m.showUnboundMessages();return Promise.reject(e);});},callBoundAction:function(a,c,p){p=p||{};var u=this.getUIModel(),t=this,b,e;if(u.getProperty("/busy")){return Promise.reject("Action can only be called once at a time");}b=Array.isArray(c)?c[0]:c;e=b.getModel();return this.getProgrammingModel(b).then(function(f){if(f==='NonDraft'){}var h=t._getBindingParameters(a,e);return o.callBoundAction(a,c,{invocationGrouping:p.invocationGrouping,label:p.label,showActionParameterDialog:true,bindingParameters:h,onSubmitted:function(){u.setProperty("/busy",true);}});}).then(function(){u.setProperty("/busy",false);return m.showUnboundMessages();}).catch(function(f){u.setProperty("/busy",false);m.showUnboundMessages();return Promise.reject(f);});},_getBindingParameters:function(a,b){if(!a){return;}var c=b.getMetaModel(),S=c.getObject("/"+a+'@com.sap.vocabularies.Common.v1.SideEffects');if(!S){return;}var p={},t=S.TargetProperties,e=S.TargetEntities;if(Array.isArray(t)&&t.length){p['$select']="";t.forEach(function(f){var h=f['$PropertyPath'];if(h.indexOf('_it/')!==0){p['$select']+=(h+',');}else{p['$expand']=p['$expand']||"";p['$expand']+=(h.slice(4)+',');}});p['$select']=p['$select'].slice(0,-1);p['$expand']=p['$expand']?p['$expand'].slice(0,-1):undefined;}if(Array.isArray(e)&&e.length){}return p;},_showDiscardPopover:function(c,i){var t=this,r=sap.ui.getCore().getLibraryResourceBundle("sap.fe");t._bContinueDiscard=false;return new Promise(function(a,b){if(!c){b("Cancel button not found");}if(i){var O=function(){c.setEnabled(true);if(t._bContinueDiscard){a();}else{b("Discard operation was rejected. Document has not been discarded");}t._oPopover.detachAfterClose(O);};if(!t._oPopover){t._oPopover=new P({showHeader:false,placement:"Top",content:[new V({items:[new T({text:r.getText("SAPFE_DRAFT_DISCARD_MESSAGE")}),new B({text:r.getText("SAPFE_DRAFT_DISCARD_BUTTON"),width:"100%",press:function(){t._bContinueDiscard=true;t._oPopover.close();}})]})],beforeOpen:function(){c.setEnabled(false);}});t._oPopover.addStyleClass("sapUiContentPadding");}t._oPopover.attachAfterClose(O);t._oPopover.openBy(c);}else{a();}});}});return E;});
