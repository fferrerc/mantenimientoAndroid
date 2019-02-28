/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/base/security/encodeCSS","sap/ui/thirdparty/jquery"],function(l,e,q){"use strict";var G=l.GenericTileScope;var L=l.LoadState;var a={};a.render=function(r,c){var t=c._getTooltipText(),i=c._isScreenLarge(),A=c._getAriaText(),s=e("sapMGTScope"+c.getScope()),h=c.hasListeners("press");this._bRTL=sap.ui.getCore().getConfiguration().getRTL();r.write("<span");r.writeControlData(c);r.writeAttributeEscaped("aria-label",A);if(h){r.writeAttribute("role","button");}else{r.writeAttribute("role","presentation");}r.addClass("sapMGT");r.addClass(s);r.addClass("sapMGTLineMode");this._writeDirection(r);if(t){r.writeAttributeEscaped("title",t);}var S=c.getState();if(S!==L.Disabled){r.addClass("sapMPointer");r.writeAttribute("tabindex","0");}else{r.addClass("sapMGTDisabled");}if(S===L.Failed){r.addClass("sapMGTFailed");}r.writeClasses();r.write(">");if(i){r.write("<div");r.writeAttribute("id",c.getId()+"-startMarker");r.addClass("sapMGTStartMarker");r.writeClasses();r.write("></div>");this._renderFailedIcon(r,c);this._renderHeader(r,c);if(c.getSubheader()){this._renderSubheader(r,c);}r.write("<div");r.writeAttribute("id",c.getId()+"-endMarker");r.addClass("sapMGTEndMarker");r.writeClasses();r.write(">");if(c.getScope()===G.Actions){this._renderActionsScope(r,c);}r.write("</div>");r.write("<div");r.writeAttribute("id",c.getId()+"-styleHelper");r.addClass("sapMGTStyleHelper");r.writeClasses();r.write("></div>");}else{if(c.getState()!==L.Disabled){this._renderFocusDiv(r,c);}r.write("<div");r.writeAttribute("id",c.getId()+"-touchArea");r.addClass("sapMGTTouchArea");r.writeClasses();r.write(">");this._renderFailedIcon(r,c);r.write("<span");r.writeAttribute("id",c.getId()+"-lineModeHelpContainer");r.addClass("sapMGTLineModeHelpContainer");r.writeClasses();r.write(">");this._renderHeader(r,c);if(c.getSubheader()){this._renderSubheader(r,c);}r.write("</span>");if(c.getScope()===G.Actions){this._renderActionsScope(r,c);}r.write("</div>");}r.write("</span>");};a._writeDirection=function(r){if(this._bRTL){r.writeAttribute("dir","rtl");}};a._renderFailedIcon=function(r,c){if(c.getState()===L.Failed){if(c._isCompact()){c._oWarningIcon.setSize("1.25rem");}else{c._oWarningIcon.setSize("1.375rem");}r.renderControl(c._oWarningIcon.addStyleClass("sapMGTLineModeFailedIcon"));}};a._renderHeader=function(r,c){r.write("<span");this._writeDirection(r);r.addClass("sapMGTHdrTxt");r.writeClasses();r.writeAttribute("id",c.getId()+"-hdr-text");r.write(">");r.writeEscaped(c._oTitle.getText());r.write("</span>");};a._renderSubheader=function(r,c){r.write("<span");this._writeDirection(r);r.addClass("sapMGTSubHdrTxt");r.writeClasses();r.writeAttribute("id",c.getId()+"-subHdr-text");r.write(">");r.writeEscaped(c._oSubTitle.getText());r.write("</span>");};a._renderActionsScope=function(r,c){if(c.getState()!==L.Disabled){r.write("<span");r.writeAttribute("id",c.getId()+"-actions");r.addClass("sapMGTActionsContainer");r.writeClasses();r.write(">");r.renderControl(c._oMoreIcon);r.renderControl(c._oRemoveButton);r.write("</span>");}};a._updateHoverStyle=function(){var s=this.$("styleHelper"),o,i=0,h="";s.empty();if(!this._oStyleData||this.$().is(":hidden")){return;}if(this._oStyleData.rtl){s.css("right",-this._oStyleData.positionRight);}else{s.css("left",-this._oStyleData.positionLeft);}for(i;i<this._oStyleData.lines.length;i++){o=this._oStyleData.lines[i];var r=q("<div class='sapMGTLineStyleHelper'><div class='sapMGTLineStyleHelperInner' /></div>");if(this._oStyleData.rtl){r.css("right",o.offset.x+"px");}else{r.css("left",o.offset.x+"px");}r.css({top:o.offset.y+"px",width:o.width+"px",height:o.height});h+=q.trim(r.get(0).outerHTML);}s.html(h);};a._renderFocusDiv=function(r,c){r.write("<div");r.writeAttribute("id",c.getId()+"-focus");r.addClass("sapMGTFocusDiv");r.writeClasses();r.write(">");r.write("</div>");};a._getCSSPixelValue=function(o,p){var O=o instanceof q?o:o.$(),m=(O.css(p)||"").match(/([^a-zA-Z\%]*)(.*)/),v=parseFloat(m[1]),u=m[2];return(u==="px")?v:v*16;};return a;},true);
