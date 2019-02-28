sap.ui.define(['sap/ushell/components/factsheet/tools/ODataUrlTemplating','sap/ushell/components/factsheet/factory/ThingInspector','sap/ui/model/odata/ODataUtils'],function(O,T,a){"use strict";sap.ui.jsview("sap.ushell.components.factsheet.views.ThingViewer",{getControllerName:function(){return"sap.ushell.components.factsheet.views.ThingViewer";},createContent:function(c){var e,A,E,t,v,s;v=this.getViewData();e=v.entity||v.service;if(!e){E=v.entityTemplateURI||v.template;if(E){if(typeof E!=="string"){E=E[0];}E=E.replace(/%25/g,"%");E=E.replace(/%28/g,"(");E=E.replace(/%29/g,")");E=E.replace(/%27/g,"'");E=E.replace(/%3D/g,"=");E=E.replace(/%7B/g,"{");E=E.replace(/%7D/g,"}");e=O.resolve(E,v);}}A=v.annotationURI||v.annotation;if(typeof e!=="string"){e=e[0];}if(typeof A!=="string"){A=A[0];}s=e.substr(0,e.lastIndexOf("/"));function b(C,s){var S;if(sap.ui.model.odata&&a&&typeof a.setOrigin==="function"){if(!(C&&C.getComponentData())){throw new Error("no component passed");}if(C&&C.getComponentData()&&C.getComponentData().startupParameters&&C.getComponentData().startupParameters["sap-system"]){S=C.getComponentData().startupParameters["sap-system"][0];s=a.setOrigin(s,{alias:S});}}return s;}s=b(sap.ui.core.Component.getOwnerComponentFor(this),s);s=s+e.substr(e.lastIndexOf("/"));t=T(s,A);t.addStyleClass("ThingInspector");return t;}});},false);
