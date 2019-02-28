/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/delegate/ItemNavigation","sap/base/assert","sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes"],function(q,I,a,c,K){"use strict";function s(S,p){var d=S.length-p.length;return d>=0&&S.lastIndexOf(p)===d;}var T=I.extend("sap.suite.ui.commons.TimelineNavigator",{constructor:function(d,i,n,r){I.apply(this,arguments);this.setCycling(false);this._aRows=r;this.iActiveTabIndex=0;this.iTabIndex=0;this.bRefocusOnNextUpdate=false;}});T.prototype.updateReferences=function(d,i,r){this.oDomRef=d;this.setItemDomRefs(i);this._aRows=r;if(this.bRefocusOnNextUpdate){this._refocusItem();this.bRefocusOnNextUpdate=false;}};T.prototype.refocusOnNextUpdate=function(){this.bRefocusOnNextUpdate=true;};T.prototype._refocusItem=function(){var i=this.iFocusedIndex;if(i<0){return;}while(!q(this.aItemDomRefs[i]).is(":visible")){i++;if(i>=this.aItemDomRefs.length){i=0;}if(i===this.iFocusedIndex){break;}}setTimeout(function(){if(this.aItemDomRefs){this.focusItem(i);}}.bind(this),0);};T.prototype.setItemDomRefs=function(b){a(Array.isArray(b),"aItemDomRefs must be an array of DOM elements");this.aItemDomRefs=b;if(this.iFocusedIndex>b.length-1){this.iFocusedIndex=b.length-1;}for(var i=0;i<this.aItemDomRefs.length;i++){if(this.aItemDomRefs[i]){var $=q(this.aItemDomRefs[i]);if(i==this.iFocusedIndex&&!$.data("sap.INRoot")){$.attr("tabIndex",this.iActiveTabIndex);}else if($.attr("tabindex")=="0"){$.attr("tabIndex",this.iTabIndex);}$.data("sap.INItem",true);$.data("sap.InNavArea",true);if($.data("sap.INRoot")&&i!=this.iFocusedIndex){$.data("sap.INRoot").setNestedItemsTabindex();}}}return this;};I.prototype.setItemsTabindex=function(){for(var i=0;i<this.aItemDomRefs.length;i++){if(this.aItemDomRefs[i]){var $=q(this.aItemDomRefs[i]);if($.is(":sapFocusable")){if(i==this.iFocusedIndex&&!$.data("sap.INRoot")){$.attr("tabIndex",this.iActiveTabIndex);}else{$.attr("tabIndex",this.iTabIndex);}}}}return this;};I.prototype.setFocusedIndex=function(i){var $;if(this.aItemDomRefs.length<0){this.iFocusedIndex=-1;return this;}if(i<0){i=0;}if(i>this.aItemDomRefs.length-1){i=this.aItemDomRefs.length-1;}if(this.iFocusedIndex!==-1&&this.aItemDomRefs.length>this.iFocusedIndex){q(this.aItemDomRefs[this.iFocusedIndex]).attr("tabIndex",this.iTabIndex);$=q(this.aItemDomRefs[this.iFocusedIndex]);if($.data("sap.INRoot")&&i!=this.iFocusedIndex){q($.data("sap.INRoot").aItemDomRefs[$.data("sap.INRoot").iFocusedIndex]).attr("tabIndex",this.iTabIndex);}}this.iFocusedIndex=i;var f=this.aItemDomRefs[this.iFocusedIndex];$=q(this.aItemDomRefs[this.iFocusedIndex]);if(!$.data("sap.INRoot")){q(f).attr("tabIndex",this.iActiveTabIndex);}return this;};T.prototype._callParent=function(f,A){if(typeof I.prototype[f]==="function"){I.prototype[f].apply(this,A);}};T.prototype._onF7=function(e){if(!c(this.oDomRef,e.target)){return;}var f=this.getFocusedIndex();if(f>=0){this.focusItem(f,e);e.preventDefault();e.stopPropagation();}};T.prototype.onsapspace=function(e){this.onsapenter(e);};T.prototype.onsapenter=function(e){var i,$;if(this._skipNavigation(e,false,true)){return;}$=q(this.getFocusedDomRef());i=$.attr("id");if(s(i,"-outline")){if($.hasClass("sapSuiteUiCommonsTimelineGroupHeaderMainWrapper")){i=i.substr(0,i.length-"outline".length)+"groupCollapseIcon";$.find("#"+i).mousedown().mouseup().click();}else{$.find("div[role='toolbar']").children().first().mousedown().mouseup().click();this.fireEvent("Enter",{domRef:$.get(0)});}e.preventDefault();e.stopPropagation();}};T.prototype.onsaphome=function(e){if(this.aItemDomRefs.length===0){return;}if(this._skipNavigation(e,false,false)){return;}this._callParent("onsaphome",arguments);};T.prototype.onkeydown=function(e){this._callParent("onkeydown",arguments);if(e.keyCode===K.F7){this._onF7(e);}};T.prototype.onmousedown=function(e){var S=e.target;var b=function(d,o){var f=false;var C=q(d);while(!C.is(":sapFocusable")&&C.get(0)!=o){C=C.parent();}if(C.get(0)!=o){f=true;}return f;};if(c(this.oDomRef,S)){for(var i=0;i<this.aItemDomRefs.length;i++){var o=this.aItemDomRefs[i];if(c(o,S)){if(o===S||!b(S,o)){this.focusItem(i,e);}return;}}this._bMouseDownHappened=true;setTimeout(function(){this._bMouseDownHappened=false;}.bind(this),20);}};T.prototype.onsapnext=function(e){var i,f=true,C,n,o;if(!this._aRows){this._callParent("onsapnext",arguments);return;}if(this._skipNavigation(e,true,false)){return;}e.preventDefault();e.stopPropagation();if(this.getFocusedIndex()<0){return;}C=this._findPosition(this.iFocusedIndex);if(C===null){throw new Error("TimelineNavigation cannot obtain a position of focused item and hance it cannot senect next.");}n=Object.assign({},C);do{if(e.keyCode===K.ARROW_DOWN){n.iY++;if(n.iY>=this._aRows.length){if(n.iX+1>=this._aRows[this._aRows.length-1].length){return;}n.iY=0;n.iX++;}}else{n.iX++;if(n.iX>=this._aRows[n.iY].length){if(n.iY+1>=this._aRows.length){return;}n.iX=0;n.iY++;}}if(n.iX===C.iX&&n.iY===C.iY){if(f){f=false;}else{return;}}o=this._aRows[n.iY][n.iX];}while(!o||!q(o).is(":sapFocusable"));i=this._findIndex(n);this.focusItem(i,e);};T.prototype.onsapprevious=function(e){var i,f=true,C,n,o;if(!this._aRows){this._callParent("onsapprevious",arguments);return;}if(this._skipNavigation(e,true,false)){return;}e.preventDefault();e.stopPropagation();if(this.getFocusedIndex()<0){return;}C=this._findPosition(this.iFocusedIndex);if(C===null){throw new Error("TimelineNavigation cannot obtain a position of focused item and hance it cannot senect next.");}n=Object.assign({},C);do{if(e.keyCode===K.ARROW_UP){n.iY--;if(n.iY<0){if(n.iX<=0){return;}n.iY=this._aRows.length-1;n.iX--;}}else{n.iX--;if(n.iX<0){if(n.iY<=0){return;}n.iX=this._aRows[n.iY].length-1;n.iY--;}}if(n.iX===C.iX&&n.iY===C.iY){if(f){f=false;}else{return;}}o=this._aRows[n.iY][n.iX];}while(!o||!q(o).is(":sapFocusable"));i=this._findIndex(n);this.focusItem(i,e);};T.prototype._findPosition=function(i){var x,y,o=this.aItemDomRefs[i];for(y=0;y<this._aRows.length;y++){for(x=0;x<this._aRows[y].length;x++){if(o===this._aRows[y][x]){return{iX:x,iY:y};}}}return null;};T.prototype._findIndex=function(p){var o=this._aRows[p.iY][p.iX],i;for(i=0;i<this.aItemDomRefs.length;i++){if(o===this.aItemDomRefs[i]){return i;}}return null;};T.prototype._skipNavigation=function(e,C,b){return!c(this.oDomRef,e.target)||(this.getFocusedIndex()<0&&b)||this.aItemDomRefs&&Array.prototype.indexOf.call(this.aItemDomRefs,e.target)===-1||(q(this.oDomRef).data("sap.InNavArea")&&C);};return T;});
