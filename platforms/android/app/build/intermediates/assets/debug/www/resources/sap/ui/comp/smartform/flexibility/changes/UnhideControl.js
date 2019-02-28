/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var U={};U.applyChange=function(c,g,p){var m=p.modifier;var f=m.getAggregation(g,"elements");var P=f.some(function(F){return m.getVisible(F);});if(!P){f.forEach(function(F){m.setVisible(F,true);});}var l=m.getAggregation(g,"label");var L;if(l&&(typeof l!=="string")){m.setVisible(l,true);L=m.getSelector(l,p.appComponent);}m.setVisible(g,true);c.setRevertData({partiallyVisible:P,visibleLabel:L});return true;};U.completeChangeContent=function(c,s){var C=c.getDefinition();if(!C.content){C.content={};}};U.revertChange=function(c,g,p){var m=p.modifier;var r=c.getRevertData();var f=m.getAggregation(g,"elements");if(!r.partiallyVisible){f.forEach(function(F){m.setVisible(F,false);});}if(r.visibleLabel){m.setVisible(r.visibleLabel,false);}m.setVisible(g,false);c.resetRevertData();return true;};return U;},true);
