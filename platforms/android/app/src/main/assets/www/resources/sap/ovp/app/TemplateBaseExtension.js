sap.ui.define(["sap/ui/core/mvc/ControllerExtension","sap/ui/core/mvc/OverrideExecution"],function(C,O){"use strict";return C.extend("sap.ovp.app.TemplateBaseExtension",{metadata:{methods:{provideExtensionAppStateData:{"public":true,"final":false,overrideExecution:O.After},restoreExtensionAppStateData:{"public":true,"final":false,overrideExecution:O.After},addFilters:{"public":true,"final":false,overrideExecution:O.After},modifyLayeredStartupExtension:{"public":true,"final":false,overrideExecution:O.After},doExtensionNavigation:{"public":true,"final":false,overrideExecution:O.After}}},provideExtensionAppStateData:function(s){},restoreExtensionAppStateData:function(g){},addFilters:function(a){},modifyLayeredStartupExtension:function(c){},doExtensionNavigation:function(c,o,n){}});});