/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./TextField','./library','sap/ui/core/IconPool','sap/ui/core/theming/Parameters','./ValueHelpFieldRenderer'],function(T,l,I,P,V){"use strict";var a=T.extend("sap.ui.commons.ValueHelpField",{metadata:{library:"sap.ui.commons",properties:{iconURL:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},iconHoverURL:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},iconDisabledURL:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null}},events:{valueHelpRequest:{}}}});a.prototype.onBeforeRendering=function(){this.sIconDsblUrl="sap-icon://value-help";this.sIconRegularUrl="sap-icon://value-help";this.sIconHoverUrl="sap-icon://value-help";};a.prototype.onmouseover=function(e){if(e.target.id==this.getId()+'-icon'&&this.getEnabled()&&this.getEditable()&&!this.bIsIconURI){if(this.getIconHoverURL()){this.sIconHoverUrl=this.getIconHoverURL();}else if(this.getIconURL()){this.sIconHoverUrl=this.sIconRegularUrl;}else{this.sIconHoverUrl="sap-icon://value-help";}e.target.setAttribute('src',this.sIconHoverUrl);}};a.prototype.onmouseout=function(e){if(e.target.id==this.getId()+'-icon'&&this.getEnabled()&&this.getEditable()&&!this.bIsIconURI){e.target.setAttribute('src',this.sIconRegularUrl);}};a.prototype.onclick=function(e){if(e.target.id==this.getId()+'-icon'&&this.getEnabled()&&this.getEditable()){this.fireValueHelpRequest({});}};a.prototype.setEnabled=function(e){var o=this.getEnabled();T.prototype.setEnabled.apply(this,arguments);if(this.getDomRef()&&o!=e&&!this.bIsIconURI){var i=this.$("icon");if(e){i.attr('src',this.sIconRegularUrl);i.removeClass('sapUiTfValueHelpDsblIcon');i.addClass('sapUiTfValueHelpRegularIcon');}else{i.attr('src',this.sIconRegularUrl);i.removeClass('sapUiTfValueHelpRegularIcon');i.addClass('sapUiTfValueHelpDsblIcon');}}return this;};a.prototype.setEditable=function(e){var o=this.getEditable();T.prototype.setEditable.apply(this,arguments);if(this.getDomRef()&&o!=e&&!this.bIsIconURI){var i=this.$("icon");if(e){i.removeClass('sapUiTfValueHelpDsblIcon');i.addClass('sapUiTfValueHelpRegularIcon');}else{i.removeClass('sapUiTfValueHelpRegularIcon');i.addClass('sapUiTfValueHelpDsblIcon');}}return this;};a.prototype.onsapshow=function(e){this._checkChange(e);this.fireValueHelpRequest({});e.preventDefault();e.stopPropagation();};a.prototype.getTooltip_AsString=function(){var t=T.prototype.getTooltip_AsString.apply(this,arguments);if(this.getEnabled()&&this.getEditable()){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");var s=r.getText("VHF_TOOLTIP");return(t?t+" - ":"")+s;}else{return t;}};a.prototype.onThemeChanged=function(e){if(this.getDomRef()){this.invalidate();}};a.prototype.exit=function(){this.sIconRegularUrl=undefined;this.sIconHoverUrl=undefined;this.sIconDsblUrl=undefined;};return a;});
