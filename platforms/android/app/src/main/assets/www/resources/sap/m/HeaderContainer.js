/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Control','sap/ui/Device','sap/ui/core/delegate/ItemNavigation','sap/ui/core/library','sap/ui/base/ManagedObject','sap/ui/core/Icon','./HeaderContainerRenderer',"sap/base/Log","sap/ui/events/PseudoEvents","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/control","sap/ui/dom/jquery/scrollLeftRTL","sap/ui/dom/jquery/scrollRightRTL","sap/ui/dom/jquery/Selectors"],function(l,C,D,I,c,M,a,H,L,P,q){"use strict";var O=c.Orientation;var b=C.extend("sap.m.HeaderContainerItemContainer",{metadata:{defaultAggregation:"item",aggregations:{item:{type:"sap.ui.core.Control",multiple:false}}},renderer:function(r,o){var i=o.getAggregation("item");if(!i||!i.getVisible()){return;}r.write("<div");r.writeControlData(o);r.addClass("sapMHdrCntrItemCntr");r.addClass("sapMHrdrCntrInner");r.writeClasses();r.write(">");r.renderControl(i);r.write("</div>");}});var d=C.extend("sap.m.HeaderContainer",{metadata:{interfaces:["sap.m.ObjectHeaderContainer"],library:"sap.m",properties:{scrollStep:{type:"int",defaultValue:300,group:"Behavior"},scrollStepByItem:{type:"int",defaultValue:1,group:"Behavior"},scrollTime:{type:"int",defaultValue:500,group:"Behavior"},showOverflowItem:{type:"boolean",defaultValue:true,group:"Behavior"},showDividers:{type:"boolean",defaultValue:true,group:"Appearance"},orientation:{type:"sap.ui.core.Orientation",defaultValue:O.Horizontal,group:"Appearance"},backgroundDesign:{type:"sap.m.BackgroundDesign",defaultValue:l.BackgroundDesign.Transparent,group:"Appearance"},width:{type:"sap.ui.core.CSSSize",group:"Appearance"},height:{type:"sap.ui.core.CSSSize",group:"Appearance"}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true},_scrollContainer:{type:"sap.m.ScrollContainer",multiple:false,visibility:"hidden"},_prevButton:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_nextButton:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}}}});d.prototype.init=function(){this._aItemEnd=[];this._bRtl=sap.ui.getCore().getConfiguration().getRTL();this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._oScrollCntr=new l.ScrollContainer(this.getId()+"-scrl-cntnr",{width:"100%",height:"100%",horizontal:!D.system.desktop});this.setAggregation("_scrollContainer",this._oScrollCntr,true);if(D.system.desktop){this._oArrowPrev=new l.Button({id:this.getId()+"-scrl-prev-button",type:l.ButtonType.Transparent,tooltip:this._oRb.getText("HEADERCONTAINER_BUTTON_PREV_SECTION"),press:function(e){e.cancelBubble();this._scroll(this._getScrollValue(false),this.getScrollTime());}.bind(this)}).addStyleClass("sapMHdrCntrBtn").addStyleClass("sapMHdrCntrLeft");this._oArrowPrev._bExcludeFromTabChain=true;this.setAggregation("_prevButton",this._oArrowPrev,true);this._oArrowNext=new l.Button({id:this.getId()+"-scrl-next-button",type:l.ButtonType.Transparent,tooltip:this._oRb.getText("HEADERCONTAINER_BUTTON_NEXT_SECTION"),press:function(e){e.cancelBubble();this._scroll(this._getScrollValue(true),this.getScrollTime());}.bind(this)}).addStyleClass("sapMHdrCntrBtn").addStyleClass("sapMHdrCntrRight");this._oArrowNext._bExcludeFromTabChain=true;this.setAggregation("_nextButton",this._oArrowNext,true);}else if(D.system.phone||D.system.tablet){this._oArrowPrev=new a({id:this.getId()+"-scrl-prev-button"}).addStyleClass("sapMHdrCntrBtn").addStyleClass("sapMHdrCntrLeft");this.setAggregation("_prevButton",this._oArrowPrev,true);this._oArrowNext=new a({id:this.getId()+"-scrl-next-button"}).addStyleClass("sapMHdrCntrBtn").addStyleClass("sapMHdrCntrRight");this.setAggregation("_nextButton",this._oArrowNext,true);}this._oScrollCntr.addDelegate({onAfterRendering:function(){if(D.system.desktop){var f=this._oScrollCntr.getDomRef("scroll");var F=this._oScrollCntr.$("scroll");var e=F.find(".sapMHrdrCntrInner").attr("tabindex","0");if(!this._oItemNavigation){this._oItemNavigation=new I();this.addDelegate(this._oItemNavigation);this._oItemNavigation.attachEvent(I.Events.BorderReached,this._handleBorderReached,this);this._oItemNavigation.attachEvent(I.Events.AfterFocus,this._handleBorderReached,this);this._oItemNavigation.attachEvent(I.Events.BeforeFocus,this._handleBeforeFocus,this);if(D.browser.msie||D.browser.edge){this._oItemNavigation.attachEvent(I.Events.FocusAgain,this._handleFocusAgain,this);}}this._oItemNavigation.setRootDomRef(f);this._oItemNavigation.setItemDomRefs(e);this._oItemNavigation.setTabIndex0();this._oItemNavigation.setCycling(false);}}.bind(this)});sap.ui.getCore().attachIntervalTimer(this._checkOverflow,this);};d.prototype.onBeforeRendering=function(){if(!this.getHeight()){L.warning("No height provided",this);}if(!this.getWidth()){L.warning("No width provided",this);}if(D.system.desktop){this._oArrowPrev.setIcon(this.getOrientation()===O.Horizontal?"sap-icon://slim-arrow-left":"sap-icon://slim-arrow-up");this._oArrowNext.setIcon(this.getOrientation()===O.Horizontal?"sap-icon://slim-arrow-right":"sap-icon://slim-arrow-down");}else if(D.system.phone||D.system.tablet){this._oArrowPrev.setSrc(this.getOrientation()===O.Horizontal?"sap-icon://slim-arrow-left":"sap-icon://slim-arrow-up");this._oArrowNext.setSrc(this.getOrientation()===O.Horizontal?"sap-icon://slim-arrow-right":"sap-icon://slim-arrow-down");}};d.prototype.onAfterRendering=function(){this._bRtl=sap.ui.getCore().getConfiguration().getRTL();this._checkOverflow();};d.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();this._oItemNavigation=null;}sap.ui.getCore().detachIntervalTimer(this._checkOverflow,this);};d.prototype.onsaptabnext=function(e){var f=this.$().find(":focusable");var t=f.index(e.target);var n=f.eq(t+1).get(0);var F=this._getParentCell(e.target);var T;if(n){T=this._getParentCell(n);}if((F&&T&&F.id!==T.id)||(n&&n.id===this.getId()+"-after")||(n&&n.id===this.getId()+"-scrl-prev-button")||(n&&n.id===this.getId()+"-scrl-next-button")){var o=f.last().get(0);if(o){this._bIgnoreFocusIn=true;o.focus();}}};d.prototype.onsaptabprevious=function(e){this.$().find(".sapMHdrCntrItemCntr").css("border-color","");var f=this.$().find(":focusable");var t=f.index(e.target);var p=f.eq(t-1).get(0);var F=this._getParentCell(e.target);var T;if(p){T=this._getParentCell(p);}if(!T||F&&F.id!==T.id){var s=this.$().attr("tabindex");this.$().attr("tabindex","0");this.$().focus();if(!s){this.$().removeAttr("tabindex");}else{this.$().attr("tabindex",s);}}};d.prototype.setOrientation=function(v){this.setProperty("orientation",v);if(v===O.Horizontal&&!D.system.desktop){this._oScrollCntr.setHorizontal(true);this._oScrollCntr.setVertical(false);}else if(!D.system.desktop){this._oScrollCntr.setHorizontal(false);this._oScrollCntr.setVertical(true);}return this;};d.prototype.validateAggregation=function(A,o,m){return this._callMethodInManagedObject("validateAggregation",A,o,m);};d.prototype.getAggregation=function(A,o,s){return this._callMethodInManagedObject("getAggregation",A,o,s);};d.prototype.setAggregation=function(A,o,s){return this._callMethodInManagedObject("setAggregation",A,o,s);};d.prototype.indexOfAggregation=function(A,o){return this._callMethodInManagedObject("indexOfAggregation",A,o);};d.prototype.insertAggregation=function(A,o,i,s){return this._callMethodInManagedObject("insertAggregation",A,o,i,s);};d.prototype.addAggregation=function(A,o,s){return this._callMethodInManagedObject("addAggregation",A,o,s);};d.prototype.removeAggregation=function(A,o,s){return this._callMethodInManagedObject("removeAggregation",A,o,s);};d.prototype.removeAllAggregation=function(A,s){return this._callMethodInManagedObject("removeAllAggregation",A,s);};d.prototype.destroyAggregation=function(A,s){return this._callMethodInManagedObject("destroyAggregation",A,s);};d.prototype._setScrollInProcess=function(v){this.bScrollInProcess=v;};d.prototype._scroll=function(i,e){this._setScrollInProcess(true);setTimeout(this._setScrollInProcess.bind(this,false),e+300);if(this.getOrientation()===O.Horizontal){this._hScroll(i,e);}else{this._vScroll(i,e);}};d.prototype._vScroll=function(e,f){var o=this._oScrollCntr.getDomRef(),s=o.scrollTop,S=o.scrollHeight,i=s+e,g=o.clientHeight,p=parseFloat(this.$("scroll-area").css("padding-top")),r;if(i<=0){r=this._calculateRemainingScrolling(e,f,s);this.$("scroll-area").css("transition","padding "+r+"s");this.$().removeClass("sapMHrdrTopPadding");}else if(i+g+p>=S){r=this._calculateRemainingScrolling(e,f,S-g-s);this.$("scroll-area").css("transition","padding "+r+"s");if(g+e>S&&g!==S){this.$().removeClass("sapMHrdrBottomPadding");this.$().addClass("sapMHrdrTopPadding");}else{this.$().removeClass("sapMHrdrBottomPadding");}}else{this.$("scroll-area").css("transition","padding "+f/1000+"s");}this._oScrollCntr.scrollTo(0,i,f);};d.prototype._hScroll=function(e,f){var o=this._oScrollCntr.getDomRef();var s,S,i,g,p,r;if(!this._bRtl){S=o.scrollLeft;g=o.scrollWidth;i=o.clientWidth+(D.browser.msie?1:0);s=S+e;p=parseFloat(this.$("scroll-area").css("padding-left"));if(s<=0){r=this._calculateRemainingScrolling(e,f,S);this.$("scroll-area").css("transition","padding "+r+"s");this.$().removeClass("sapMHrdrLeftPadding");}else if(s+o.clientWidth+p>=g){r=this._calculateRemainingScrolling(e,f,g-i-S);this.$("scroll-area").css("transition","padding "+r+"s");if(i+e>g&&i!==g){this.$().removeClass("sapMHrdrRightPadding");this.$().addClass("sapMHrdrLeftPadding");}else{this.$().removeClass("sapMHrdrRightPadding");}}else{this.$("scroll-area").css("transition","padding "+f/1000+"s");}this._oScrollCntr.scrollTo(s,0,f);}else{s=q(o).scrollRightRTL()+e;this._oScrollCntr.scrollTo((s>0)?s:0,0,f);}};d.prototype._collectItemSize=function(){var s=0,e=this._filterVisibleItems(),f=this.getOrientation()===O.Horizontal?"outerWidth":"outerHeight";this._aItemEnd=[];e.forEach(function(o,i){s+=o.$().parent()[f](true);this._aItemEnd[i]=s;},this);};d.prototype._getScrollValue=function(f){if(!this._oScrollCntr){return 0;}var h=this.getOrientation()===O.Horizontal,$=this._oScrollCntr.$(),e=this.$("prev-button-container"),g=this.$("next-button-container"),s=h?$[0].scrollLeft:$[0].scrollTop,t=0,S=0,j,m=this._filterVisibleItems();var G=function(k){var S=0,B=0;var o=10;if(this._bRtl&&h){if(!e.is(":visible")){B=e.width();}if(!g.is(":visible")){B=g.width();}}for(var i=0;i<m.length&&i<k;i++){S+=n(m[i]);}return S!==0?S+o-B:0;}.bind(this);var n=function(o){return h?o.$().parent().outerWidth(true):o.$().parent().outerHeight(true);};var E=function(){var S=this._getSize(true),o,A=0;for(var i=t;i<m.length;i++){if(!m[i].$().is(":visible")){o=n(m[i])+G(i)-S-s;for(var k=t;k<m.length&&k<i;k++){if(j+A>o){break;}t++;A+=n(m[k]);}j+=A;break;}}}.bind(this);if(this.getScrollStepByItem()>0){s=h&&this._bRtl?$.scrollRightRTL():s;for(var i=0;i<m.length;i++){S+=n(m[i]);if(S>=s){t=i;break;}}t=(f?1:-1)*this.getScrollStepByItem()+t;if(t<0){t=0;}if(t>=m.length){t=m.length-1;}j=G(t)-s;if(f&&!this.getShowOverflowItem()){E();}return j;}return f?this.getScrollStep():-this.getScrollStep();};d.prototype._calculateRemainingScrolling=function(e,f,g){return Math.abs(g*f/(1000*e));};d.prototype._checkOverflow=function(){if(this.getOrientation()===O.Horizontal){this._checkHOverflow();}else{this._checkVOverflow();}};d.prototype._filterVisibleItems=function(){return this.getContent().filter(function(i){return i.getVisible();});};d.prototype._getFirstItemOffset=function(t){var f=this._filterVisibleItems()[0],$=f&&f.$(),e=$&&$.parent(),F=e&&e[0]&&e[0][t];return F||0;};d.prototype._checkVOverflow=function(){var B=this._oScrollCntr.getDomRef(),o,$;if(B){var f=this._getFirstItemOffset("offsetTop");var s=Math.ceil(B.scrollTop);var S=false;var e=false;var r=B.scrollHeight;var g=B.clientHeight;if(Math.abs(r-g)===1){r=g;}if(s>f){S=true;}if((r>g)&&(s+g<r)){e=true;}e=this._checkForOverflowItem(e);$=this.$("prev-button-container");o=$.is(":visible");if(o&&!S){$.hide();this.$().removeClass("sapMHrdrTopPadding");}if(!o&&S){$.show();this.$().addClass("sapMHrdrTopPadding");}$=this.$("next-button-container");var h=$.is(":visible");if(h&&!e){$.hide();this.$().removeClass("sapMHrdrBottomPadding");}if(!h&&e){$.show();this.$().addClass("sapMHrdrBottomPadding");}}};d.prototype._checkHOverflow=function(){var B=this._oScrollCntr.getDomRef(),$;if(B){var f=this._getFirstItemOffset("offsetLeft");var s=Math.ceil(B.scrollLeft);var S=false;var e=false;var r=B.scrollWidth;var g=B.clientWidth;if(Math.abs(r-g)===1){r=g;}if(this._bRtl){var i=q(B).scrollLeftRTL();if(i>((D.browser.msie||D.browser.edge)?1:0)){e=true;}}else if(s>f){S=true;}if(r-5>g){if(this._bRtl){if(q(B).scrollRightRTL()>1){S=true;}}else if(s+g<r){e=true;}}$=this.$("prev-button-container");e=this._checkForOverflowItem(e);var o=$.is(":visible");if(o&&!S){$.hide();this.$().removeClass("sapMHrdrLeftPadding");}if(!o&&S){$.show();this.$().addClass("sapMHrdrLeftPadding");}$=this.$("next-button-container");var h=$.is(":visible");if(h&&!e){$.hide();this.$().removeClass("sapMHrdrRightPadding");}if(!h&&e){$.show();this.$().addClass("sapMHrdrRightPadding");}}};d.prototype._getSize=function(A){var $=this._oScrollCntr.$(),h=this.getOrientation()===O.Horizontal,e=this.$("next-button-container"),f=!e.is(":visible")&&A,F=h?"width":"height";return $[F]()-(f?e[F]():0);};d.prototype._checkForOverflowItem=function(s){if(this._oScrollCntr&&!this.getShowOverflowItem()){var $=this._oScrollCntr.$(),h=this.getOrientation()===O.Horizontal,S=!h?$[0].scrollTop:(this._bRtl?$.scrollRightRTL():$[0].scrollLeft),f=h?"width":"height",e=this._getSize(s),g=this._filterVisibleItems();this._collectItemSize();this._aItemEnd.forEach(function(E,i){var j=g[i].$(),k=j.parent(),v=j.is(":visible");if(s&&E>S+e){if(i===0||this._aItemEnd[i-1]<=S){k.css(f,"auto");j.show();}else if(v){k[f](k[f]());j.hide();s=true;}}else{if(!v){k.css(f,"auto");j.show();}}},this);}return s;};d.prototype._handleBorderReached=function(e){if(D.browser.msie&&this.bScrollInProcess){return;}var i=e.getParameter("index");if(i===0){this._scroll(this._getScrollValue(false),this.getScrollTime());}else if(i===this._filterVisibleItems().length-1){this._scroll(this._getScrollValue(true),this.getScrollTime());}};d.prototype._handleFocusAgain=function(e){e.getParameter("event").preventDefault();};d.prototype._handleBeforeFocus=function(e){var o=e.getParameter("event");if(q(o.target).hasClass("sapMHdrCntrItemCntr")||q(o.target).hasClass("sapMScrollContScroll")||P.events.sapprevious.fnCheck(o)||P.events.sapnext.fnCheck(o)){this.$().find(".sapMHdrCntrItemCntr").css("border-color","");}else{this.$().find(".sapMHdrCntrItemCntr").css("border-color","transparent");}};d.prototype._unWrapHeaderContainerItemContainer=function(w){if(w instanceof b){w=w.getItem();}else if(Array.isArray(w)){for(var i=0;i<w.length;i++){if(w[i]instanceof b){w[i]=w[i].getItem();}}}return w;};d._AGGREGATION_FUNCTIONS=["validateAggregation","validateAggregation","getAggregation","setAggregation","indexOfAggregation","removeAggregation"];d._AGGREGATION_FUNCTIONS_FOR_INSERT=["insertAggregation","addAggregation"];d.prototype._callMethodInManagedObject=function(f,A){var e=Array.prototype.slice.call(arguments);if(A==="content"){var o=e[2];e[1]="content";if(o instanceof C){if(((d._AGGREGATION_FUNCTIONS?Array.prototype.indexOf.call(d._AGGREGATION_FUNCTIONS,f):-1))>-1&&o.getParent()instanceof b){e[2]=o.getParent();}else if(((d._AGGREGATION_FUNCTIONS_FOR_INSERT?Array.prototype.indexOf.call(d._AGGREGATION_FUNCTIONS_FOR_INSERT,f):-1))>-1){e[2]=new b({item:o});}}return this._unWrapHeaderContainerItemContainer(this._oScrollCntr[f].apply(this._oScrollCntr,e.slice(1)));}else{return M.prototype[f].apply(this,e.slice(1));}};d.prototype._getParentCell=function(o){return q(o).parents(".sapMHrdrCntrInner").andSelf(".sapMHrdrCntrInner").get(0);};d.prototype.onfocusin=function(e){if(this._bIgnoreFocusIn){this._bIgnoreFocusIn=false;return;}if(e.target.id===this.getId()+"-after"){this._restoreLastFocused();}};d.prototype._restoreLastFocused=function(){if(!this._oItemNavigation){return;}var n=this._oItemNavigation.getItemDomRefs();var i=this._oItemNavigation.getFocusedIndex();var $=q(n[i]);var r=$.control(0)||{};var t=r.getTabbables?r.getTabbables():$.find(":sapTabbable");t.eq(-1).add($).eq(-1).focus();};return d;});
