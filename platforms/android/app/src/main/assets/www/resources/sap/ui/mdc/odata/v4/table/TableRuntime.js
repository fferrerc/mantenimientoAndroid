/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/model/json/JSONModel"],function(J){"use strict";var T={setContexts:function(t,m,p){var s=t.getSelectedContexts();var c="/$contexts/"+p;var C=t.getModel(m);if(!C){C=new J();t.setModel(C,"$contexts");}C.setProperty("/$contexts",{});C.setProperty(c,{selectedContexts:s,numberOfSelectedContexts:s.length});for(var i=0;i<s.length;i++){var o=s[i].getObject();for(var k in o){if(k.indexOf("#")===0){var a=k;a=a.substring(1,a.length);var M=C.getProperty(c);M[a]=true;C.setProperty(c,M);}}}}};return T;},true);
