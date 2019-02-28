/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/Device','sap/ui/base/ManagedObject','sap/ui/base/Object','sap/ui/base/ObjectPool','./Control','./IntervalTrigger','./RenderManager','./Element','./ResizeHandler','./library',"sap/base/assert","sap/base/Log","sap/base/util/Version","sap/base/util/uid","sap/ui/dom/containsOrEquals","sap/ui/thirdparty/jquery","sap/ui/events/F6Navigation","sap/ui/events/isMouseEventDelayed","sap/ui/dom/jquery/control","sap/ui/dom/jquery/Focusable","sap/ui/dom/jquery/rect"],function(D,M,B,O,C,I,R,E,a,b,c,L,V,u,d,q,F,f){"use strict";var g=b.CSSSize;var h=b.OpenState;var P=M.extend("sap.ui.core.Popup",{constructor:function(o,m,s,A){c(arguments.length==0||(o&&typeof o==="object"),"oContent must be an object or there may be no arguments at all");c((m===undefined||m===true||m===false),"bModal must be true, false, or undefined");c((s===undefined||s===true||s===false),"bShadow must be true, false, or undefined");c((A===undefined||A===true||A===false),"bAutoClose must be true, false, or undefined");M.apply(this);this._popupUID=u();this.bOpen=false;this.eOpenState=h.CLOSED;this._mEvents={};this._mEvents["sap.ui.core.Popup.addFocusableContent-"+this._popupUID]=this._addFocusableArea;this._mEvents["sap.ui.core.Popup.removeFocusableContent-"+this._popupUID]=this._removeFocusableArea;this._mEvents["sap.ui.core.Popup.closePopup-"+this._popupUID]=this._closePopup;this._mEvents["sap.ui.core.Popup.onFocusEvent-"+this._popupUID]=this.onFocusEvent;this._mEvents["sap.ui.core.Popup.increaseZIndex-"+this._popupUID]=this._increaseMyZIndex;this._mEvents["sap.ui.core.Popup.contains-"+this._popupUID]=this._containsEventBusWrapper;if(o){this.setContent(o);}this._oDefaultPosition={my:P.Dock.CenterCenter,at:P.Dock.CenterCenter,of:document,offset:"0 0",collision:"flip"};this._oPosition=q.extend({},this._oDefaultPosition);this._bModal=!!m;this._oPreviousFocus=null;this._sInitialFocusId=null;this._bShadow=typeof(s)==="boolean"?s:true;this._bAutoClose=!!A;this._animations={open:null,close:null};this._durations={open:"fast",close:"fast"};this._iZIndex=-1;this._oBlindLayer=null;this.setNavigationMode();if(this.touchEnabled){this._fAutoCloseHandler=function(e){if(e.isMarked("delayedMouseEvent")||e.isMarked("cancelAutoClose")){return;}if(this.eOpenState===h.CLOSING||this.eOpenState===h.CLOSED){return;}if(!this._contains(e.target)){this.close();}};}this._F6NavigationHandler=function(e){var S={},i=this._sF6NavMode,j;if(i=="DOCK"){if(this._bModal){i="NONE";}else if(this._oLastPosition&&this._oLastPosition.of){j=this._getOfDom(this._oLastPosition.of);if(!j||j===document){j=null;i="NONE";}}}switch(i){case"SCOPE":S.scope=this._$()[0];break;case"DOCK":S.target=j;var $=q(j).parents("[data-sap-ui-popup]");S.scope=$.length?$[0]:null;break;default:S.skip=true;}F.handleF6GroupNavigation(e,S);};},metadata:{library:"sap.ui.core",publicMethods:["open","close","setContent","getContent","setPosition","setShadow","setModal","getModal","setAutoClose","setAutoCloseAreas","isOpen","getAutoClose","getOpenState","setAnimations","setDurations","attachOpened","attachClosed","detachOpened","detachClosed"],associations:{"childPopups":{type:"sap.ui.core.Popup",multiple:true,visibility:"hidden"}},events:{"opened":{},"closed":{}}}});P.prototype.getChildPopups=function(){return this.getAssociation("childPopups",[]);};P.prototype.addChildPopup=function(v){return this.addAssociation("childPopups",v);};P.prototype.removeChildPopup=function(v){return this.removeAssociation("childPopups",v);};P._activateBlindLayer=true;P.blStack=[];P.Dock={BeginTop:"begin top",BeginCenter:"begin center",BeginBottom:"begin bottom",LeftTop:"left top",LeftCenter:"left center",LeftBottom:"left bottom",CenterTop:"center top",CenterCenter:"center center",CenterBottom:"center bottom",RightTop:"right top",RightCenter:"right center",RightBottom:"right bottom",EndTop:"end top",EndCenter:"end center",EndBottom:"end bottom"};P.prototype.touchEnabled=D.support.touch&&!D.system.combi;P.prototype.preventBrowserFocus=D.support.touch&&!D.system.combi;B.extend("sap.ui.core.Popup.Layer",{constructor:function(){var s=this.getDomString();this._$Ref=q(s).appendTo(sap.ui.getCore().getStaticAreaRef());}});P.Layer.prototype.init=function(o,z){this._$Ref.css({"visibility":"visible","z-index":z});this.update(o,z);this._$Ref.insertAfter(o).show();};P.Layer.prototype.update=function(o,z){if(o.length){var e=o.rect();this._$Ref.css({"left":e.left,"top":e.top});if(o.css("right")!="auto"&&o.css("right")!="inherit"){this._$Ref.css({"right":o.css("right"),"width":"auto"});}else{this._$Ref.css({"width":e.width,"right":"auto"});}if(o.css("bottom")!="auto"&&o.css("bottom")!="inherit"){this._$Ref.css({"bottom":o.css("bottom"),"height":"auto"});}else{this._$Ref.css({"height":e.height,"bottom":"auto"});}if(typeof(z)==="number"){this._$Ref.css("z-index",z);}}};P.Layer.prototype.reset=function(){if(this._$Ref.length){this._$Ref[0].style.display="none";this._$Ref[0].style.visibility="hidden";this._$Ref.appendTo(sap.ui.getCore().getStaticAreaRef());}};P.Layer.prototype.getDomString=function(){L.error("sap.ui.core.Popup.Layer: getDomString function must be overwritten!");return"";};P.Layer.extend("sap.ui.core.Popup.BlindLayer",{constructor:function(){P.Layer.apply(this);}});P.BlindLayer.prototype.getDomString=function(){return"<div class=\"sapUiBliLy\" id=\"sap-ui-blindlayer-"+u()+"\"><iframe scrolling=\"no\" tabIndex=\"-1\"></iframe></div>";};P.prototype.oBlindLayerPool=new O(P.BlindLayer);P.Layer.extend("sap.ui.core.Popup.ShieldLayer",{constructor:function(){P.Layer.apply(this);}});P.ShieldLayer.prototype.getDomString=function(){return"<div class=\"sapUiPopupShield\" id=\"sap-ui-shieldlayer-"+u()+"\"></div>";};P.prototype.oShieldLayerPool=new O(P.ShieldLayer);(function(){var l=0;var m=Math.pow(2,32)-1;P.setInitialZIndex=function(i){if(i>=m){throw new Error("Z-index can't be higher than Number.MAX_SAFE_INTEGER");}l=Math.max(i,this.getLastZIndex());};P.getLastZIndex=function(){return l;};P.prototype.getLastZIndex=function(){return P.getLastZIndex();};P.getNextZIndex=function(){l+=10;if(l>=m){throw new Error("Z-index can't be higher than Number.MAX_SAFE_INTEGER");}return l;};P.prototype.getNextZIndex=function(){return P.getNextZIndex();};}());var r=function(o,e){var p=3;var l=Math.abs(o.left-e.left);var t=Math.abs(o.top-e.top);var w=Math.abs(o.width-e.width);var H=Math.abs(o.height-e.height);if(l>p||t>p||w>p||H>p){return false;}return true;};P.prototype.open=function(i,m,j,o,k,l,n){c(this.oContent,"Popup content must have been set by now");if(this.eOpenState!=h.CLOSED){return;}this.eOpenState=h.OPENING;var s;try{s=sap.ui.getCore().getStaticAreaRef();s=sap.ui.getCore().getUIArea(s);}catch(e){L.error(e);throw new Error("Popup cannot be opened because static UIArea cannot be determined.");}this._bContentAddedToStatic=false;if(this.oContent instanceof C&&!this.oContent.getParent()){s.addContent(this.oContent,true);this._bContentAddedToStatic=true;}if(this.oContent.getUIArea){var A=this.oContent.getUIArea();if(A===null){L.warning("The Popup content is NOT connected with a UIArea and may not work properly!");}else if(P._bEnableUIAreaCheck&&A.getRootNode().id!==s.getRootNode().id){L.warning("The Popup content is NOT connected with the static-UIArea and may not work properly!");}}if(typeof(i)=="string"){n=l;l=k;k=o;o=j;j=m;m=i;i=-1;}if(i===undefined){i=-1;}c(i===-1||(typeof i==="number"&&i%1==0),"iDuration must be an integer (or omitted)");c(m===undefined||typeof m==="string","my must be a string or empty");c(j===undefined||typeof j==="string","at must be a string or empty");c(!o||typeof o==="object"||typeof o==="function","of must be empty or an object");c(!k||typeof k==="string","offset must be empty or a string");c(!l||typeof l==="string","collision must be empty or a string");this._oPreviousFocus=P.getCurrentFocusInfo();if(this.isInPopup(o)||this.isInPopup(this._oPosition.of)){var p=this.getParentPopupId(o)||this.getParentPopupId(this._oPosition.of);var t="";var v=this.getContent();if(v instanceof E){t=v.getId();}else if(typeof v==="object"){t=v.id;}this.addChildToPopup(p,t);this.addChildToPopup(p,this._popupUID);}var $=this._$(true);var w="fast";if((i===0)||(i>0)){w=i;}else if((this._durations.open===0)||(this._durations.open>0)){w=this._durations.open;}var _;if(m||j||o||k||l){_=this._createPosition(m,j,o,k,l);this._oPosition=_;}else{_=this._oPosition;}if(!_.of){_.of=this._oPosition.of||document;}this._iZIndex=this._iZIndex===this.getLastZIndex()?this._iZIndex:this.getNextZIndex();var S=sap.ui.getCore().getStaticAreaRef();$.css({"position":"absolute","visibility":"hidden"});if(!($[0].parentNode==S)){$.appendTo(S);}$.css("z-index",this._iZIndex);L.debug("position popup content "+$.attr("id")+" at "+(window.JSON?JSON.stringify(_.at):String(_.at)));this._applyPosition(_);if(n!==undefined){this.setFollowOf(n);}$.toggleClass("sapUiShd",this._bShadow);var x=$[0];if(x){x.style.display="none";x.style.visibility="visible";}this._duringOpen();if(w==0){this._opened();}else if(this._animations.open){this._animations.open.call(null,$,w,this._opened.bind(this));}else{$.fadeIn(w,this._opened.bind(this));}};P.prototype._getDomRefToFocus=function(){var $=this._$(false,true),o,e;if(this._shouldGetFocusAfterOpen()){if(this._sInitialFocusId){e=sap.ui.getCore().byId(this._sInitialFocusId);if(e){o=e.getFocusDomRef();}o=o||window.document.getElementById(this._sInitialFocusId);}o=o||$.firstFocusableDomRef();}return o;};P.prototype._opened=function(){if(this.eOpenState!==h.OPENING){return;}this.bOpen=true;var $=this._$(false,true);if($[0]&&$[0].style){$[0].style.display="block";}if(this._shouldGetFocusAfterOpen()){var e=this._getDomRefToFocus();if(e){e.focus();}var o=this._getOfDom(this._oLastPosition.of);var i=q(o).rect();if(this._oLastOfRect&&i&&!r(this._oLastOfRect,i)){this._applyPosition(this._oLastPosition);}}this.eOpenState=h.OPEN;if(this.getFollowOf()){P.DockTrigger.addListener(P.checkDocking,this);}this._updateBlindLayer();this.fireOpened();};P.prototype._duringOpen=function(){var $=this._$(false,true),o;if(f()){if(this._oTopShieldLayer){clearTimeout(this._iTopShieldRemoveTimer);this._iTopShieldRemoveTimer=null;}else{this._oTopShieldLayer=this.oShieldLayerPool.borrowObject($,this._iZIndex+1);}this._iTopShieldRemoveTimer=setTimeout(function(){this.oShieldLayerPool.returnObject(this._oTopShieldLayer);this._oTopShieldLayer=null;this._iTopShieldRemoveTimer=null;}.bind(this),500);}if(!!D.browser.msie&&!D.os.windows_phone&&P._activateBlindLayer){this._oBlindLayer=this.oBlindLayerPool.borrowObject($,this._iZIndex-1);}if(this._bModal){this._showBlockLayer();}if(this._shouldGetFocusAfterOpen()&&document.activeElement&&!this.isInPopup(document.activeElement)){o=this._getDomRefToFocus();if(o!==document.activeElement){document.activeElement.blur();}}if(this.oContent instanceof E){this.oContent.addDelegate(this);}this.bOpen=true;this._activateFocusHandle();this._$(false,true).on("keydown",q.proxy(this._F6NavigationHandler,this));if(this._oBlindLayer){this._resizeListenerId=a.register(this._$().get(0),q.proxy(this.onresize,this));}};P.prototype._shouldGetFocusAfterOpen=function(){return this._bModal||this._bAutoClose||this._sInitialFocusId;};P.prototype._contains=function(o){var p=this._$().get(0);if(!p){return false;}var e=d(p,o);var i;if(!e){i=this.getChildPopups();e=i.some(function(s){var j=(s?window.document.getElementById(s):null);var e=d(j,o);if(!e){var k="sap.ui.core.Popup.contains-"+s;var l={domRef:o};sap.ui.getCore().getEventBus().publish("sap.ui",k,l);e=l.contains;}return e;});}return e;};P.prototype._containsEventBusWrapper=function(s,e,o){o.contains=this._contains(o.domRef);};P.prototype.onFocusEvent=function(o){var e=q.event.fix(o);if(arguments.length>1&&arguments[1]==="sap.ui.core.Popup.onFocusEvent-"+this._popupUID){e=q.event.fix(arguments[2]);}var t=(e.type=="focus"||e.type=="activate")?"focus":"blur";var i=false;if(t=="focus"){var j=this._$().get(0);if(j){i=this._contains(e.target);L.debug("focus event on "+e.target.id+", contains: "+i);if(this._bModal&&!i){var T=P.blStack.length>0&&P.blStack[P.blStack.length-1].popup===this;if(T){if(D.system.desktop||q(e.target).is(":input")){if(this.oLastBlurredElement){setTimeout(function(){if(this.oLastBlurredElement){this.oLastBlurredElement.focus();}}.bind(this),0);}else{j.focus();}}}}else if(this._bAutoClose&&i&&this._sTimeoutId){clearTimeout(this._sTimeoutId);this._sTimeoutId=null;}}}else if(t=="blur"){L.debug("blur event on "+e.target.id);if(this._bModal){this.oLastBlurredElement=e.target;}else if(this._bAutoClose){if(!this.touchEnabled&&!this._sTimeoutId){if(e.target===document.activeElement){return;}var k=typeof this._durations.close==="string"?0:this._durations.close;this._sTimeoutId=setTimeout(function(){this.close(k,"autocloseBlur");var l=this._oLastPosition&&this._oLastPosition.of;if(l){var p=this.getParentPopupId(l);if(p){var s="sap.ui.core.Popup.onFocusEvent-"+p;sap.ui.getCore().getEventBus().publish("sap.ui",s,e);}}}.bind(this),k);}}}};P.prototype.setInitialFocusId=function(i){c(!i||typeof i==="string","sId must be a string or empty");this._sInitialFocusId=i;};P.prototype.close=function(i){if(P._autoCloseDebug){return;}if(this._sTimeoutId){clearTimeout(this._sTimeoutId);this._sTimeoutId=null;if(arguments.length>1){var A=arguments[1];if(typeof A=="string"&&A=="autocloseBlur"&&this._isFocusInsidePopup()){return;}}}c(i===undefined||(typeof i==="number"&&(i%1==0)),"iDuration must be empty or an integer");if(this.eOpenState==h.CLOSED||this.eOpenState==h.CLOSING){return;}var e="fast";if((i===0)||(i>0)){e=i;}else if((this._durations.close===0)||(this._durations.close>0)){e=this._durations.close;}this.eOpenState=h.CLOSING;if(this.getFollowOf()){P.DockTrigger.removeListener(P.checkDocking,this);}if(this.oContent&&this._bContentAddedToStatic){sap.ui.getCore().getEventBus().publish("sap.ui","__beforePopupClose",{domNode:this._$().get(0)});var s=sap.ui.getCore().getStaticAreaRef();s=sap.ui.getCore().getUIArea(s);s.removeContent(s.indexOfContent(this.oContent),true);}this._bContentAddedToStatic=false;this._sTimeoutId=null;this._deactivateFocusHandle();this._$(false,true).off("keydown",this._F6NavigationHandler);if(this.oContent instanceof E){this.oContent.removeDelegate(this);}var $=this._$();if(this._bEventBusEventsRegistered){this._unregisterEventBusEvents();}if(this._oBlindLayer){this.oBlindLayerPool.returnObject(this._oBlindLayer);}this._oBlindLayer=null;if(f()){if(this._oBottomShieldLayer){clearTimeout(this._iBottomShieldRemoveTimer);this._iBottomShieldRemoveTimer=null;}else{this._oBottomShieldLayer=this.oShieldLayerPool.borrowObject($,this._iZIndex-3);}this._iBottomShieldRemoveTimer=setTimeout(function(){this.oShieldLayerPool.returnObject(this._oBottomShieldLayer);this._oBottomShieldLayer=null;this._iBottomShieldRemoveTimer=null;}.bind(this),500);}if(this.isInPopup(this._oLastPosition.of)){var p=this.getParentPopupId(this._oLastPosition.of);var j="";var o=this.getContent();if(o instanceof E){j=o.getId();}else if(typeof o==="object"){j=o.id;}this.removeChildFromPopup(p,j);this.removeChildFromPopup(p,this._popupUID);}if(this._bModal&&this.preventBrowserFocus){$.one("mousedown",function(k){k.preventDefault();});}this._duringClose();if(e==0){this._closed();}else if(this._animations.close){this._animations.close.call(null,$,e,this._closed.bind(this));}else{$.fadeOut(e,this._closed.bind(this));}};P.prototype._closed=function(){if(this._bModal){this._hideBlockLayer();}var $=this._$(false,true);if($.length){var o=$.get(0);if(o){o.style.display="none";o.style.visibility="hidden";o.style.left="0px";o.style.top="0px";o.style.right="";}$=this._$(false,true);o=$.length?$[0]:null;if(o){o.style.display="none";o.style.visibility="hidden";o.style.left="0px";o.style.top="0px";o.style.right="";}}if(this._bModal){P.applyFocusInfo(this._oPreviousFocus);this._oPreviousFocus=null;this.oLastBlurredElement=null;}this.bOpen=false;this.eOpenState=h.CLOSED;var e=this.getChildPopups();for(var j=0,l=e.length;j<l;j++){this.closePopup(e[j]);}this.fireClosed();};P.prototype._duringClose=function(){if(this._resizeListenerId){a.deregister(this._resizeListenerId);this._resizeListenerId=null;}};P.getCurrentFocusInfo=function(){var _=null;var e=sap.ui.getCore().getCurrentFocusedControlId();if(e){var o=sap.ui.getCore().byId(e);_={'sFocusId':e,'oFocusInfo':o?o.getFocusInfo():{}};}else{try{var i=document.activeElement;if(i&&i.nodeName){_={'sFocusId':i.id,'oFocusedElement':i,'oFocusInfo':{}};}}catch(j){_=null;}}if(_){_.popup=this;}return _;};P.applyFocusInfo=function(p){var o={preventScroll:true};if(p){var e=sap.ui.getCore().byId(p.sFocusId);if(e){e.applyFocusInfo(Object.assign(o,p.oFocusInfo));}else{var i=((p.sFocusId?window.document.getElementById(p.sFocusId):null))||p.oFocusedElement;if(i){i.focus(o);}}}};P.prototype.setContent=function(o){c(typeof o==="object","oContent must be an object");this.oContent=o;return this;};P.prototype.getContent=function(){return this.oContent;};P.prototype.setPosition=function(m,e,o,i,j){c(typeof m==="string","my must be a string");c(typeof e==="string"||(typeof e==="object"&&(typeof e.left==="number")&&(typeof e.top==="number")),"my must be a string or an object with 'left' and 'top' properties");c(!o||typeof o==="object"||typeof o==="function","of must be empty or an object");c(!i||typeof i==="string","offset must be empty or a string");c(!j||typeof j==="string","collision must be empty or a string");this._oPosition=this._createPosition(m,e,o,i,j);if(this.eOpenState!=h.CLOSED){this._applyPosition(this._oPosition);this._oBlindLayer&&this._oBlindLayer.update(this._$());}return this;};P.prototype._createPosition=function(m,e,o,i,j){var n=false;if(m&&(m.indexOf("+")>=0||m.indexOf("-")>=0)){n=true;if(i&&i!="0 0"){L.warning("offset used in my and in offset, the offset value will be ignored","sap.ui.core.Popup","setPosition");}i=null;}var p=q.extend({},this._oDefaultPosition,{"my":m||this._oDefaultPosition.my,"at":e||this._oDefaultPosition.at,"of":o,"offset":i,"collision":j});if(!q.ui.version){if(P._bNewOffset==null){P._bNewOffset=true;var $=q(document.createElement("div"));$.position({of:window,using:function(v,w){P._bNewOffset=(w!==undefined);}});}}var k=[];var l=[];if(P._bNewOffset||V(q.ui.version).compareTo("1.8.23")>0){if(i&&i!="0 0"){k=p.my.split(" ");l=i.split(" ");var s=[parseInt(l[0])<0?"":"+",parseInt(l[1])<0?"":"+"];p.my=k[0]+s[0]+l[0]+" "+k[1]+s[1]+l[1];p.offset=null;}}else if(n){k=p.my.split(" ");l=["",""];var t=k[0].indexOf("+");if(t<0){t=k[0].indexOf("-");}if(t>=0){l[0]=k[0].slice(t);k[0]=k[0].slice(0,t);}t=k[1].indexOf("+");if(t<0){t=k[1].indexOf("-");}if(t>=0){l[1]=k[1].slice(t);k[1]=k[1].slice(0,t);}p.my=k[0]+" "+k[1];p.offset=l[0]+" "+l[1];}return p;};P.prototype._getPositionOffset=function(){var o=[];if(this._oPosition.my&&(this._oPosition.my.indexOf("+")>=0||this._oPosition.my.indexOf("-")>=0)){var m=this._oPosition.my.split(" ");var i=m[0].indexOf("+");if(i<0){i=m[0].indexOf("-");}if(i>=0){o[0]=m[0].slice(i);}i=m[1].indexOf("+");if(i<0){i=m[1].indexOf("-");}if(i>=0){o[1]=m[1].slice(i);}}else if(this._oPosition.offset){o=this._oPosition.offset.split(" ");}return o;};P.prototype._applyPosition=function(p){var e=sap.ui.getCore().getConfiguration().getRTL();var $=this._$();if($.length){var A=p.at;var o=$.get(0);if(typeof(A)==="string"){o.style.display="block";o.style.left="";o.style.right="";$.position(this._resolveReference(this._convertPositionRTL(p,e)));this._fixPositioning(p,e);}else if(g.isValid(A.left)&&g.isValid(A.top)){$.css({"left":A.left,"top":A.top});}else if(g.isValid(A.right)&&g.isValid(A.top)){$.css({"right":A.right,"top":A.top});}else if(typeof(A.left)==="number"&&typeof(A.top)==="number"){var i=$[0];if(i&&i.style.right){var w=$.outerWidth();$.css({"right":(document.documentElement.clientWidth-(A.left+w))+"px","top":A.top+"px"});}else{$.css({"left":A.left+"px","top":A.top+"px"});}}this._oLastPosition=p;this._oLastOfRect=this._calcOfRect(p.of);}};P.prototype._calcOfRect=function(o){var e=this._getOfDom(o);if(e){return q(e).rect();}return null;};P.prototype._getOfDom=function(o){if(o instanceof q.Event){return null;}var $;if(typeof(o)==="string"){$=q(document.getElementById(o));}else if(o instanceof q){$=o;}else{$=q(o instanceof E?o.getDomRef():o);}return $[0];};P.prototype._convertPositionRTL=function(p,e){var o=q.extend({},p);if(e){var n=false;if(o.my&&(o.my.indexOf("+")>=0||o.my.indexOf("-")>=0)){n=true;}if((o.offset||n)&&((o.my.indexOf("begin")>-1)||(o.my.indexOf("end")>-1))&&((o.at.indexOf("begin")>-1)||(o.at.indexOf("end")>-1))){if(n){var m=o.my.split(" ");if(m.length==2){o.my="";if(m[0]){if(m[0].indexOf("begin")>-1||m[0].indexOf("end")>-1){if(m[0].indexOf("+")>-1){m[0]=m[0].replace("+","-");}else if(m[0].indexOf("-")>-1){m[0]=m[0].replace("-","+");}}o.my=m[0];}if(m[1]){if(m[1].indexOf("begin")>-1||m[1].indexOf("end")>-1){if(m[1].indexOf("+")>-1){m[1]=m[1].replace("+","-");}else if(m[1].indexOf("-")>-1){m[1]=m[1].replace("-","+");}}if(m[0]){o.my=o.my+" ";}o.my=o.my+m[1];}}}else{o.offset=this._mirrorOffset(o.offset);}}o.my=o.my.replace("begin","right").replace("end","left");o.at=o.at.replace("begin","right").replace("end","left");}else{o.my=o.my.replace("end","right").replace("begin","left");o.at=o.at.replace("end","right").replace("begin","left");}return o;};P.prototype._mirrorOffset=function(o){var e=q.trim(o).split(/\s/);var p=parseInt(e[0]);return(-p)+" "+e[e.length-1];};P.prototype._fixPositioning=function(p,e){var m=p.my;var $=this._$();var i=0;if(typeof(m)==="string"){if(e&&((m.indexOf("right")>-1)||(m.indexOf("begin")>-1)||(m.indexOf("center")>-1))){$=this._$();i=q(window).width()-$.outerWidth()-$.offset().left;$.css({"right":i+"px","left":""});}else if((m.indexOf("right")>-1)||(m.indexOf("end")>-1)){$=this._$();i=q(window).width()-$.outerWidth()-$.offset().left;$.css({"right":i+"px","left":""});}}};P.prototype._resolveReference=function(p){var o=p;if(p.of instanceof E){o=q.extend({},p,{of:p.of.getDomRef()});}return o;};P.prototype.setShadow=function(s){c(typeof s==="boolean","bShowShadow must be boolean");this._bShadow=s;if(this.eOpenState!=h.CLOSED){this._$().toggleClass("sapUiShd",s);}return this;};P.prototype.setModal=function(m,s){c(typeof m==="boolean","bModal must be boolean");c(!s||typeof s==="string","sModalCSSClass must be empty or a string");var o=this._bModal;this._bModal=m;this._sModalCSSClass=s;if(this.isOpen()){if(o!==m){if(m){this._showBlockLayer();}else{this._hideBlockLayer();}if(this.touchEnabled&&this._bAutoClose){if(!m){q(document).on("touchstart mousedown",q.proxy(this._fAutoCloseHandler,this));}else{q(document).off("touchstart mousedown",this._fAutoCloseHandler);}}}}return this;};P.prototype.getModal=function(){return this._bModal;};P.prototype.setNavigationMode=function(m){if(m!="NONE"&&m!="DOCK"&&m!="SCOPE"){this._sF6NavMode="NONE";}this._sF6NavMode=m;};P.prototype.setAutoClose=function(A){c(typeof A==="boolean","bAutoClose must be boolean");if(this.touchEnabled&&this.isOpen()&&this._bAutoClose!==A){if(!this._bModal){if(A){q(document).on("touchstart mousedown",q.proxy(this._fAutoCloseHandler,this));}else{q(document).off("touchstart mousedown",this._fAutoCloseHandler);}}}this._bAutoClose=A;return this;};P.prototype.setAutoCloseAreas=function(A){c(Array.isArray(A),"aAutoCloseAreas must be an array which contains either sap.ui.core.Element, DOM Element or an ID");if(!this._aAutoCloseAreas){this._aAutoCloseAreas=[];}var e=function(m){return{onBeforeRendering:function(){var n=o.getDomRef();if(n&&this.isOpen()){if(D.browser.msie){q(n).unbind("deactivate."+this._popupUID,this.fEventHandler);}else{n.removeEventListener("blur",this.fEventHandler,true);}}},onAfterRendering:function(){var n=o.getDomRef();if(n&&this.isOpen()){if(D.browser.msie){q(n).bind("deactivate."+this._popupUID,this.fEventHandler);}else{n.addEventListener("blur",this.fEventHandler,true);}}}};};var s,o,j,k;for(var i=0,l=A.length;i<l;i++){o=A[i];if(o instanceof E){s=o.getId();}else if(typeof o==="object"){s=o.id;}else if(typeof o==="string"){s=o;}if(this.getChildPopups().indexOf(s)===-1){this.addChildPopup(s);k={id:s};if(o instanceof E){j=e(o);o.addEventDelegate(j,this);k.delegate=j;}this._aAutoCloseAreas.push(k);}}return this;};P.prototype.setAnimations=function(o,e){c(o===null||typeof o==="function","fnOpen must be a function");c(e===null||typeof e==="function","fnClose must be a function");if(o&&(typeof(o)=="function")){this._animations.open=o;}if(e&&(typeof(e)=="function")){this._animations.close=e;}return this;};P.prototype.setDurations=function(o,i){c(o===null||(typeof o==="number"&&(o%1==0)),"iOpenDuration must be null or an integer");c(!i||(typeof i==="number"&&(i%1==0)),"iOpenDuration must be undefined or an integer");if((o>0)||(o===0)){this._durations.open=o;}if((i>0)||(i===0)){this._durations.close=i;}return this;};P.CLOSE_ON_SCROLL="close_Popup_if_of_is_moved";P.prototype._fnCloseOnScroll=function(e){this.close();};P.prototype.setFollowOf=function(e){P.DockTrigger.removeListener(P.checkDocking,this);var U=false;this._bFollowOf=true;this._followOfHandler=null;if(typeof(e)==="function"){this._followOfHandler=e;U=true;}else if(typeof(e)==="boolean"){U=e;}else if(e===P.CLOSE_ON_SCROLL){this._followOfHandler=this._fnCloseOnScroll;U=true;}else{this._bFollowOf=false;if(e!==null){L.error("Trying to set an invalid type to 'followOf: "+e);}}if(U&&this._oLastPosition){this._oLastOfRect=this._calcOfRect(this._oLastPosition.of);}if(this._bFollowOf&&this.getOpenState()===h.OPEN){P.DockTrigger.addListener(P.checkDocking,this);}};P.prototype.getAutoClose=function(){return this._bAutoClose;};P.prototype.getFollowOf=function(){if(this._bFollowOf){return typeof(this._followOfHandler)==="function"?this._followOfHandler:true;}return false;};P.prototype.isOpen=function(){return this.bOpen;};P.prototype.getOpenState=function(){return this.eOpenState;};P.prototype.destroy=function(){if(this._resizeListenerId){a.deregister(this._resizeListenerId);this._resizeListenerId=null;}this.close(0);this.oContent=null;if(this._bFollowOf){this.setFollowOf(null);}if(this._bEventBusEventsRegistered){this._unregisterEventBusEvents();}if(this._iTopShieldRemoveTimer){clearTimeout(this._iTopShieldRemoveTimer);this.oShieldLayerPool.returnObject(this._oTopShieldLayer);this._oTopShieldLayer=null;this._iTopShieldRemoveTimer=null;}if(this._iBottomShieldRemoveTimer){clearTimeout(this._iBottomShieldRemoveTimer);this.oShieldLayerPool.returnObject(this._oBottomShieldLayer);this._oBottomShieldLayer=null;this._iBottomShieldRemoveTimer=null;}if(this._aAutoCloseAreas){var e;this._aAutoCloseAreas.forEach(function(A){if(A.delegate){e=q(document.getElementById(A.id)).control(0);if(e){e.removeEventDelegate(A.delegate);}}});}M.prototype.destroy.apply(this,arguments);};P.prototype.exit=function(){delete this._mEvents;};P.prototype._addFocusEventListeners=function(s,e,o){if(!this.fEventHandler){this.fEventHandler=q.proxy(this.onFocusEvent,this);}var p=this._$();var j=this.getChildPopups();var k={};var i=0,l=0;if(p.length){if(document.addEventListener&&!D.browser.msie){document.addEventListener("focus",this.fEventHandler,true);p.get(0).addEventListener("blur",this.fEventHandler,true);for(i=0,l=j.length;i<l;i++){k=(j[i]?window.document.getElementById(j[i]):null);if(k){k.addEventListener("blur",this.fEventHandler,true);}}}else{q(document).bind("activate."+this._popupUID,this.fEventHandler);p.bind("deactivate."+this._popupUID,this.fEventHandler);for(i=0,l=j.length;i<l;i++){k=(j[i]?window.document.getElementById(j[i]):null);if(k){q(k).bind("deactivate."+this._popupUID,this.fEventHandler);}}}}};P.prototype._removeFocusEventListeners=function(s,e,o){var p=this._$(false,true);if(!p.length){return;}var j=this.getChildPopups();var k={};var i=0,l=0;if(document.removeEventListener&&!D.browser.msie){document.removeEventListener("focus",this.fEventHandler,true);p.get(0).removeEventListener("blur",this.fEventHandler,true);for(i=0,l=j.length;i<l;i++){k=(j[i]?window.document.getElementById(j[i]):null);if(k){k.removeEventListener("blur",this.fEventHandler,true);}this.closePopup(j[i]);}}else{q(document).unbind("activate."+this._popupUID,this.fEventHandler);p.unbind("deactivate."+this._popupUID,this.fEventHandler);for(i=0,l=j.length;i<l;i++){k=(j[i]?window.document.getElementById(j[i]):null);if(k){q(k).unbind("deactivate."+this._popupUID,this.fEventHandler);}}}this.fEventHandler=null;};P.prototype._activateFocusHandle=function(){if(this._bModal||this._bAutoClose){this._addFocusEventListeners();}if(this.touchEnabled&&!this._bModal&&this._bAutoClose){q(document).on("touchstart mousedown",q.proxy(this._fAutoCloseHandler,this));}};P.prototype._deactivateFocusHandle=function(){if(this.fEventHandler){this._removeFocusEventListeners();}if(this.touchEnabled&&!this._bModal&&this._bAutoClose){q(document).off("touchstart mousedown",this._fAutoCloseHandler);}};P.prototype._registerEventBusEvents=function(s,e,o){var t=this;q.each(t._mEvents,function(i,l){sap.ui.getCore().getEventBus().subscribe("sap.ui",i,l,t);});this._bEventBusEventsRegistered=true;};P.prototype._unregisterEventBusEvents=function(s,e,o){var t=this;q.each(t._mEvents,function(i,l){sap.ui.getCore().getEventBus().unsubscribe("sap.ui",i,l,t);});delete this._bEventBusEventsRegistered;};P.prototype._addFocusableArea=function(s,e,o){if(this.getChildPopups().indexOf(o.id)===-1){this.addChildPopup(o.id);}};P.prototype._removeFocusableArea=function(s,e,o){this.removeChildPopup(o.id);};P.prototype._closePopup=function(s,e,o){this.close(typeof this._durations.close==="string"?0:this._durations.close);};P.prototype._setIdentity=function($){if(typeof $==="object"){$.attr("data-sap-ui-popup",this._popupUID);}else{L.warning("Incorrect DomRef-type for 'setIdentity': "+$,this);return;}if(!this._bEventBusEventsRegistered){this._registerEventBusEvents();}};P.prototype._$=function(e,G){var $;if(this.oContent instanceof C){$=this.oContent.$();if(e||($.length===0&&!G)){L.info("Rendering of popup content: "+this.oContent.getId());if($.length>0){R.preserveContent($[0],true,false);}sap.ui.getCore().getRenderManager().render(this.oContent,sap.ui.getCore().getStaticAreaRef());$=this.oContent.$();}}else if(this.oContent instanceof E){$=this.oContent.$();}else{$=q(this.oContent);}this._setIdentity($);return $;};P.prototype._showBlockLayer=function(){var $=q("#sap-ui-blocklayer-popup"),s="sapUiBLy"+(this._sModalCSSClass?" "+this._sModalCSSClass:"");if($.length===0){$=q('<div id="sap-ui-blocklayer-popup" tabindex="0" class="'+s+'"></div>');$.appendTo(sap.ui.getCore().getStaticAreaRef());}else{$.removeClass().addClass(s);}P.blStack.push({zIndex:this._iZIndex-2,popup:this});$.css({"z-index":this._iZIndex-2,"visibility":"visible"}).show();q("html").addClass("sapUiBLyBack");};P.prototype._hideBlockLayer=function(){P.blStack.pop();var $=q("#sap-ui-blocklayer-popup");if($.length){var o=$.get(0);if(P.blStack.length>0){o.style.zIndex=P.blStack[P.blStack.length-1].zIndex;o.style.visibility="visible";o.style.display="block";}else{o.style.visibility="hidden";o.style.display="none";window.setTimeout(function(){q("html").removeClass("sapUiBLyBack");},0);}}};P.prototype._isFocusInsidePopup=function(){var o=this._$(false).get(0);if(o&&d(o,document.activeElement)){return true;}return false;};P.DockTrigger=new I(200);P.checkDocking=function(){if(this.getOpenState()===h.OPEN){var o=this._getOfDom(this._oLastPosition.of),e=q(o).rect();if(!e){this.close();return;}else if(e.left===0&&e.top===0&&e.height===0&&e.height===0&&this._oLastPosition.of.id){this._oLastPosition.of=window.document.getElementById(this._oLastPosition.of.id);o=this._getOfDom(this._oLastPosition.of);e=q(o).rect();if(!e){this.close();return;}}if(!d(document.documentElement,o)){if(o.id){var n=window.document.getElementById(o.id);var N=q(n).rect();if(N&&!r(e,N)){e=N;delete this._oLastPosition.of;this._oLastPosition.of=n;}}}if(this._oLastOfRect){if(!r(this._oLastOfRect,e)){if(this._followOfHandler){var l=q.extend(true,{},this._oLastPosition),i=q.extend(true,{},this._oLastOfRect);this._followOfHandler({lastPosition:l,lastOfRect:i,currentOfRect:e});}else{this._applyPosition(this._oLastPosition);}}}}};P.prototype.ontouchstart=function(e){this.onmousedown(e,true);this._bMousedownCalled=true;};P.prototype.onmousedown=function(e,s){if(this._bMousedownCalled&&!s){this._bMousedownCalled=false;return;}if(this._iZIndex===this.getLastZIndex()||this.getModal()){return;}this._increaseMyZIndex("","mousedown",e);};P.prototype._increaseMyZIndex=function(s,e,o){var p=this.getParentPopup(this._oLastPosition.of);if(o&&o.type==="mousedown"||o&&o.isFromParentPopup||p.length===0){this._iZIndex=this.getNextZIndex();var $=this._$(false,true);$.css("z-index",this._iZIndex);if(this._oBlindLayer){this._oBlindLayer.update($,this._iZIndex-1);}if(o&&!o.type||o&&o.type!="mousedown"||e==="mousedown"){var j=this.getChildPopups();for(var i=0,l=j.length;i<l;i++){this.increaseZIndex(j[i],true);}}}else if(p.length>0){var k=q(p.get(0)).attr("data-sap-ui-popup");this.increaseZIndex(k,false);}};P.prototype.onAfterRendering=function(e){var o=this.getContent();var $=o instanceof E?o.$():q(o);$.toggleClass("sapUiShd",this._bShadow);$.css("position","absolute");this._setIdentity($);var i=$[0];var l=i.style.left;var j=i.style.right;var t=i.style.top;var k=i.style.bottom;if(!(l&&l!="auto"||j&&j!="auto"||t&&t!="auto"||k&&k!="auto")){L.debug("reposition popup content "+$.attr("id")+" at "+(window.JSON?JSON.stringify(this._oLastPosition.at):String(this._oLastPosition.at)));this._applyPosition(this._oLastPosition);}$.show().css({"visibility":"visible","z-index":this._iZIndex});if(this._oBlindLayer){this._resizeListenerId=a.register(this._$().get(0),q.proxy(this.onresize,this));}if(this.isOpen()&&(this.getModal()||this.getAutoClose())){this._addFocusEventListeners();}this._$(false,true).on("keydown",q.proxy(this._F6NavigationHandler,this));};P.prototype.onBeforeRendering=function(e){if(this._resizeListenerId){a.deregister(this._resizeListenerId);this._resizeListenerId=null;}if(this.isOpen()&&(this.getModal()||this.getAutoClose())){this._removeFocusEventListeners();}this._$(false,true).off("keydown",this._F6NavigationHandler);};P.prototype.onresize=function(e){if(this.eOpenState!=h.CLOSED&&this._oBlindLayer){var t=this;setTimeout(function(){t._updateBlindLayer();},0);}};P.prototype._updateBlindLayer=function(){if(this.eOpenState!=h.CLOSED&&this._oBlindLayer){this._oBlindLayer.update(this._$(false,true));}};P.prototype.isInPopup=function(t){var p=this.getParentPopup(t);return p&&p.length>0;};P.prototype.getParentPopup=function(t){var T=t?t:this;var $=q(T instanceof E?T.getDomRef():T);return $.closest("[data-sap-ui-popup]");};P.prototype.getParentPopupId=function(t){var p=this.getParentPopup(t);return p.attr("data-sap-ui-popup");};P.prototype.addChildToPopup=function(p,s){var e="sap.ui.core.Popup.addFocusableContent-"+p;sap.ui.getCore().getEventBus().publish("sap.ui",e,{id:s});};P.prototype.removeChildFromPopup=function(p,s){var e="sap.ui.core.Popup.removeFocusableContent-"+p;sap.ui.getCore().getEventBus().publish("sap.ui",e,{id:s});};P.prototype.closePopup=function(p){var e="sap.ui.core.Popup.closePopup-"+p;sap.ui.getCore().getEventBus().publish("sap.ui",e);};P.prototype.increaseZIndex=function(p,i){var e="sap.ui.core.Popup.increaseZIndex-"+p;sap.ui.getCore().getEventBus().publish("sap.ui",e,{isFromParentPopup:i?i:false});};P.prototype.focusTabChain=function(p){var s=p.event.target,n=p.that.getMetadata().getName(),o;if((!p.$FocusablesContent||!p.$FocusablesFooter)||(!p.$FocusablesContent.length&&!p.$FocusablesFooter.length)){return;}if(s.id===p.firstFocusable){L.debug("First dummy focus element was focused","",n);if(p.$FocusablesFooter.length>0){L.debug("Last footer element will be focused","",n);o=p.$FocusablesFooter[p.$FocusablesFooter.length-1];}else{L.debug("Last content element will be focused","",n);o=p.$FocusablesContent[p.$FocusablesContent.length-1];}}else if(s.id===p.lastFocusable){L.debug("Last dummy focus element was focues","",n);if(p.$FocusablesContent.length>0){L.debug("First content element will be focused","",n);o=p.$FocusablesContent[0];}else{L.debug("First footer element will be focused","",n);o=p.$FocusablesFooter[0];}}if(o){setTimeout(function(){var e=sap.ui.getCore().byId(o.id);if(e instanceof C){L.debug("Focus will be handled by "+e.getMetadata().getName(),"",n);}else{L.debug("oFocusDomRef will be focused","",n);}if(e){e.focus();}else if(o){o.focus();}return e?e.getId():o.id;},0);}};return P;});
