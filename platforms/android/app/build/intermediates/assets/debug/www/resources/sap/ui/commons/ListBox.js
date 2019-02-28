/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','./library','sap/ui/core/Control','sap/ui/core/delegate/ItemNavigation','./ListBoxRenderer','sap/ui/core/library','sap/ui/Device'],function(q,a,C,I,L,c,D){"use strict";var T=c.TextAlign;var b=C.extend("sap.ui.commons.ListBox",{metadata:{library:"sap.ui.commons",properties:{editable:{type:"boolean",group:"Behavior",defaultValue:true},enabled:{type:"boolean",group:"Behavior",defaultValue:true},allowMultiSelect:{type:"boolean",group:"Behavior",defaultValue:false},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},scrollTop:{type:"int",group:"Behavior",defaultValue:-1},displayIcons:{type:"boolean",group:"Behavior",defaultValue:false},displaySecondaryValues:{type:"boolean",group:"Misc",defaultValue:false},valueTextAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:T.Begin},secondaryValueTextAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:T.Begin},minWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},maxWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},visibleItems:{type:"int",group:"Dimension",defaultValue:null}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.core.Item",multiple:true,singularName:"item"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{select:{parameters:{id:{type:"string"},selectedIndex:{type:"int"},selectedItem:{type:"sap.ui.core.Item"},selectedIndices:{type:"int[]"}}}}}});b.prototype.init=function(){this.allowTextSelection(false);if(!this._bHeightInItems){this._bHeightInItems=false;this._iVisibleItems=-1;}this._sTotalHeight=null;if(b._fItemHeight===undefined){b._fItemHeight=-1;}if(b._iBordersAndStuff===undefined){b._iBordersAndStuff=-1;}this._aSelectionMap=[];this._iLastDirectlySelectedIndex=-1;this._aActiveItems=null;};b.prototype.onThemeChanged=function(){this._sTotalHeight=null;if(!this._bHeightInItems){this._iVisibleItems=-1;}this._skipStoreScrollTop=true;if(this.getDomRef()){this.invalidate();}};b.prototype.onBeforeRendering=function(){if(this._skipStoreScrollTop){delete this._skipStoreScrollTop;return;}this.getScrollTop();};b.prototype.onAfterRendering=function(){var d=this.getDomRef();if(b._fItemHeight<=0){var s=sap.ui.getCore().getStaticAreaRef();var e=document.createElement("div");e.id="sap-ui-commons-ListBox-sizeDummy";e.innerHTML='<div class="sapUiLbx sapUiLbxFlexWidth sapUiLbxStd"><ul><li class="sapUiLbxI"><span class="sapUiLbxITxt">&nbsp;</span></li></ul></div>';if(D.browser.safari){s.insertBefore(e,s.firstChild);}else{s.appendChild(e);}var o=e.firstChild.firstChild.firstChild;b._fItemHeight=o.offsetHeight;if(D.browser.msie&&(document.documentMode==9||document.documentMode==10)){var f=document.defaultView.getComputedStyle(o.firstChild,"");var h=parseFloat(f.getPropertyValue("height").split("px")[0]);if(!(typeof h==="number")||!(h>0)){h=q(o.firstChild).height();}var p=parseFloat(f.getPropertyValue("padding-top").split("px")[0]);var g=parseFloat(f.getPropertyValue("padding-bottom").split("px")[0]);var j=parseFloat(f.getPropertyValue("border-top-width").split("px")[0]);var k=parseFloat(f.getPropertyValue("border-bottom-width").split("px")[0]);b._fItemHeight=h+p+g+j+k;}s.removeChild(e);}if(b._iBordersAndStuff==-1){var $=q(this.getDomRef());var l=$.outerHeight();var m=$.height();b._iBordersAndStuff=l-m;}if(this._bHeightInItems){if(this._sTotalHeight==null){this._calcTotalHeight();d.style.height=this._sTotalHeight;}}if(this._iVisibleItems==-1){this._updatePageSize();}var F=this.getFocusDomRef(),r=F.childNodes,n=[],t=this.getItems();this._aActiveItems=[];var A=this._aActiveItems;for(var i=0;i<r.length;i++){if(!(t[i]instanceof sap.ui.core.SeparatorItem)){A[n.length]=i;n.push(r[i]);}}if(!this.oItemNavigation){var N=(!this.getEnabled()||!this.getEditable());this.oItemNavigation=new I(null,null,N);this.oItemNavigation.attachEvent(I.Events.AfterFocus,this._handleAfterFocus,this);this.addDelegate(this.oItemNavigation);}this.oItemNavigation.setRootDomRef(F);this.oItemNavigation.setItemDomRefs(n);this.oItemNavigation.setCycling(false);this.oItemNavigation.setSelectedIndex(this._getNavigationIndexForRealIndex(this.getSelectedIndex()));this.oItemNavigation.setPageSize(this._iVisibleItems);if(this.oScrollToIndexRequest){this.scrollToIndex(this.oScrollToIndexRequest.iIndex,this.oScrollToIndexRequest.bLazy);}else{var u=this.getProperty("scrollTop");if(u>-1){d.scrollTop=u;}}var v=this;window.setTimeout(function(){if(v.oScrollToIndexRequest){v.scrollToIndex(v.oScrollToIndexRequest.iIndex,v.oScrollToIndexRequest.bLazy);v.oScrollToIndexRequest=null;}else{var u=v.getProperty("scrollTop");if(u>-1){d.scrollTop=u;}}},0);};b.prototype._getNavigationIndexForRealIndex=function(d){var e=this.getItems();var n=d;for(var i=0;i<d;i++){if(e[i]instanceof sap.ui.core.SeparatorItem){n--;}}return n;};b.prototype._updatePageSize=function(){var d=this.getDomRef();if(d){if(b._fItemHeight>0){this._iVisibleItems=Math.floor(d.clientHeight/b._fItemHeight);}}};b.prototype.scrollToIndex=function(i,l){var d=this.getDomRef();if(d){var o=this.$("list").children("li[data-sap-ui-lbx-index="+i+"]");o=o.get(0);if(o){var s=o.offsetTop;if(!l){this.setScrollTop(s);}else{var e=d.scrollTop;var v=q(d).height();if(e>=s){this.setScrollTop(s);}else if((s+b._fItemHeight)>(e+v)){this.setScrollTop(Math.ceil(s+b._fItemHeight-v));}}}this.getScrollTop();}else{this.oScrollToIndexRequest={iIndex:i,bLazy:l};}return this;};b.prototype.getVisibleItems=function(){return this._iVisibleItems;};b.prototype.setVisibleItems=function(i){this.setProperty("visibleItems",i,true);this._iVisibleItems=i;if(i<0){this._bHeightInItems=false;}else{this._bHeightInItems=true;}this._sTotalHeight=null;var d=this.getDomRef();if(d){if(this._bHeightInItems){var f=d.firstChild?d.firstChild.firstChild:null;if(f||((b._fItemHeight>0)&&(b._iBordersAndStuff>0))){d.style.height=this._calcTotalHeight();}else{this.invalidate();}}else{d.style.height=this.getHeight();this._updatePageSize();if(this.oItemNavigation){this.oItemNavigation.setPageSize(this._iVisibleItems);}}}return this;};b.prototype._calcTotalHeight=function(){var d=this._iVisibleItems*b._fItemHeight;this._sTotalHeight=(d+b._iBordersAndStuff)+"px";return this._sTotalHeight;};b.prototype.setHeight=function(h){this.validateProperty("height",h);if(this.getHeight()===h){return this;}this._bHeightInItems=false;this._iVisibleItems=-1;var d=this.getDomRef();if(d){d.style.height=h;this._updatePageSize();if(this.oItemNavigation){this.oItemNavigation.setPageSize(this._iVisibleItems);}}return this.setProperty("height",h,true);};b.prototype.setWidth=function(w){var d=this.getDomRef();if(d){d.style.width=w;}this.setProperty("width",w,true);return this;};b.prototype.setScrollTop=function(s){s=Math.round(s);var d=this.getDomRef();this.oScrollToIndexRequest=null;if(d){d.scrollTop=s;}this.setProperty("scrollTop",s,true);return this;};b.prototype.getScrollTop=function(){var s=this.getDomRef();if(s){var d=Math.round(s.scrollTop);this.setProperty("scrollTop",d,true);return d;}else{return this.getProperty("scrollTop");}};b.prototype.onmousedown=function(e){if(D.browser.webkit&&e.target&&e.target.id===this.getId()){var i=document.activeElement?document.activeElement.id:this.getId();var t=this;setTimeout(function(){var s=t.getDomRef().scrollTop;var f=i?document.getElementById(i):null;if(f){f.focus();}t.getDomRef().scrollTop=s;},0);}};b.prototype.onclick=function(e){this._handleUserActivation(e);};b.prototype.ontouchmove=function(e){e.setMarked();};b.prototype.onsapspace=function(e){this._handleUserActivation(e);};b.prototype.onsapspacemodifiers=b.prototype.onsapspace;b.prototype.onsapenter=b.prototype.onsapspace;b.prototype.onsapentermodifiers=b.prototype.onsapspace;b.prototype._handleUserActivation=function(e){if(!this.getEnabled()||!this.getEditable()){return;}var s=e.target;if(s.id===""||(s.id&&s.id.endsWith("-txt"))){s=s.parentNode;if(s.id===""){s=s.parentNode;}}var d=q(s).attr("data-sap-ui-lbx-index");if(typeof d=="string"&&d.length>0){var i=parseInt(d);var f=this.getItems();var o=f[i];if(f.length<=i){i=f.length-1;}if(i>=0&&i<f.length){if(o.getEnabled()&&!(o instanceof sap.ui.core.SeparatorItem)){if(e.ctrlKey||e.metaKey){this._handleUserActivationCtrl(i,o);}else if(e.shiftKey){this.setSelectedIndices(this._getUserSelectionRange(i));this.fireSelect({id:this.getId(),selectedIndex:i,selectedIndices:this.getSelectedIndices(),selectedItem:o,sId:this.getId(),aSelectedIndices:this.getSelectedIndices()});this._iLastDirectlySelectedIndex=i;}else{this._handleUserActivationPlain(i,o);}}}e.preventDefault();e.stopPropagation();}};b.prototype._handleUserActivationPlain=function(i,o){this._iLastDirectlySelectedIndex=i;this.oItemNavigation.setSelectedIndex(this._getNavigationIndexForRealIndex(i));if(this.getSelectedIndex()!=i||this.getSelectedIndices().length>1){this.setSelectedIndex(i);this.fireSelect({id:this.getId(),selectedIndex:i,selectedIndices:this.getSelectedIndices(),selectedItem:o,sId:this.getId(),aSelectedIndices:this.getSelectedIndices()});}};b.prototype._handleUserActivationCtrl=function(i,o){this._iLastDirectlySelectedIndex=i;this.oItemNavigation.setSelectedIndex(this._getNavigationIndexForRealIndex(i));if(this.isIndexSelected(i)){this.removeSelectedIndex(i);}else{this.addSelectedIndex(i);}this.fireSelect({id:this.getId(),selectedIndex:i,selectedIndices:this.getSelectedIndices(),selectedItem:o,sId:this.getId(),aSelectedIndices:this.getSelectedIndices()});};b.prototype._getUserSelectionRange=function(d){if(this._iLastDirectlySelectedIndex==-1){return[];}var e=this.getItems();var r=[];var i;if(this._iLastDirectlySelectedIndex<=d){for(i=this._iLastDirectlySelectedIndex;i<=d;i++){if((i>-1)&&(e[i].getEnabled()&&!(e[i]instanceof sap.ui.core.SeparatorItem))){r.push(i);}}}else{for(i=d;i<=this._iLastDirectlySelectedIndex;i++){if((i>-1)&&(e[i].getEnabled()&&!(e[i]instanceof sap.ui.core.SeparatorItem))){r.push(i);}}}return r;};b.prototype.getSelectedIndex=function(){for(var i=0;i<this._aSelectionMap.length;i++){if(this._aSelectionMap[i]){return i;}}return-1;};b.prototype.setSelectedIndex=function(s){if((s<-1)||(s>this._aSelectionMap.length-1)){return this;}var d=this.getItems();if((s>-1)&&(!d[s].getEnabled()||(d[s]instanceof sap.ui.core.SeparatorItem))){return this;}for(var i=0;i<this._aSelectionMap.length;i++){this._aSelectionMap[i]=false;}this._aSelectionMap[s]=true;if(this.oItemNavigation){this.oItemNavigation.setSelectedIndex(this._getNavigationIndexForRealIndex(s));}this.getRenderer().handleSelectionChanged(this);return this;};b.prototype.addSelectedIndex=function(s){if(!this.getAllowMultiSelect()){this.setSelectedIndex(s);}if((s<-1)||(s>this._aSelectionMap.length-1)){return this;}var i=this.getItems();if((s>-1)&&(!i[s].getEnabled()||(i[s]instanceof sap.ui.core.SeparatorItem))){return this;}if(this._aSelectionMap[s]){return this;}this._aSelectionMap[s]=true;this.getRenderer().handleSelectionChanged(this);return this;};b.prototype.removeSelectedIndex=function(i){if((i<0)||(i>this._aSelectionMap.length-1)){return this;}if(!this._aSelectionMap[i]){return this;}this._aSelectionMap[i]=false;this.getRenderer().handleSelectionChanged(this);return this;};b.prototype.clearSelection=function(){for(var i=0;i<this._aSelectionMap.length;i++){if(this._aSelectionMap[i]){this._aSelectionMap[i]=false;}}this._iLastDirectlySelectedIndex=-1;if(this.oItemNavigation){this.oItemNavigation.setSelectedIndex(-1);}this.getRenderer().handleSelectionChanged(this);return this;};b.prototype.getSelectedIndices=function(){var r=[];for(var i=0;i<this._aSelectionMap.length;i++){if(this._aSelectionMap[i]){r.push(i);}}return r;};b.prototype.setSelectedIndices=function(s){var d=[];var e=this.getItems();var i;for(i=0;i<s.length;i++){if((s[i]>-1)&&(s[i]<this._aSelectionMap.length)){if(e[s[i]].getEnabled()&&!(e[s[i]]instanceof sap.ui.core.SeparatorItem)){d.push(s[i]);}}}if(d.length>0){if(!this.getAllowMultiSelect()){d=[d[0]];}}for(i=0;i<this._aSelectionMap.length;i++){this._aSelectionMap[i]=false;}for(i=0;i<d.length;i++){this._aSelectionMap[d[i]]=true;}this.getRenderer().handleSelectionChanged(this);return this;};b.prototype.addSelectedIndices=function(s){var d=[];var e=this.getItems();var i;for(i=0;i<s.length;i++){if((s[i]>-1)&&(s[i]<this._aSelectionMap.length)){if(e[s[i]].getEnabled()&&!(e[s[i]]instanceof sap.ui.core.SeparatorItem)){d.push(s[i]);}}}if(d.length>0){if(!this.getAllowMultiSelect()){d=[d[0]];}for(i=0;i<d.length;i++){this._aSelectionMap[d[i]]=true;}this.getRenderer().handleSelectionChanged(this);}return this;};b.prototype.isIndexSelected=function(i){if((i<-1)||(i>this._aSelectionMap.length-1)){return false;}return this._aSelectionMap[i];};b.prototype.setSelectedKeys=function(s){var d=this.getItems();var k={};for(var i=0;i<s.length;i++){k[s[i]]=true;}var e=[];for(var j=0;j<d.length;j++){if(k[d[j].getKey()]){e.push(j);}}return this.setSelectedIndices(e);};b.prototype.getSelectedKeys=function(){var d=this.getItems();var r=[];for(var i=0;i<this._aSelectionMap.length;i++){if(this._aSelectionMap[i]){r.push(d[i].getKey());}}return r;};b.prototype.getSelectedItem=function(){var i=this.getSelectedIndex();if((i<0)||(i>=this._aSelectionMap.length)){return null;}return this.getItems()[i];};b.prototype.getSelectedItems=function(){var d=this.getItems();var r=[];for(var i=0;i<this._aSelectionMap.length;i++){if(this._aSelectionMap[i]){r.push(d[i]);}}return r;};b.prototype.setAllowMultiSelect=function(A){this.setProperty("allowMultiSelect",A);var o=false;var t=false;if(!A&&this._aSelectionMap){for(var i=0;i<this._aSelectionMap.length;i++){if(this._aSelectionMap[i]){if(!o){o=true;}else{this._aSelectionMap[i]=false;t=true;}}}}if(t){this.getRenderer().handleSelectionChanged(this);}return this;};b.prototype._handleAfterFocus=function(o){var i=o.getParameter("index");i=((i!==undefined&&i>=0)?this._aActiveItems[i]:0);this.getRenderer().handleARIAActivedescendant(this,i);};b.prototype.setItems=function(d,e,n){this._bNoItemsChangeEvent=true;if(e){this.destroyItems();}else{this.removeAllItems();}for(var i=0,l=d.length;i<l;i++){this.addItem(d[i]);}this._bNoItemsChangeEvent=undefined;if(!n){this.fireEvent("itemsChanged",{event:"setItems",items:d});}return this;};b.prototype.addItem=function(i){this._bNoItemInvalidateEvent=true;this.addAggregation("items",i);this._bNoItemInvalidateEvent=false;if(!this._aSelectionMap){this._aSelectionMap=[];}this._aSelectionMap.push(false);if(!this._bNoItemsChangeEvent){this.fireEvent("itemsChanged",{event:"addItem",item:i});}i.attachEvent("_change",this._handleItemChanged,this);return this;};b.prototype.insertItem=function(i,d){if((d<0)||(d>this._aSelectionMap.length)){return this;}this._bNoItemInvalidateEvent=true;this.insertAggregation("items",i,d);this._bNoItemInvalidateEvent=false;this._aSelectionMap.splice(d,0,false);this.invalidate();if(!this._bNoItemsChangeEvent){this.fireEvent("itemsChanged",{event:"insertItems",item:i,index:d});}i.attachEvent("_change",this._handleItemChanged,this);return this;};b.prototype.removeItem=function(e){var i=e;if(typeof(e)=="string"){e=sap.ui.getCore().byId(e);}if(typeof(e)=="object"){i=this.indexOfItem(e);}if((i<0)||(i>this._aSelectionMap.length-1)){if(!this._bNoItemsChangeEvent){this.fireEvent("itemsChanged",{event:"removeItem",item:e});}return undefined;}this._bNoItemInvalidateEvent=true;var r=this.removeAggregation("items",i);this._bNoItemInvalidateEvent=false;this._aSelectionMap.splice(i,1);this.invalidate();if(!this._bNoItemsChangeEvent){this.fireEvent("itemsChanged",{event:"removeItem",item:r});}r.detachEvent("_change",this._handleItemChanged,this);return r;};b.prototype.removeAllItems=function(){this._bNoItemInvalidateEvent=true;var r=this.removeAllAggregation("items");this._bNoItemInvalidateEvent=false;this._aSelectionMap=[];this.invalidate();if(!this._bNoItemsChangeEvent){this.fireEvent("itemsChanged",{event:"removeAllItems"});}for(var i=0;i<r.length;i++){r[i].detachEvent("_change",this._handleItemChanged,this);}return r;};b.prototype.destroyItems=function(){var d=this.getItems();for(var i=0;i<d.length;i++){d[i].detachEvent("_change",this._handleItemChanged,this);}this._bNoItemInvalidateEvent=true;var e=this.destroyAggregation("items");this._bNoItemInvalidateEvent=false;this._aSelectionMap=[];this.invalidate();if(!this._bNoItemsChangeEvent){this.fireEvent("itemsChanged",{event:"destroyItems"});}return e;};b.prototype.updateItems=function(){this._bNoItemsChangeEvent=true;this.updateAggregation("items");this._bNoItemInvalidateEvent=true;if(!this._bItemsChangedAfterUpdate){this._bItemsChangedAfterUpdate=setTimeout(function(){this._itemsChangedAfterUpdate();}.bind(this),0);}};b.prototype._itemsChangedAfterUpdate=function(){this._bNoItemsChangeEvent=undefined;this._bItemsChangedAfterUpdate=undefined;this._bNoItemInvalidateEvent=undefined;this.fireEvent("itemsChanged",{event:"updateItems"});};b.prototype.exit=function(){if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy();delete this.oItemNavigation;}if(this._bItemsChangedAfterUpdate){clearTimeout(this._bItemsChangedAfterUpdate);this._bItemsChangedAfterUpdate=undefined;this._bNoItemsChangeEvent=undefined;this._bNoItemInvalidateEvent=undefined;}};b.prototype.getFocusDomRef=function(){return this.getDomRef("list");};b.prototype.getIdForLabel=function(){return this.getId()+'-list';};b.prototype._handleItemChanged=function(e){if(!this._bNoItemInvalidateEvent){this.fireEvent("itemInvalidated",{item:e.oSource});}};return b;});
