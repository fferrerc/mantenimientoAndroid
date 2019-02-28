/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/layout/VerticalLayout','sap/ui/layout/VerticalLayoutRenderer','sap/m/Label'],function(V,a,L){"use strict";var F=V.extend("sap.ui.mdc.base.filterbar.FilterItemLayout",{renderer:a.render});F.prototype._setLabel=function(f){this._oLabel=new L();if(f.getFieldPath()==="$search"){this._oLabel.setText("\u2008");}else{this._oLabel.addStyleClass("sapUiMdcBaseFilterBarLabel");if(f.getLabel){this._oLabel.setText(f.getLabel());this._oLabel.setTooltip(f.getLabel());}else{this._oLabel.setText(f.getFieldPath());}}this._oLabel.setLabelFor(f);if(f.addAriaLabeldBy){f.addAriaLabeldBy(this._oLabel);}};F.prototype._getFilterField=function(){return this._oFilterField;};F.prototype.setFilterField=function(f){this._setLabel(f);this._oFilterField=f;};F.prototype.getContent=function(){var c=[];c.push(this._oLabel);c.push(this._oFilterField);return c;};F.prototype.exit=function(){this._oFilterField=null;this._oLabel=null;};return F;},true);
