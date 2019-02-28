/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['./InfoTile'],function(I){"use strict";var C=I.extend("sap.suite.ui.commons.ChartTile",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{unit:{type:"string",group:"Misc",defaultValue:null}}}});C.prototype.init=function(){I.prototype.init.apply(this);};C.prototype.onAfterRendering=function(){this._addDescriptionMargin();};C.prototype.onBeforeRendering=function(){this._setContentProperty("size",this.getSize());};C.prototype._addDescriptionMargin=function(){if(this.getDescription()&&this.getUnit()){var d=this.$("description").hide();var w=this.$("unit").outerWidth()+1;d.css("margin-right","-"+w+"px").css("padding-right",w+"px").show();}};C.prototype._setContentProperty=function(p,v){var c=this.getContent();if(c){c.setProperty(p,v);}};return C;});
