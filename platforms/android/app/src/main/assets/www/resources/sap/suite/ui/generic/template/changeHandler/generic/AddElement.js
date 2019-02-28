/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
*/
sap.ui.define(["jquery.sap.global","sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2"],function(q,U,A){"use strict";var a={};a.applyChange=function(c,C,p){};a.completeChangeContent=function(c,s,p){var o=s.parentId||s.selector.id;var O=p.modifier.bySelector(o,p.appComponent);var m=U.getMetaModel(s,p);var r=s.custom.fnGetRelevantElement?s.custom.fnGetRelevantElement(O):O;var e="";var E={};var b=[];var d=[];var f="";var t=U.getTemplatingInfo(r);if(t&&t.target&&t.annotation){e=t.target;E=m.getODataEntityType(e);f=t.annotation;b=E[f];}else{e=U.getEntityType(r);E=m.getODataEntityType(e);f=s.custom.annotation;b=E[f];}d=JSON.parse(JSON.stringify(b));if(s.custom.fnPerformSpecificAddAction){s.custom.fnPerformSpecificAddAction(O,b);}else if(s.custom.fnGetAnnotationIndex){var i=s.custom.fnGetAnnotationIndex(O,b);b.splice(i,0,s.custom.oAnnotationTermToBeAdded);}else{b.splice(s.index,0,s.custom.oAnnotationTermToBeAdded);}if(s.custom.AddConcreteElement){s.custom.AddConcreteElement.completeChangeContent(c,s,p);}var C=A.createCustomAnnotationTermChange(e,b,d,f);C.parentId=O.getId();var g=A.createCustomChanges(C);q.extend(true,c.getContent(),g);};return a;},true);
