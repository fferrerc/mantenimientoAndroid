sap.ui.define(["jquery.sap.global","sap/ui/base/Object","sap/ui/Device","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/m/ActionSheet","sap/m/Dialog","sap/m/Popover","sap/suite/ui/generic/template/lib/deletionHelper","sap/suite/ui/generic/template/lib/routingHelper","sap/suite/ui/generic/template/lib/BeforeSaveHelper","sap/suite/ui/generic/template/lib/ContextBookkeeping","sap/suite/ui/generic/template/lib/StatePreserver","sap/suite/ui/generic/template/lib/testableHelper","sap/base/Log"],function(q,B,D,J,M,A,a,P,d,r,b,C,S,t,L){"use strict";var c=(t.testableStatic(function(T,o){var s="sapUiSizeCozy",h="sapUiSizeCompact";if(o.hasClass(s)||o.hasClass(h)){return"";}else{return T?s:h;}},"Application_determineContentDensityClass")(D.support.touch,q(document.body)));function g(){return c;}function f(o,p){q.sap.syncStyleClass(c,p,o);p.addDependent(o);}var f=t.testableStatic(f,"Application_attachControlToParent");function e(T){var o=new C(T.oAppComponent);var l,E;var n=Object.create(null);function h(){return l;}function s(i){l=i;}function k(i){var j=T.oNavigationControllerProxy.getActiveComponents();return j.indexOf(i.getId())>=0;}var I=false;function m(i){T.fnAddSideEffectPromise(i);}function p(i){if(I){return;}var j=q.grep(T.aRunningSideEffectExecutions,function(o1){return!!o1;});if(j.length){I=true;Promise.all(j).then(function(){I=false;p(i);});}else{i();}}function u(i){var j;if(i instanceof a){j="open";}else if(i instanceof P||i instanceof A){j="openBy";}if(j){var o1=i[j];i[j]=function(){var p1=arguments;p(function(){if(!T.oBusyHelper.isBusy()){T.oBusyHelper.getUnbusy().then(function(){o1.apply(i,p1);});}});};}}var F={};function v(i,j,o1,p1,q1){i=i||T.oNavigationHost;var r1=i.getId();var s1=F[r1]||(F[r1]={});var t1=s1[j];if(!t1){t1=sap.ui.xmlfragment(r1,j,o1);f(t1,i);var u1;if(p1){u1=new J();t1.setModel(u1,p1);}(q1||q.noop)(t1,u1);s1[j]=t1;u(t1);}return t1;}function w(){return new Promise(function(i){T.oNavigationObserver.getProcessFinished(true).then(function(){T.oBusyHelper.getUnbusy().then(i);});});}function x(i){T.oShellServicePromise.then(function(j){j.setBackNavigation(i);});}function y(i){if(!T.oFlexibleColumnLayoutHandler){return{handleDataReceived:function(){return false;}};}return T.oFlexibleColumnLayoutHandler.getFclProxyForView(i);}var z=false;function G(i){z=i;}function H(i,j){if(!T.oFlexibleColumnLayoutHandler){return true;}var o1=r.determineNavigationPath(i,j);return T.oFlexibleColumnLayoutHandler.isNewHistoryEntryRequired(o1);}function R(i){T.aStateChangers.push(i);}function K(i){return T.oFlexibleColumnLayoutHandler?T.oFlexibleColumnLayoutHandler.getTargetAfterCancelPromise(i):Promise.resolve(i);}function N(i,j){j.then(function(){o.adaptAfterObjectDeleted(i);});}function O(i,j,o1){var p1=T.mEntityTree[i];var q1;if(p1.navigationProperty&&p1.parent){q1=j?p1.entitySet:p1.navigationProperty;}else{q1=i;}if(o1.indexOf(q1)<0){o1.unshift(q1);if(p1.navigationProperty&&p1.parent){O(p1.parent,j,o1);}}}function Q(i,j){var o1=[];O(i,j,o1);return o1;}function U(j){var o1=Q(j);o1.pop();var p1="";var q1="";var r1=[];for(var i=0;i<o1.length;i++){p1=p1+q1+o1[i];r1.push(p1);q1="/";}return r1;}function V(){var i=T.oNavigationControllerProxy.oHashChanger.getHash();var j=i.split("?")[0];var o1=j.split("/");if(o1[0]===""||o1[0]==="#"){o1.splice(0,1);}return o1;}function W(j,o1,p1){var q1=[];var r1=T.mEntityTree[p1];var s1=V();var t1=r1.level-(o1?0:1);var u1="";var v1="";for(var i=0;i<=t1;i++){var w1={link:u1};if(i>0){w1.section=s1[i-1];}q1.push(w1);if(i<t1){u1=u1+v1+s1[i];v1="/";}}var x1=[];var y1=function(){var w1=q1[r1.level];w1.entitySet=r1.entitySet;w1.mAppStates=Object.create(null);var A1=T.oNavigationControllerProxy.getApplicableStateForComponentAddedPromise(r1.componentId,w1.link,w1.mAppStates);x1[r1.level]=A1.then(function(){if(T.oFlexibleColumnLayoutHandler){T.oFlexibleColumnLayoutHandler.adaptBreadCrumbUrlParameters(w1.mAppStates,r1);}w1.fullLink=T.oNavigationControllerProxy.concatPathAndAppStates(w1.link,w1.mAppStates);return w1;});};if(o1){y1();}for(var z1=j?0:1;r1.level>z1;){r1=T.mRoutingTree[r1.parentRoute];y1();}return{aInfoObjects:q1,aInfoObjectPromises:x1};}function X(){var j=T.oNavigationControllerProxy.getActiveComponents();var o1=0;var p1;for(var i=0;i<j.length;i++){var q1=T.componentRegistry[j[i]];if(q1.viewLevel>0&&(o1===0||q1.viewLevel<o1)){o1=q1.viewLevel;p1=q1.oComponent;}}var r1=p1?Promise.resolve(p1):T.oNavigationControllerProxy.getRootComponentPromise();return r1.then(function(s1){return s1.getModel("i18n").getResourceBundle();});}function Y(){return T.oNavigationControllerProxy.getAppTitle();}function Z(i,j){T.oNavigationControllerProxy.subTitleForViewLevelChanged(i,j);}function $(i){return T.oNavigationControllerProxy.getCurrentKeys(i);}function _(){for(var i in T.componentRegistry){var j=T.componentRegistry[i];if(j.viewLevel===1){if(k(j.oComponent)){var o1=j.oComponent.getComponentContainer().getElementBinding();return o1&&o1.getPath();}else{return null;}}}return null;}function a1(i){if(i.viewLevel){var j=i.oComponent.getEntitySet();return T.mEntityTree[j];}return T.mRoutingTree.root;}function b1(o1,p1,q1,r1,s1){var t1=a1(q1);var u1=false;var v1;var w1=true;for(var i=0;i<t1.children.length&&!v1;i++){var x1=t1.children[i];var y1=T.mEntityTree[x1];if(y1[q1.viewLevel?"navigationProperty":"sRouteName"]===o1){v1=y1.sRouteName;w1=!y1.noKey;}}if(r1&&!v1){var z1=t1.embeddedComponents[r1];if(z1){for(var j=0;j<z1.pages.length&&!u1;j++){var A1=z1.pages[j];if(A1.navigationProperty===o1){u1=true;var B1=q1.oComponent.getEntitySet();v1=B1+"/"+r1+"/"+o1;w1=!(A1.routingSpec&&A1.routingSpec.noKey);}}}}if(v1){var C1=u1?r1+r.getPatternDelimiter():"";var D1=w1?"("+p1+")":"";var E1=C1+o1+D1;T.oNavigationControllerProxy.navigateToSuffix(E1,q1.viewLevel+1,v1,s1);}}var c1;function d1(j,o1){var i=o1||0;if(i>0){return null;}var p1=j.getEntitySet();var q1=T.mEntityTree[p1];var r1=q1&&q1.communicationObject;for(;i<0&&r1;){q1=T.mEntityTree[q1.parent];if(q1.communicationObject!==r1){i++;r1=q1.communicationObject;}}if(i<0||r1){return r1;}c1=c1||{};return c1;}function e1(i){for(var j in T.mEntityTree){if(T.mEntityTree[j].navigationProperty&&(T.mEntityTree[j].level===i+1)){return T.mEntityTree[j].navigationProperty;}}}function f1(){return T.oFlexibleColumnLayoutHandler?T.oFlexibleColumnLayoutHandler.getMaxColumnCountInFCL():false;}function g1(){var j=T.oNavigationControllerProxy.getActiveComponents();for(var i=0;i<j.length;i++){var o1=j[i];var p1=T.componentRegistry[o1];var q1=p1.methods.currentDraftModified&&p1.methods.currentDraftModified();if(q1){o.markDraftAsModified(q1);}}}function h1(){if(E!==undefined){return E;}var i,j,o1,p1,q1,r1,s1=true;var t1=T.oAppComponent.getModel();var u1=t1.getMetaModel();var v1=t1.mContexts;for(o1 in v1){s1=false;q1=v1[o1].sPath;p1=q1&&q1.substring(1,q1.indexOf('('));r1=p1&&u1.getODataEntitySet(p1);if(r1){i=t1.getProperty(q1);j=i&&t1.getETag(undefined,undefined,i)||null;if(j){E=true;return E;}}}if(s1){return true;}E=false;return E;}function i1(j){var i,o1,p1;var q1=T.oNavigationControllerProxy.getAllComponents();for(i=0;i<q1.length;i++){o1=q1[i];if(!j||!j[o1]){p1=T.componentRegistry[o1];p1.utils.refreshBinding(true);}}}function j1(i){if(T.oFlexibleColumnLayoutHandler){T.oFlexibleColumnLayoutHandler.setStoredTargetLayoutToFullscreen(i);}}function k1(){T.oPaginatorInfo={};}function l1(i){return new S(T,i);}function m1(i,j){return new b(T,i,j);}function n1(j,o1){var p1=n[j];if(!p1){p1=Object.create(null);n[j]=p1;var q1=T.oAppComponent.getModel();var r1=q1.getMetaModel();var s1=r1.getODataEntitySet(j);var t1=s1&&r1.getODataEntityType(s1.entityType);var u1=(t1&&t1.navigationProperty)||[];for(var i=0;i<u1.length;i++){var v1=u1[i];p1[v1.name]=v1;}}return p1[o1];}T.oApplicationProxy={getDraftSiblingPromise:o.getDraftSiblingPromise,getAlternativeContextPromise:o.getAlternativeContextPromise,getPathOfLastShownDraftRoot:o.getPathOfLastShownDraftRoot,areTwoKnownPathesIdentical:o.areTwoKnownPathesIdentical,getResourceBundleForEditPromise:X,getHierarchySectionsFromCurrentHash:V,getLinkToUpperLayersInfo:W,getContentDensityClass:g,setEditableNDC:G,getDialogFragment:v.bind(null,null),destroyView:function(i){delete F[i];},setListReportTable:s,markCurrentDraftAsModified:g1,prepareDeletion:N,performAfterSideEffectExecution:p};return{setEditableNDC:G,getEditableNDC:function(){return z;},getContentDensityClass:g,attachControlToParent:f,getDialogFragmentForView:v,getBusyHelper:function(){return T.oBusyHelper;},addSideEffectPromise:m,performAfterSideEffectExecution:p,isComponentActive:k,showMessageToast:function(){var i=arguments;var j=function(){L.info("Show message toast");M.show.apply(M,i);};Promise.all([w(true),T.oBusyHelper.getUnbusy()]).then(j);},setBackNavigation:x,getFclProxyForView:y,isNewHistoryEntryRequired:H,registerStateChanger:R,getDraftSiblingPromise:o.getDraftSiblingPromise,registerContext:o.registerContext,activationStarted:o.activationStarted,cancellationStarted:o.cancellationStarted,editingStarted:o.editingStarted,getTargetAfterCancelPromise:K,getBreadCrumbInfo:U,getSections:Q,getHierarchySectionsFromCurrentHash:V,getLinkToUpperLayersInfo:W,getAppTitle:Y,subTitleForViewLevelChanged:Z,getCurrentKeys:$,getPathForViewLevelOneIfVisible:_,getCommunicationObject:d1,navigateRoute:b1,getForwardNavigationProperty:e1,getMaxColumnCountInFCL:f1,getListReportTable:h,markCurrentDraftAsModified:g1,checkEtags:h1,refreshAllComponents:i1,getIsDraftModified:o.getIsDraftModified,prepareDeletion:d.prepareDeletion.bind(null,T),prepareDeletionOfCreateDraft:d.prepareDeletionOfCreateDraft.bind(null,T),setStoredTargetLayoutToFullscreen:j1,invalidatePaginatorInfo:k1,getStatePreserver:l1,getBeforeSaveHelper:m1,getNavigationProperty:n1};}return B.extend("sap.suite.ui.generic.template.lib.Application",{constructor:function(T){q.extend(this,e(T));}});});