sap.ui.define(["jquery.sap.global","sap/suite/ui/generic/template/lib/TemplateAssembler","sap/suite/ui/generic/template/lib/TemplateComponent","sap/suite/ui/generic/template/detailTemplates/detailUtils","sap/suite/ui/generic/template/Canvas/controller/ControllerImplementation"],function(q,T,a,d,C){"use strict";function g(c,o){var v={};var b=d.getComponentBase(c,o,v);var s={oControllerSpecification:{getMethods:C.getMethods.bind(null,v),oControllerDefinition:{}}};return q.extend(b,s);}return T.getTemplateComponent(g,"sap.suite.ui.generic.template.Canvas",{metadata:{library:"sap.suite.ui.generic.template",properties:{"templateName":{"type":"string","defaultValue":"sap.suite.ui.generic.template.Canvas.view.Canvas"},"requiredControls":"object"},"manifest":"json"}});});
