/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Control','sap/ui/core/delegate/ScrollEnablement','sap/ui/Device','sap/ui/core/InvisibleText','sap/ui/core/ResizeHandler','./TokenizerRenderer',"sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/control"],function(l,C,S,D,I,R,T,c,K,L,q){"use strict";var a=C.extend("sap.m.Tokenizer",{metadata:{library:"sap.m",properties:{editable:{type:"boolean",group:"Misc",defaultValue:true},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},maxWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"}},defaultAggregation:"tokens",aggregations:{tokens:{type:"sap.m.Token",multiple:true,singularName:"token"},_tokensInfo:{type:"sap.ui.core.InvisibleText",multiple:false,visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{tokenChange:{parameters:{type:{type:"string"},token:{type:"sap.m.Token"},tokens:{type:"sap.m.Token[]"},addedTokens:{type:"sap.m.Token[]"},removedTokens:{type:"sap.m.Token[]"}}},tokenUpdate:{allowPreventDefault:true,parameters:{type:{type:"string"},addedTokens:{type:"sap.m.Token[]"},removedTokens:{type:"sap.m.Token[]"}}}}}});var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");a.prototype.init=function(){this.bAllowTextSelection=false;this._oTokensWidthMap={};this._oIndicator=null;this._bAdjustable=false;this._aTokenValidators=[];this._oScroller=new S(this,this.getId()+"-scrollContainer",{horizontal:true,vertical:false,nonTouchScrolling:true});if(sap.ui.getCore().getConfiguration().getAccessibility()){var A=new I({text:r.getText("TOKENIZER_ARIA_CONTAIN_TOKEN")});this.setAggregation("_tokensInfo",A);}};a.prototype._handleNMoreIndicatorPress=function(f){this._fnOnNMorePress=f;};a.prototype._hasMoreIndicator=function(){var d=this.$();return!!d.length&&this.$().find(".sapMHiddenToken").length>0;};a.prototype._adjustTokensVisibility=function(){if(!this.getDomRef()){return;}var t=parseInt(this.getMaxWidth()),b=this.getTokens().reverse(),i=b.length,d,f,e,F=-1;b.some(function(o,g){t=t-this._oTokensWidthMap[o.getId()];if(t<=0){F=g;return true;}else{f=t;}}.bind(this));if(F>-1){for(e=0;e<i;e++){if(e>=F){b[e].addStyleClass("sapMHiddenToken");}else{b[e].removeStyleClass("sapMHiddenToken");}}this._handleNMoreIndicator(i-F);d=this._oIndicator.width();if(d>=f){F=F-1;this._handleNMoreIndicator(i-F);b[F].addStyleClass("sapMHiddenToken");}}else{this._showAllTokens();}};a.prototype._handleNMoreIndicator=function(h){if(!this.getDomRef()){return this;}if(h){var s="MULTIINPUT_SHOW_MORE_TOKENS";if(h===this.getTokens().length){this.$().css("overflow","visible");if(h===1){s="TOKENIZER_SHOW_ALL_ITEM";}else{s="TOKENIZER_SHOW_ALL_ITEMS";}}this._oIndicator.removeClass("sapUiHidden");this._oIndicator.html(r.getText(s,h));}else{this.$().css("overflow","hidden");this._oIndicator.addClass("sapUiHidden");}return this;};a.prototype._showAllTokens=function(){this._handleNMoreIndicator(0);this.getTokens().forEach(function(t){t.removeStyleClass("sapMHiddenToken");});};a.prototype.getScrollDelegate=function(){return this._oScroller;};a.prototype.scrollToEnd=function(){var d=this.getDomRef(),t;if(!d){return;}if(!this._sResizeHandlerId){t=this;this._sResizeHandlerId=R.register(d,function(){t.scrollToEnd();});}var s=this.$().find(".sapMTokenizerScrollContainer")[0];d.scrollLeft=s.scrollWidth;};a.prototype.setWidth=function(w){this.setProperty("width",w,true);this.$().css("width",this.getWidth());return this;};a.prototype.setMaxWidth=function(w){this.setProperty("maxWidth",w,true);this.$().css("max-width",this.getMaxWidth());if(this.getDomRef()&&this._getAdjustable()){this._adjustTokensVisibility();}return this;};a.prototype._getIndicatorVisibility=function(){return this._oIndicator&&!this._oIndicator.hasClass("sapUiHidden");};a.prototype._setAdjustable=function(A){this._bAdjustable=A;};a.prototype._getAdjustable=function(){return this._bAdjustable;};a.prototype.setPixelWidth=function(n){if(typeof n!=="number"){L.warning("Tokenizer.setPixelWidth called with invalid parameter. Expected parameter of type number.");return;}this.setWidth(n+"px");if(this._oScroller){this._oScroller.refresh();}};a.prototype.scrollToStart=function(){var d=this.getDomRef();if(!d){return;}this._deactivateScrollToEnd();d.scrollLeft=0;};a.prototype._deactivateScrollToEnd=function(){this._deregisterResizeHandler();};a.prototype.getScrollWidth=function(){if(!this.getDomRef()){return 0;}return this.$().children(".sapMTokenizerScrollContainer")[0].scrollWidth;};a.prototype.onBeforeRendering=function(){this._setTokensAria();this._deregisterResizeHandler();};a.prototype.onAfterRendering=function(){if(!this._sResizeHandlerId){var t=this;this._sResizeHandlerId=R.register(this.getDomRef(),function(){t.scrollToEnd();});}this._oIndicator=this.$().find(".sapMTokenizerIndicator");};a.prototype.onThemeChanged=function(){if(!this._getAdjustable()){return;}this.getTokens().forEach(function(t){if(t.getDomRef()&&!t.$().hasClass("sapMHiddenToken")){this._oTokensWidthMap[t.getId()]=t.getDomRef().offsetWidth;}}.bind(this));this._adjustTokensVisibility();};a.prototype._useCollapsedMode=function(b){if(b){this._adjustTokensVisibility();}else{this._showAllTokens();}};a.prototype.invalidate=function(o){var p=this.getParent();if(p instanceof sap.m.MultiInput){p.invalidate(o);}else{C.prototype.invalidate.call(this,o);}};a.prototype.onsapfocusleave=function(e){if(document.activeElement==this.getDomRef()||!this._checkFocus()){this._changeAllTokensSelection(false);this._oSelectionOrigin=null;}};a.prototype.isAllTokenSelected=function(){if(this.getTokens().length===this.getSelectedTokens().length){return true;}return false;};a.prototype.onkeydown=function(e){if(e.which===K.TAB){this._changeAllTokensSelection(false);}if((e.ctrlKey||e.metaKey)&&e.which===K.A){this._iSelectedToken=this.getSelectedTokens().length;if(this.getTokens().length>0){this.focus();this._changeAllTokensSelection(true);e.preventDefault();}}if((e.ctrlKey||e.metaKey)&&(e.which===K.C||e.which===K.INSERT)){this._copy();}if(((e.ctrlKey||e.metaKey)&&e.which===K.X)||(e.shiftKey&&e.which===K.DELETE)){if(this.getEditable()){this._cut();}else{this._copy();}}};a.prototype._copy=function(){var s=this.getSelectedTokens(),b="",t,d=function(e){if(e.clipboardData){e.clipboardData.setData('text/plain',b);}else{e.originalEvent.clipboardData.setData('text/plain',b);}e.preventDefault();};for(var i=0;i<s.length;i++){t=s[i];b+=(i>0?"\r\n":"")+t.getText();}if(!b){return;}if(D.browser.msie&&window.clipboardData){window.clipboardData.setData("text",b);}else{document.addEventListener('copy',d);document.execCommand('copy');document.removeEventListener('copy',d);}};a.prototype._cut=function(){var s=this,b=s.getSelectedTokens(),d="",e=[],f,t,g=function(E){if(E.clipboardData){E.clipboardData.setData('text/plain',d);}else{E.originalEvent.clipboardData.setData('text/plain',d);}E.preventDefault();};f=s.fireTokenUpdate({addedTokens:[],removedTokens:e,type:a.TokenUpdateType.Removed});for(var i=0;i<b.length;i++){t=b[i];d+=(i>0?"\r\n":"")+t.getText();if(f&&t.getEditable()){s.removeToken(t);e.push(t);t.destroy();}}if(!d){return;}if(D.browser.msie&&window.clipboardData){window.clipboardData.setData("text",d);}else{document.addEventListener('cut',g);document.execCommand('cut');document.removeEventListener('cut',g);}};a.prototype.onsapbackspace=function(e){if(this.getSelectedTokens().length===0){this.onsapprevious(e);}else if(this.getEditable()){this._removeSelectedTokens();}e.preventDefault();e.stopPropagation();};a.prototype.onsapdelete=function(e){if(this.getEditable()){this._removeSelectedTokens();}};a.prototype._ensureTokenVisible=function(t){if(!t||!t.getDomRef()||!this.getDomRef()){return;}var i=this.$().offset().left,b=this.$().width(),d=t.$().offset().left,e=t.$().width();if(this.getTokens().indexOf(t)==0){this.$().scrollLeft(0);return;}if(d<i){this.$().scrollLeft(this.$().scrollLeft()-i+d);}if(d-i+e>b){this.$().scrollLeft(this.$().scrollLeft()+(d-i+e-b));}};a.prototype.onsapprevious=function(e){if(e.which===K.ARROW_UP){return;}var i=this.getTokens().length;if(i===0){return;}var f=q(document.activeElement).control()[0];var b=f?this.getTokens().indexOf(f):-1;if(b==0){return;}var t;if(b>0){t=this.getTokens()[b-1];this._changeAllTokensSelection(false,t);t._changeSelection(true);t.focus();}else{t=this.getTokens()[this.getTokens().length-1];t._changeSelection(true);t.focus();}this._deactivateScrollToEnd();this._ensureTokenVisible(t);e.setMarked();};a.prototype.onsapnext=function(e){if(e.which===K.ARROW_DOWN){return;}var i=this.getTokens().length;if(i===0){return;}var f=q(document.activeElement).control()[0];var b=f?this.getTokens().indexOf(f):-1;if(b<i-1){var n=this.getTokens()[b+1];this._changeAllTokensSelection(false,n);n._changeSelection(true);n.focus();this._ensureTokenVisible(n);}else{return;}this._deactivateScrollToEnd();e.setMarked();};a.prototype.addValidator=function(v){if(typeof(v)==="function"){this._aTokenValidators.push(v);}};a.prototype.removeValidator=function(v){var i=this._aTokenValidators.indexOf(v);if(i!==-1){this._aTokenValidators.splice(i,1);}};a.prototype.removeAllValidators=function(){this._aTokenValidators=[];};a.prototype._validateToken=function(p,v){var t=p.token;var s;if(t&&t.getText()){s=t.getText();}else{s=p.text;}var V=p.validationCallback;var o=p.suggestionObject;var i,b,d;if(!v){v=this._aTokenValidators;}d=v.length;if(d===0){if(!t&&V){V(false);}return t;}for(i=0;i<d;i++){b=v[i];t=b({text:s,suggestedToken:t,suggestionObject:o,asyncCallback:this._getAsyncValidationCallback(v,i,s,o,V)});if(!t){if(V){V(false);}return null;}if(t===a.WaitForAsyncValidation){return null;}}return t;};a.prototype._getAsyncValidationCallback=function(v,V,i,s,f){var t=this,A;return function(o){if(o){v=v.slice(V+1);o=t._validateToken({text:i,token:o,suggestionObject:s,validationCallback:f},v);A=t._addUniqueToken(o,f);if(A){t.fireTokenUpdate({addedTokens:[o],removedTokens:[],type:a.TokenUpdateType.Added});}}else{if(f){f(false);}}};};a.prototype.addValidateToken=function(p){var t=this._validateToken(p);this._addUniqueToken(t,p.validationCallback);};a.prototype._addValidateToken=function(p){var t=this._validateToken(p),A=this._addUniqueToken(t,p.validationCallback);if(A){this.fireTokenUpdate({addedTokens:[t],removedTokens:[],type:a.TokenUpdateType.Added});}};a.prototype._addUniqueToken=function(t,v){if(!t){return false;}var b=this._tokenExists(t);if(b){var p=this.getParent();if(p instanceof sap.m.MultiInput&&v){v(false);}return false;}this.addToken(t);if(v){v(true);}this.fireTokenChange({addedTokens:[t],removedTokens:[],type:a.TokenChangeType.TokensChanged});return true;};a.prototype._parseString=function(s){return s.split(/\r\n|\r|\n/g);};a.prototype._checkFocus=function(){return this.getDomRef()&&c(this.getDomRef(),document.activeElement);};a.prototype._tokenExists=function(t){var b=this.getTokens();if(!(b&&b.length)){return false;}var k=t.getKey();if(!k){return false;}var d=b.length;for(var i=0;i<d;i++){var e=b[i];var f=e.getKey();if(f===k){return true;}}return false;};a.prototype.addToken=function(t,s){var p=this.getParent();if(p instanceof sap.m.MultiInput){if(p.getMaxTokens()!==undefined&&p.getTokens().length>=p.getMaxTokens()){return this;}}this.addAggregation("tokens",t,s);this.fireTokenChange({token:t,type:a.TokenChangeType.Added});t.addEventDelegate({onAfterRendering:function(){if(sap.ui.getCore().isThemeApplied()&&t.getDomRef()&&!t.$().hasClass("sapMHiddenToken")){this._oTokensWidthMap[t.getId()]=t.getDomRef().offsetWidth;}}.bind(this)});return this;};a.prototype.removeToken=function(t){t=this.removeAggregation("tokens",t);this._bScrollToEndIsActive=true;this.fireTokenChange({token:t,type:a.TokenChangeType.Removed});return t;};a.prototype.setTokens=function(t){var o=this.getTokens();this.removeAllTokens(false);var i;for(i=0;i<t.length;i++){this.addToken(t[i],true);}this.invalidate();this.fireTokenChange({addedTokens:t,removedTokens:o,type:a.TokenChangeType.TokensChanged});};a.prototype.removeAllTokens=function(f){var t=this.getTokens();var b=this.removeAllAggregation("tokens");if(typeof(f)==="boolean"&&!f){return b;}this.fireTokenChange({addedTokens:[],removedTokens:t,type:a.TokenChangeType.TokensChanged});this.fireTokenChange({tokens:t,type:a.TokenChangeType.RemovedAll});return b;};a.prototype.updateTokens=function(){this.destroyTokens();this.updateAggregation("tokens");};a.prototype._removeSelectedTokens=function(){var t=this.getSelectedTokens();var b,i,d,e;d=t.length;if(d===0){return this;}e=this.fireTokenUpdate({addedTokens:[],removedTokens:t,type:a.TokenUpdateType.Removed});if(!e){return;}for(i=0;i<d;i++){b=t[i];if(b.getEditable()){b.destroy();}}this.scrollToEnd();this.fireTokenChange({addedTokens:[],removedTokens:t,type:a.TokenChangeType.TokensChanged});var p=this.getParent(),f=p&&p instanceof sap.m.MultiInput;if(f){if(!p._bUseDialog){p.$('inner').focus();}}else{this.focus();}this._doSelect();return this;};a.prototype.selectAllTokens=function(s){if(s===undefined){s=true;}var t=this.getTokens(),b=t.length,i;for(i=0;i<b;i++){t[i].setSelected(s);}this._doSelect();return this;};a.prototype._changeAllTokensSelection=function(s,b){var t=this.getTokens(),d=t.length,e,i;for(i=0;i<d;i++){e=t[i];if(e!==b){e._changeSelection(s);}}this._doSelect();return this;};a.prototype.getSelectedTokens=function(){var s=[],t=this.getTokens(),i,b,d=t.length;for(i=0;i<d;i++){b=t[i];if(b.getSelected()){s.push(b);}}return s;};a.prototype._onTokenDelete=function(t){if(t&&this.getEditable()){var e=this.fireTokenUpdate({addedTokens:[],removedTokens:[t],type:a.TokenUpdateType.Removed});if(!e){return;}delete this._oTokensWidthMap[t.getId()];t.destroy();this.fireTokenChange({addedTokens:[],removedTokens:[t],type:a.TokenChangeType.TokensChanged});}};a.prototype._onTokenSelect=function(t,b,s){var d=this.getTokens(),o,i;if(s){var f=this._getFocusedToken();if(!f){this._oSelectionOrigin=null;return;}if(this._oSelectionOrigin){f=this._oSelectionOrigin;}else{this._oSelectionOrigin=f;}var F=this.indexOfToken(f),e=this.indexOfToken(t),m=Math.min(F,e),M=Math.max(F,e);for(i=0;i<d.length;i++){o=d[i];if(i>=m&&i<=M){o._changeSelection(true);}else if(!b){o._changeSelection(false);}}return;}this._oSelectionOrigin=null;if(b){return;}this._oSelectionOrigin=t;for(i=0;i<d.length;i++){o=d[i];if(o!==t){o._changeSelection(false);}}};a.prototype._getFocusedToken=function(){var f=sap.ui.getCore().byId(document.activeElement.id);if(!f||!(f instanceof sap.m.Token)||this.indexOfToken(f)==-1){return null;}return f;};a.prototype.setEditable=function(e){this.$().toggleClass("sapMTokenizerReadonly",!e);return this.setProperty("editable",e,true);};a.prototype.onsaphome=function(e){this.scrollToStart();};a.prototype.onsapend=function(e){this.scrollToEnd();};a.prototype.onclick=function(e){var f;f=q(e.target).hasClass("sapMTokenizerIndicator")||(e.target===this.getFocusDomRef());if(f){this._fnOnNMorePress&&this._fnOnNMorePress(e);}};a.prototype.ontouchstart=function(e){e.setMarked();if(D.browser.chrome&&window.getSelection()){window.getSelection().removeAllRanges();}};a.prototype.exit=function(){this._deregisterResizeHandler();};a.prototype._deregisterResizeHandler=function(){if(this._sResizeHandlerId){R.deregister(this._sResizeHandlerId);delete this._sResizeHandlerId;}};a.prototype._setTokensAria=function(){var t=this.getTokens().length,i,s="";if(sap.ui.getCore().getConfiguration().getAccessibility()){i=this.getAggregation("_tokensInfo");switch(t){case 0:s=r.getText("TOKENIZER_ARIA_CONTAIN_TOKEN");break;case 1:s=r.getText("TOKENIZER_ARIA_CONTAIN_ONE_TOKEN");break;default:s=r.getText("TOKENIZER_ARIA_CONTAIN_SEVERAL_TOKENS",t);break;}i.setText(s);}};a.prototype._doSelect=function(){if(this._checkFocus()&&this._bCopyToClipboardSupport){var f=document.activeElement;var s=window.getSelection();s.removeAllRanges();if(this.getSelectedTokens().length){var o=document.createRange();o.selectNodeContents(this.getDomRef("clip"));s.addRange(o);}if(window.clipboardData&&f.id==this.getId()+"-clip"&&this.getDomRef()){this.getDomRef().focus();}}};a.prototype.getReverseTokens=function(){return!!this._reverseTokens;};a.prototype.setReverseTokens=function(b){this._reverseTokens=b;};a.prototype.getTokensInfoId=function(){return this.getAggregation("_tokensInfo").getId();};a.TokenChangeType={Added:"added",Removed:"removed",RemovedAll:"removedAll",TokensChanged:"tokensChanged"};a.TokenUpdateType={Added:"added",Removed:"removed"};a.WaitForAsyncValidation="sap.m.Tokenizer.WaitForAsyncValidation";return a;});
