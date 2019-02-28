/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/m/Button','sap/ui/base/Interface','sap/ui/Device','sap/ui/core/library'],function(q,l,C,B,I,D,a){"use strict";var S=C.extend("sap.m.SelectionDetails",{metadata:{library:"sap.m",defaultAggregation:"items",aggregations:{"items":{type:"sap.m.SelectionDetailsItem",multiple:true,bindable:"bindable"},"actions":{type:"sap.ui.core.Item",multiple:true},"actionGroups":{type:"sap.ui.core.Item",multiple:true},"_popover":{type:"sap.m.ResponsivePopover",multiple:false,visibility:"hidden"},"_button":{type:"sap.m.Button",multiple:false,visibility:"hidden"}},events:{beforeOpen:{},beforeClose:{},navigate:{parameters:{item:{type:"sap.m.SelectionDetailsItem"},direction:{type:"string"},content:{type:"sap.ui.core.Control"}}},actionPress:{parameters:{action:{type:"sap.ui.core.Item"},items:{type:"sap.m.SelectionDetailsItem"},level:{type:"sap.m.SelectionDetailsActionLevel"}}}}}});S._MAX_ACTIONGROUPS=5;S._POPOVER_MAX_HEIGHT=500;S.prototype.init=function(){this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");this.setAggregation("_button",new B({id:this.getId()+"-button",type:l.ButtonType.Transparent,press:[this._onToolbarButtonPress,this]}),true);this._oItemFactory=null;};S.prototype.onBeforeRendering=function(){this._updateButton();};S.prototype.exit=function(){this.detachSelectionHandler();this._oItemFactory=null;this._oChangeHandler=null;};S.prototype.isOpen=function(){var p=this.getAggregation("_popover");return p?p.isOpen():false;};S.prototype.isEnabled=function(){return this.getItems().length>0;};S.prototype.close=function(){var p=this.getAggregation("_popover");if(p){p.close();}return this;};S.prototype.navTo=function(t,c){if(this.isOpen()){sap.ui.require(["sap/m/Page","sap/m/Toolbar","sap/m/ToolbarSpacer","sap/m/Title"],this._handleNavLazy.bind(this,t,c));}return this;};S.prototype.setPopoverModal=function(m){this._getPopover().setModal(m);return this;};S.prototype._handleNavLazy=function(p,c,P,T,b,d,B){var s=this.getId()+"-page-for-"+c.getId()+"-uid-"+q.sap.uid();this._setPopoverHeight(S._POPOVER_MAX_HEIGHT);var o=new P(s,{customHeader:this._getPageToolbar(T,b,d,true,p),content:[c]});this._oNavContainer.addPage(o);this._oNavContainer.to(s);};S.prototype._getPageToolbar=function(T,b,c,s,p){var t=new T({design:l.ToolbarDesign.Transparent}).addStyleClass("sapMSDPageHeader");if(s){var o=new B({icon:"sap-icon://nav-back",press:this._onBackButtonPress.bind(this)});t.addAggregation("content",o,true);}var d=new b();var e=new c({text:p,titleStyle:a.TitleLevel.H5});t.addAggregation("content",d,true);t.addAggregation("content",e,true);t.addAggregation("content",d.clone(),true);if(D.system.phone){t.addAggregation("content",this._getCloseButton(),true);}return t;};S.prototype._setPopoverHeight=function(h){if(!D.system.phone){var p=this._getPopover(),P=p.$("cont"),m=this._getMaxPopoverHeight();h=Math.min(S._POPOVER_MAX_HEIGHT,h);p._oControl._deregisterContentResizeHandler();P.animate({"height":Math.min(h,m)},sap.ui.getCore().getConfiguration().getAnimation()?100:0,function(){p.setProperty("contentHeight",h+"px",true);p._oControl._registerContentResizeHandler();});}};S.prototype._getMaxPopoverHeight=function(){var r=this._getPopover(),R=r.$(),o,v,p;if(!R.length){return 0;}o=R.offset().top;v=D.resize.height;p=r._oControl;p._adaptPositionParams();return v-o-p._marginBottom;};S.prototype._onBackButtonPress=function(){var c=this._oNavContainer.getCurrentPage().getContent()[0];this._oNavContainer.attachEventOnce("afterNavigate",function(){this.fireNavigate({item:this._oItemForNavigation,direction:"back",content:c});},this);this._oNavContainer.back();if(this._oNavContainer.getCurrentPage()===this._oInitialPage){this._setPopoverHeight(this._getInitialPageHeight());}};S.prototype._getCloseButton=function(){return new B({icon:"sap-icon://decline",press:this.close.bind(this)});};S.prototype._aFacadeMethods=["addCustomData","getCustomData","indexOfCustomData","insertCustomData","removeCustomData","removeAllCustomData","destroyCustomData","data","addEventDelegate","removeEventDelegate","close","isOpen","isEnabled","attachBeforeOpen","detachBeforeOpen","attachBeforeClose","detachBeforeClose","attachNavigate","detachNavigate","attachActionPress","detachActionPress","addAction","removeAction","removeAllActions","addActionGroup","removeActionGroup","removeAllActionGroups","navTo"];S.prototype.getFacade=function(){var f=new I(this,S.prototype._aFacadeMethods,true);f.getItems=this._getItemFacades.bind(this);this.getFacade=q.sap.getter(f);return f;};S.prototype._getItemFacades=function(){var b=this.getItems();var c=[];for(var i=0;i<b.length;i++){c.push(b[i].getFacade());}return c;};S.prototype._updateButton=function(){var t,c,b=this.getAggregation("_button");if(this._oSelectionData&&this._oSelectionData.length>=0){c=this._oSelectionData.length;}else{c=this.getItems().length;}if(c>0){t=this._oRb.getText("SELECTIONDETAILS_BUTTON_TEXT_WITH_NUMBER",[c]);b.setProperty("text",t,true);b.setProperty("enabled",true,true);}else{t=this._oRb.getText("SELECTIONDETAILS_BUTTON_TEXT");b.setProperty("text",t,true);b.setProperty("enabled",false,true);}};S.prototype._onToolbarButtonPress=function(){sap.ui.require(['sap/m/NavContainer','sap/m/ResponsivePopover','sap/m/Page',"sap/m/Toolbar",'sap/m/OverflowToolbar','sap/m/ToolbarSpacer','sap/m/Button','sap/m/List','sap/m/StandardListItem','sap/ui/layout/FixFlex','sap/m/ScrollContainer',"sap/m/Title"],this._handlePressLazy.bind(this));};S.prototype._handlePressLazy=function(N,R,P,T,O,b,B,L,c,F,d,e){var p=this._getPopover(N,R,T,b,P,L,F,d,e);if(this._oItemFactory){this._callFactory();}this.fireBeforeOpen();this._addMainListItems();this._addActionGroupListItems(c);this._addListActions(O,b,B);this._oNavContainer.setProperty("defaultTransitionName","show",true);this._oNavContainer.to(this._oInitialPage);this._oNavContainer.setProperty("defaultTransitionName","slide",true);p.openBy(this.getAggregation("_button"));p.invalidate();};S.prototype._callFactory=function(){var f=this._oItemFactory.factory,d=this._oItemFactory.data,s=this._oSelectionData,r;this.fireEvent("beforeUpdate",{items:this.getItems()});this.destroyAggregation("items",true);for(var i=0;i<s.length;i++){r=f(s[i].displayData,s[i].data,s[i].context,d);if(r){r._sMarkerShapeString=s[i].shapeString;this.addAggregation("items",r,true);}}this.fireEvent("afterUpdate",{items:this.getItems()});};S.prototype._getInitialPage=function(P,T,b,c){if(!this._oInitialPage){this._oInitialPage=new P(this.getId()+"-page",{showHeader:false,enableScrolling:false});if(D.system.phone){this._oInitialPage.setProperty("showHeader",true,true);this._oInitialPage.setAggregation("customHeader",this._getPageToolbar(T,b,c),true);}}return this._oInitialPage;};S.prototype._getNavContainer=function(N){return this._oNavContainer||(this._oNavContainer=new N(this.getId()+"-nav-container"));};S.prototype._getPopover=function(N,R,T,b,P,L,F,c,d){var p=this.getAggregation("_popover"),n,o,m,A,M;if(!p){p=new R({id:this.getId()+"-popover",placement:l.PlacementType.Bottom,showHeader:false,contentWidth:"25rem",contentHeight:"500px",beforeClose:this.fireBeforeClose.bind(this)}).addStyleClass("sapMSD");p.setProperty=this._setPopoverProperty;o=this._getInitialPage(P,T,b,d);A=this._getActionGroupList(L);n=this._getNavContainer(N);M=this._getMainList(L);m=this._createMainContainer(F);m.setAggregation("flexContent",M,true);m.addAggregation("fixContent",A,true);o.addAggregation("content",m,true);n.addPage(o);p.addAggregation("content",n,true);if(!D.system.phone){p.addEventDelegate({onAfterRendering:this._updatePopoverContentHeight.bind(this)});}this.setAggregation("_popover",p,true);}return p;};S.prototype._setPopoverProperty=function(p,v){var P=this._oControl.getMetadata().getProperty(p);if(P&&p==="modal"&&this._oControl.setModal){this._oControl.setModal(v);}else{this._oControl.setProperty.apply(this._oControl,arguments);}return C.prototype.setProperty.apply(this,arguments);};S.prototype._updatePopoverContentHeight=function(){var c=this._getInitialPageHeight(),p=this._getPopover();if(D.browser.edge&&this._oMainList.getDomRef()&&this._oMainList.getDomRef().getBoundingClientRect().height===0){p.setContentHeight(S._POPOVER_MAX_HEIGHT+"px");return;}if(this._oNavContainer.getCurrentPage()===this._oInitialPage&&c<S._POPOVER_MAX_HEIGHT){p.setProperty("contentHeight",c+"px",true);}else{p.setProperty("contentHeight",S._POPOVER_MAX_HEIGHT+"px",true);}};S.prototype._getInitialPageHeight=function(){var f=this._oInitialPage&&this._oInitialPage.getFooter(),L=this._oMainList.$().outerHeight(),A=this._oActionGroupList.$().outerHeight(),t=f&&f.$().outerHeight()||0;return L+A+t;};S.prototype._createMainContainer=function(F){return new F(this.getId()+"-mainContainer",{fixFirst:false,minFlexSize:-1});};S.prototype._getMainList=function(L){if(!this._oMainList){this._oMainList=new L(this.getId()+"-list");}return this._oMainList;};S.prototype._addMainListItems=function(){var i,b,L;this._oMainList.removeAllAggregation("items",true);b=this.getItems();for(i=0;i<b.length;i++){if(!b[i].hasListeners("_navigate")){b[i].attachEvent("_navigate",this._onNavigate,this);}if(!b[i].hasListeners("_actionPress")){b[i].attachEvent("_actionPress",this._onActionPress,this);}L=b[i]._getListItem();this._oMainList.addAggregation("items",L,true);}};S.prototype._getActionGroupList=function(L){if(!this._oActionGroupList){this._oActionGroupList=new L(this.getId()+"-actionGroupList",{showNoData:false});}return this._oActionGroupList;};S.prototype._addActionGroupListItems=function(b){this._oActionGroupList.destroyAggregation("items",true);var A=this.getActionGroups(),s,i,d=Math.min(S._MAX_ACTIONGROUPS,A.length);for(i=0;i<d;i++){s=new b(this.getId()+"-actionGroup-"+i,{title:A[i].getText(),type:l.ListType.Navigation,press:[{action:A[i],level:l.SelectionDetailsActionLevel.Group},this._onActionPress,this]});if(i===0){s.addStyleClass("sapMSDFirstActionGroup");}this._oActionGroupList.addAggregation("items",s,true);}};S.prototype._addListActions=function(O,T,B){var b,i,A,o,t;this._oInitialPage.destroyAggregation("footer",true);if(!this.getActions().length){return;}t=new O(this.getId()+"-action-toolbar").addStyleClass("sapContrast sapContrastPlus");this._oInitialPage.setAggregation("footer",t,true);t.addAggregation("content",new T(),true);A=this.getActions();for(i=0;i<A.length;i++){o=A[i];b=new B(this.getId()+"-action-"+i,{text:o.getText(),enabled:o.getEnabled(),press:[{action:o,level:l.SelectionDetailsActionLevel.List},this._onActionPress,this]});t.addAggregation("content",b,true);}};S.prototype._onActionPress=function(e,d){this.fireActionPress({action:d&&d.action||e.getParameter("action"),items:e.getParameter("items")||this.getItems(),level:d&&d.level||e.getParameter("level")});};S.prototype._onNavigate=function(e){this._oItemForNavigation=e.getSource();this.fireNavigate({item:e.getSource(),direction:"to"});};S.prototype._handleSelectionChange=function(e){var E=e.getParameter("data");if(q.type(E)==="array"){this._oSelectionData=E;this._updateButton();this.getAggregation("_button").rerender();}};S.prototype.registerSelectionDetailsItemFactory=function(d,f){if(typeof(d)==="function"){f=d;d=undefined;}if(typeof f==="function"){this._oItemFactory={factory:f,data:d};}return this;};S.prototype.attachSelectionHandler=function(e,b){if(this._oChangeHandler||q.type(e)!=="String"&&(q.type(b)!=="object"||q.type(b.attachEvent)!=="function")){return this;}else{this._oChangeHandler={eventId:e,listener:b};b.attachEvent(e,this._handleSelectionChange,this);}return this;};S.prototype.detachSelectionHandler=function(){if(this._oChangeHandler){this._oChangeHandler.listener.detachEvent(this._oChangeHandler.eventId,this._handleSelectionChange,this);this._oChangeHandler=null;}return this;};return S;});
