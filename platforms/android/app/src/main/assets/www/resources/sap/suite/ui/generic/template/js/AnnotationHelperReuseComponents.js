sap.ui.define(["sap/suite/ui/generic/template/extensionAPI/UIMode"],function(U){"use strict";function f(r,s){return(r.componentName||r.componentUsage)+"::"+r.id+"::"+s;}function g(r){return"!${_templPriv>/generic/embeddedComponents/"+r.id+"/hidden}";}function a(i,e,r,R,A){var t=i.getInterface(0),m=t.getModel(),E=e.entityType?m.getODataEntityType(e.entityType):R.oEntityType;var n=r.binding;if(n){var o=m.getODataAssociationSetEnd(E,n);if(o&&o.entitySet){e=m.getODataEntitySet(o.entitySet);E=m.getODataEntityType(e.entityType);}}var s=e?sap.ui.model.odata.AnnotationHelper.format(t,e["com.sap.vocabularies.Common.v1.SemanticObject"]):R.semanticObject;var O="";if(E&&E.key){E.key.propertyRef.forEach(function(k){O+="{"+k.name+"}::";});O=O.replace(/::$/,"");}var d={"uiMode":"{= ${ui>/createMode} ? '"+U.Create+"' : ( ${ui>/editable} ? '"+U.Edit+"' : '"+U.Display+"') }","semanticObject":s||"","stIsAreaVisible":A?"{= ${_templPriv>/generic/isActive} && !!${_templPriv>/generic/embeddedComponents/"+r.id+"/isInVisibleArea} && "+g(r)+" }":"{_templPriv>/generic/isActive}"};if(r){jQuery.extend(d,r.settings);var v=JSON.stringify(d);v=v.replace(/\}/g,"\\}").replace(/\{/g,"\\{");return v;}}function b(i,e,r,R){return a(i,e,r,R,true);}b.requiresIContext=true;function c(i,e,r,R){return a(i,e,r,R,false);}c.requiresIContext=true;return{formatIdComponentSection:function(r){return f(r,"ComponentSection");},formatIdComponentSubSection:function(r){return f(r,"ComponentSubSection");},formatIdComponentContainer:function(r){return f(r,"ComponentContainer");},formatVisibleComponentSection:function(r){return"{= "+g(r)+" }";},formatComponentSettingsSubSection:b,formatComponentSettingsCanvas:c};},true);
