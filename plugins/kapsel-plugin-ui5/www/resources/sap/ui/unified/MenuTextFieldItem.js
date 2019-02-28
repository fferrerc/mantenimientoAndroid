/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/ValueStateSupport','./MenuItemBase','./library','sap/ui/core/library','sap/ui/Device','jquery.sap.events'],function(q,V,M,l,c,D){"use strict";var a=c.ValueState;var b=M.extend("sap.ui.unified.MenuTextFieldItem",{metadata:{library:"sap.ui.unified",properties:{label:{type:"string",group:"Appearance",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},value:{type:"string",group:"Misc",defaultValue:null},valueState:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:a.None}}}});(function(){b.prototype.render=function(r,i,m,I){var d=r,e=m.checkEnabled(i),f=i.getId();var C="sapUiMnuItm sapUiMnuTfItm";if(I.iItemNo==1){C+=" sapUiMnuItmFirst";}else if(I.iItemNo==I.iTotalItems){C+=" sapUiMnuItmLast";}if(!m.checkEnabled(i)){C+=" sapUiMnuItmDsbl";}if(i.getStartsSection()){C+=" sapUiMnuItmSepBefore";}d.write("<li ");d.writeAttribute("class",C);d.writeElementData(i);if(I.bAccessible){d.writeAttribute("role","menuitem");d.writeAttribute("aria-disabled",!e);d.writeAttribute("aria-posinset",I.iItemNo);d.writeAttribute("aria-setsize",I.iTotalItems);}d.write("><div class=\"sapUiMnuItmL\"></div>");d.write("<div class=\"sapUiMnuItmIco\">");if(i.getIcon()){d.writeIcon(i.getIcon(),null,{title:null});}d.write("</div>");d.write("<div id=\""+f+"-txt\" class=\"sapUiMnuItmTxt\">");d.write("<label id=\""+f+"-lbl\" class=\"sapUiMnuTfItemLbl\">");d.writeEscaped(i.getLabel()||"");d.write("</label>");d.write("<div id=\""+f+"-str\" class=\"sapUiMnuTfItmStretch\"></div>");d.write("<div class=\"sapUiMnuTfItemWrppr\">");d.write("<input id=\""+f+"-tf\" tabindex=\"-1\"");d.writeAttributeEscaped("value",i.getValue()||"");d.writeAttribute("class",e?"sapUiMnuTfItemTf sapUiMnuTfItemTfEnbl":"sapUiMnuTfItemTf sapUiMnuTfItemTfDsbl");if(!e){d.writeAttribute("disabled","disabled");}if(I.bAccessible){d.writeAccessibilityState(i,{role:"textbox",disabled:!e,multiline:false,autocomplete:"none",labelledby:{value:f+"-lbl",append:true}});}d.write("/></div></div>");d.write("<div class=\"sapUiMnuItmR\"></div>");d.write("</li>");};b.prototype.hover=function(h,m){this.$().toggleClass("sapUiMnuItmHov",h);if(h&&m.checkEnabled(this)){m.closeSubmenu(false,true);if(D.browser.msie){q.sap.delayedCall(0,this,function(){this.$("tf").focus();}.bind(this));}else{this.$("tf").focus();}}};b.prototype.onAfterRendering=function(){this._adaptSizes();this.setValueState(this.getValueState());};b.prototype.onsapup=function(e){this.getParent().focus();this.getParent().onsapprevious(e);};b.prototype.onsapdown=function(e){this.getParent().focus();this.getParent().onsapnext(e);};b.prototype.onsaphome=function(e){if(this._checkCursorPosForNav(false)){this.getParent().focus();this.getParent().onsaphome(e);}};b.prototype.onsapend=function(e){if(this._checkCursorPosForNav(true)){this.getParent().focus();this.getParent().onsapend(e);}};b.prototype.onsappageup=function(e){this.getParent().focus();this.getParent().onsappageup(e);};b.prototype.onsappagedown=function(e){this.getParent().focus();this.getParent().onsappagedown(e);};b.prototype.onsapescape=function(e){this.getParent().onsapescape(e);};b.prototype.onkeydown=function(e){e.stopPropagation();};b.prototype.onclick=function(e){this.getParent().closeSubmenu(false,true);if(!D.system.desktop&&this.getParent().checkEnabled(this)){this.focus();}e.stopPropagation();};b.prototype.onkeyup=function(e){if(!q.sap.PseudoEvents.sapenter.fnCheck(e)){return;}var v=this.$("tf").val();this.setValue(v);this.getParent().selectItem(this);e.preventDefault();e.stopPropagation();};b.prototype.setSubmenu=function(m){q.sap.log.warning("The aggregation 'submenu' is not supported for this type of menu item.","","sap.ui.unified.MenuTextFieldItem");return this;};b.prototype.setLabel=function(L){this.setProperty("label",L,true);this.$("lbl").text(L);this._adaptSizes();return this;};b.prototype.setValue=function(v){this.setProperty("value",v,true);this.$("tf").val(v);return this;};b.prototype.setValueState=function(v){this.setProperty("valueState",v,true);var $=this.$("tf");$.toggleClass("sapUiMnuTfItemTfErr",v==a.Error);$.toggleClass("sapUiMnuTfItemTfWarn",v==a.Warning);var t=V.enrichTooltip(this,this.getTooltip_AsString());this.$().attr("title",t?t:"");return this;};b.prototype.getFocusDomRef=function(){var f=this.$("tf");return f.length?f.get(0):null;};b.prototype._adaptSizes=function(){var $=this.$("tf");var d=this.$("lbl");var o=d.length?d.get(0).offsetLeft:0;if(sap.ui.getCore().getConfiguration().getRTL()){$.parent().css({"width":"auto","right":(this.$().outerWidth(true)-o+(d.outerWidth(true)-d.outerWidth()))+"px"});}else{$.parent().css({"width":"auto","left":(o+d.outerWidth(true))+"px"});}};b.prototype._checkCursorPosForNav=function(f){var r=sap.ui.getCore().getConfiguration().getRTL();var B=f?r:!r;var $=this.$("tf");var p=$.cursorPos();var L=$.val().length;if(r){p=L-p;}if((!B&&p!=L)||(B&&p!=0)){return false;}return true;};}());return b;});
