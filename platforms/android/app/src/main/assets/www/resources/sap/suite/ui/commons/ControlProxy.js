sap.ui.define(["./library","sap/ui/core/Control"],function(l,C){"use strict";var a=C.extend("sap.suite.ui.commons.ControlProxy",{metadata:{library:"sap.suite.ui.commons",association:{control:{type:"sap.ui.core.Control",multiple:false}}},renderer:function(r,i){var I=i.getAssociation("control"),i=sap.ui.getCore().byId(I);r.renderControl(i);}});return a;},true);
