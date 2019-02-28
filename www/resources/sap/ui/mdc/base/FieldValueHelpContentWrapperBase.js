/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/Element'],function(E){"use strict";var F=E.extend("sap.ui.mdc.base.FieldValueHelpContentWrapperBase",{metadata:{library:"sap.ui.mdc",properties:{selectedItems:{type:"object[]",defaultValue:[]}},events:{navigate:{parameters:{key:{type:"any"},description:{type:"string"}}},selectionChange:{parameters:{selectedItems:{type:"object[]"}}},dataUpdate:{parameters:{contentChange:{type:"boolean"}}}}}});F.prototype.init=function(){};F.prototype.exit=function(){};F.prototype.initialize=function(s){return this;};F.prototype.getDialogContent=function(){};F.prototype.getSuggestionContent=function(){};F.prototype.fieldHelpOpen=function(s){this._bSuggestion=s;return this;};F.prototype.fieldHelpClose=function(){delete this._bSuggestion;return this;};F.prototype.getFilterEnabled=function(){return true;};F.prototype.navigate=function(s){};F.prototype.getTextForKey=function(k){return"";};F.prototype.getKeyForText=function(t){return undefined;};F.prototype.getListBinding=function(){};F.prototype._getFieldHelp=function(){var f=this.getParent();if(!f||!f.isA("sap.ui.mdc.base.FieldValueHelp")){throw new Error(this.getId()+" must be assigned to a sap.ui.mdc.base.FieldValueHelp");}return f;};F.prototype._getKeyPath=function(){var f=this._getFieldHelp();return f._getKeyPath();};F.prototype._getDescriptionPath=function(){var f=this._getFieldHelp();return f.getDescriptionPath();};F.prototype._getMaxConditions=function(){var f=this._getFieldHelp();return f.getMaxConditions();};return F;},true);