// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['./DashboardGroupsBox','sap/ushell/resources','sap/ushell/ui/launchpad/AnchorItem','sap/ushell/ui/launchpad/AnchorNavigationBar','sap/ushell/EventHub','sap/ushell/utils','sap/ushell/Config','sap/ui/core/InvisibleText',"sap/m/library","sap/m/Bar","sap/m/ToolbarSpacer","sap/m/Page","sap/m/FlexBox","sap/m/Button","sap/ui/Device","jquery.sap.global","sap/ui/core/mvc/View"],function(D,r,A,a,E,u,C,I,m,B,T,P,F,b,c,q,V){"use strict";sap.ui.jsview("sap.ushell.components.homepage.DashboardContent",{createContent:function(o){var d,v=sap.ui.getCore().byId("viewPortContainer"),e,h=sap.ushell.components.getHomepageManager?sap.ushell.components.getHomepageManager():undefined;this.isTouch=c.system.combi?false:(c.system.phone||c.system.tablet);this.isCombi=c.system.combi;this.parentComponent=sap.ui.core.Component.getOwnerComponentFor(this);this.oModel=this.getModel();this.addStyleClass("sapUshellDashboardView");this.ieHtml5DnD=this.oModel.getProperty("/personalization")&&h&&h.isIeHtml5DnD();this.isContentWasRendered=false;sap.ui.getCore().getEventBus().subscribe("launchpad","initialConfigurationSet",this._onAfterDashboardShow,this);sap.ui.getCore().getEventBus().subscribe("launchpad",'actionModeInactive',this._handleEditModeChange,this);sap.ui.getCore().getEventBus().subscribe("launchpad",'actionModeActive',this._handleEditModeChange,this);sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.Notifications","enablePreviewNotificationChanged",this._enablePreviewNotificationChanged,this);sap.ui.getCore().getEventBus().subscribe("shell","notificationsPreviewContainerCreated",this._notificationsPreviewContainerCreated,this);sap.ui.getCore().getEventBus().subscribe("shell","setPlaceForNotificationsPreview",this._setPlaceForNotificationsPreview,this);this.aDoableObjects=[E.on("CenterViewPointContentRendered").do(this._handleContentRendered.bind(this)),E.once("CoreResourcesComplementLoaded").do(this._enableAnchorBarOverflowAndCreateFooter.bind(this))];sap.ushell.Container.getRenderer('fiori2').getRouter().getRoute("home").attachMatched(this.onAfterNavigate,this);this.addEventDelegate({onAfterRendering:function(){function _(){var h=sap.ushell.components.getHomepageManager();if(!h.getPreparedGroupModel()){h.loadPersonalizedGroups();}else{E.once("firstSegmentCompleteLoaded").do(h.handleFirstSegmentLoaded.bind(h));}}window.setTimeout(_);this.onAfterNavigate();}.bind(this),onAfterShow:function(){this.getController()._addBottomSpace();this.getController()._updateShellHeader();this._onAfterDashboardShow();}.bind(this),onAfterHide:function(f){}});this.oAnchorNavigationBar=this._getAnchorNavigationBar(o);d=new D();this.oDashboardGroupsBox=d.createGroupsBox(o,this.oModel);e=this._previewNotificationEnabled();if(v){v.shiftCenterTransitionEnabled(e);}this.oFilterSelectedGroup=new sap.ui.model.Filter("isGroupSelected",sap.ui.model.FilterOperator.EQ,true);this.oFooter=new B('sapUshellDashboardFooter',{visible:{parts:['/tileActionModeActive','/viewPortState'],formatter:function(f,s){return f&&s==='Center';}},contentRight:[new T()]});this.oPage=new P('sapUshellDashboardPage',{customHeader:this.oAnchorNavigationBar,landmarkInfo:{headerRole:sap.ui.core.AccessibleLandmarkRole.Navigation},floatingFooter:true,footer:this.oFooter,content:[this.oDashboardGroupsBox]});var O=this.oPage.onAfterRendering;this.oPage.onAfterRendering=function(){if(O){O.apply(this,arguments);}var f=this.getDomRef(),s=f.getElementsByTagName('section');q(s[0]).off("scrollstop",o.handleDashboardScroll);q(s[0]).on("scrollstop",o.handleDashboardScroll);};this.oNotificationsContainer=new F({displayInline:true,fitContainer:true,items:[]});this.oViewContainer=new F({fitContainer:true,alignItems:m.FlexAlignItems.Stretch,renderType:m.FlexRendertype.Bare,height:'100%',items:[this.oPage,this.oNotificationsContainer]});return this.oViewContainer;},_notificationsPreviewContainerCreated:function(s,e,d){this.oNotificationsContainer.addItem(d.previewNotificationsContainerPlaceholder);this.oNotificationsContainer.addItem(d.previewNotificationsContainer);},_setPlaceForNotificationsPreview:function(s,e,d){this.oDashboardGroupsBox.toggleStyleClass('sapUshellDashboardGroupsContainerSqueezed',d.EnableNotificationsPreview);this.oAnchorNavigationBar.toggleStyleClass('sapUshellAnchorNavigationBarSqueezed',d.EnableNotificationsPreview);},_getAnchorItemTemplate:function(){var t=this,h=C.last("/core/extension/enableHelp");var o=new A({index:"{index}",title:"{title}",groupId:"{groupId}",defaultGroup:"{isDefaultGroup}",writeHelpId:h,selected:false,isGroupRendered:"{isRendered}",visible:{parts:["/tileActionModeActive","isGroupVisible","visibilityModes"],formatter:function(d,i,v){if(!v[d?1:0]){return false;}return i||d;}},locked:"{isGroupLocked}",isGroupDisabled:{parts:['isGroupLocked','/isInDrag','/homePageGroupDisplay'],formatter:function(i,d,s){return i&&d&&s==='tabs';}},press:function(e){t.oAnchorNavigationBar.handleAnchorItemPress(e);}});o.attachBrowserEvent("focus",function(){this.setNavigationBarItemsVisibility();}.bind(this.oAnchorNavigationBar));return o;},_getAnchorNavigationBar:function(o){var d=new a("anchorNavigationBar",{selectedItemIndex:"{/topGroupInViewPortIndex}",itemPress:[function(e){this._handleAnchorItemPress(e);},o],overflowEnabled:false});d=this._extendAnchorNavigationBar(d);d.addStyleClass("sapContrastPlus");return d;},_extendAnchorNavigationBar:function(o){var e=q.extend(o,{onsapskipforward:function(d){d.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.homepage.ComponentKeysHandler.goToTileContainer(d,this.bGroupWasPressed);this.bGroupWasPressed=false;},onsaptabnext:function(d){d.preventDefault();var j=q(":focus");if(!j.parent().parent().siblings().hasClass("sapUshellAnchorItemOverFlow")||(j.parent().parent().siblings().hasClass("sapUshellAnchorItemOverFlow")&&j.parent().parent().siblings().hasClass("sapUshellShellHidden"))){sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.homepage.ComponentKeysHandler.goToTileContainer(d);this.bGroupWasPressed=false;}else{var f=q(".sapUshellAnchorItemOverFlow button");f.focus();}},onsapskipback:function(d){d.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(d);},onsaptabprevious:function(d){d.preventDefault();var j=q(":focus");if(!j.parent().hasClass("sapUshellAnchorItemOverFlow")){sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(d);}else{var f=q(".sapUshellAnchorItem:visible:first");if(!f.length){sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(d);}else{sap.ushell.components.homepage.ComponentKeysHandler.goToSelectedAnchorNavigationItem();}}},onsapenter:function(d){d.srcControl.getDomRef().click();},onsapspace:function(d){d.srcControl.getDomRef().click();}});return e;},_addActionModeButtonsToDashboard:function(){if(sap.ushell.components.homepage.ActionMode){sap.ushell.components.homepage.ActionMode.init(this.getModel());}},_createActionModeMenuButton:function(){var t=this,o={},d={id:"ActionModeBtn",text:r.i18n.getText("activateEditMode"),icon:'sap-icon://edit',press:function(){this.oDashboardGroupsBox.getBinding("groups").filter([]);var e=this.oDashboardGroupsBox.getGroups();sap.ushell.components.homepage.ActionMode.toggleActionMode(this.oModel,"Menu Item",e);this.oAnchorNavigationBar.updateVisibility();var v=sap.ui.getCore().byId('viewPortContainer');if(v.getCurrentState()!="Center"){sap.ui.getCore().byId("viewPortContainer").switchState("Center");}if(this.oModel.getProperty("/homePageGroupDisplay")!=="scroll"){if(this.oModel.getProperty("/tileActionModeActive")){if(this.oModel.getProperty("/homePageGroupDisplay")==="tabs"){this.oDashboardGroupsBox.getBinding("groups").filter([]);var g=this.oModel.getProperty("/groups"),s;for(var i=0;i<g.length;i++){if(g[i].isGroupSelected){s=i;break;}}this.getController()._scrollToGroup("launchpad","scrollToGroup",{group:{getGroupId:function(){return g[s].groupId;}},groupChanged:false,focus:true});}else{this.oDashboardGroupsBox.getBinding("groups").filter([]);}}else{this.getController()._deactivateActionModeInTabsState();}}}.bind(this)};this.oTileActionsButton=sap.ui.getCore().byId(d.id);if(this.oTileActionsButton&&this.oTileActionsButton.data("isShellHeader")){q.sap.measure.start("FLP:DashboardContent,view._createActionModeMenuButton","attach press and text to edit home page button","FLP");this.oTileActionsButton.setTooltip(d.text);this.oTileActionsButton.setText(d.text);if(!this.bTileActionsButtonPressAttached){this.oTileActionsButton.attachPress(d.press);this.bTileActionsButtonPressAttached=true;}q.sap.measure.end("FLP:DashboardContent,view._createActionModeMenuButton");}else{o.controlType="sap.ushell.ui.launchpad.ActionItem";o.oControlProperties=d;o.bIsVisible=true;o.bCurrentState=true;sap.ushell.Container.getRenderer("fiori2").addUserAction(o).done(function(e){t.oTileActionsButton=e;if(C.last("/core/extension/enableHelp")){t.oTileActionsButton.addStyleClass('help-id-ActionModeBtn');}});}},_handleEditModeChange:function(){if(this.oTileActionsButton){this.oTileActionsButton.toggleStyleClass('sapUshellAcionItemActive');}},_enablePreviewNotificationChanged:function(s,e,d){this.oModel.setProperty("/userEnableNotificationsPreview",d.bPreviewEnabled);},_enableAnchorBarOverflowAndCreateFooter:function(s,e,d){if(this.oDoneBtn){return;}this.oAnchorNavigationBar.setOverflowEnabled(true);if(!this.oButtonLabelledBy){this.oButtonLabelledBy=new I({text:r.i18n.getText("closeEditMode")});this.oButtonLabelledBy.toStatic();}this.oDoneBtn=new b('sapUshellDashboardFooterDoneBtn',{type:m.ButtonType.Emphasized,text:r.i18n.getText("closeEditMode"),ariaLabelledBy:this.oButtonLabelledBy.getId(),press:function(){q("#sapUshellDashboardPage .sapUshellAnchorNavigationBarSqueezed").toggleClass("sapUshellAnchorBarEditMode");var f=this.oDashboardGroupsBox.getGroups();sap.ushell.components.homepage.ActionMode.toggleActionMode(this.oModel,"Menu Item",f);this.oAnchorNavigationBar.updateVisibility();if(this.oModel.getProperty("/homePageGroupDisplay")&&this.oModel.getProperty("/homePageGroupDisplay")==="tabs"){this.getController()._deactivateActionModeInTabsState();}}.bind(this)});this.oDoneBtn.addEventDelegate({onsapskipforward:function(o){o.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(o);},onsapskipback:function(o){o.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.homepage.ComponentKeysHandler.goToFirstVisibleTileContainer();},onsaptabprevious:function(o){o.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.homepage.ComponentKeysHandler.goToFirstVisibleTileContainer();},onsaptabnext:function(o){o.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(o);}});this.oFooter.addContentRight(this.oDoneBtn);},_previewNotificationEnabled:function(){var d=this.oModel.getProperty("/configEnableNotificationsPreview"),U=this.oModel.getProperty("/userEnableNotificationsPreview");return(d&&U);},_createActionButtons:function(){var e=this.oModel.getProperty("/personalization");if(e){if(this.oModel.getProperty("/enableActionModeMenuButton")){this._createActionModeMenuButton();}}},onAfterNavigate:function(e){var R=sap.ushell.Container.getRenderer&&sap.ushell.Container.getRenderer("fiori2"),i=R&&R.getCurrentCoreView()==="home",d=sap.ui.getCore().byId("ActionModeBtn");if(d){if(d.data){if(d.data("isShellHeader")){d.setVisible(true);}}}if(R&&R.toggleOverFlowActions){R.toggleOverFlowActions();}if(i&&R){u.refreshTiles();R.createExtendedShellState("dashboardExtendedShellState",function(){this._createActionButtons();if(!c.system.phone){R.showRightFloatingContainer(false);}}.bind(this));this.getController()._setCenterViewPortShift();this._addActionModeButtonsToDashboard();setTimeout(function(){if(sap.ushell.Container&&R){R.applyExtendedShellState("dashboardExtendedShellState");}},0);if(document.activeElement&&document.activeElement.tagName==="BODY"){sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell();}}},_handleContentRendered:function(e){if(!this.isContentWasRendered&&e.groups>-1){this.isContentWasRendered=true;this._onAfterDashboardShow(e);u.setPerformanceMark("FLP-TTI-Homepage-old",{bUseUniqueMark:true});u.setPerformanceMeasure("FLP-TTI-Hompage-old");}else{this._onAfterDashboardShow(e);}},_focusOnDomElement:function(d){if(d){setTimeout(function(){d.focus();},0);}},_onAfterDashboardShow:function(e){if(!this.isContentWasRendered){this._focusOnDomElement(q("#configBtn"));return;}var j=q('.sapUshellTileContainer:visible'),v=sap.ui.getCore().byId('viewPortContainer'),i=sap.ushell.Container.getRenderer("fiori2").getCurrentCoreView()==="home",t=this.oModel.getProperty('/tileActionModeActive'),p;if(i){if(!t){u.handleTilesVisibility();var d=this.oModel.getProperty('/topGroupInViewPortIndex'),f=q(j[d]),g=j.find("li[class*='sapUshellTile']li[tabindex=0]"),h=f.find('.sapUshellTile:first'),k;if(g.length){k=g;}else if(h.length){k=h;}else{k=q("#configBtn");}p=this.oModel.getProperty('/enableNotificationsPreview');if(v){v.shiftCenterTransition(p);}this._focusOnDomElement(k);}this.onAfterNavigate();}},getControllerName:function(){return"sap.ushell.components.homepage.DashboardContent";},_isInDeashboard:function(){var n=sap.ui.getCore().byId("viewPortContainer"),o=sap.ui.getCore().byId("dashboardGroups");return((n.getCurrentCenterPage()==="application-Shell-home")&&(o.getModel().getProperty("/currentViewName")==="home"));},exit:function(){if(this.oAnchorNavigationBar){this.oAnchorNavigationBar.handleExit();this.oAnchorNavigationBar.destroy();}if(this.oTileActionsButton){this.oTileActionsButton.destroy();}V.prototype.exit.apply(this,arguments);if(this.aDoableObjects){this.aDoableObjects.forEach(function(d){d.off();});}sap.ui.getCore().getEventBus().unsubscribe("launchpad","initialConfigurationSet",this._onAfterDashboardShow,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad",'actionModeInactive',this._handleEditModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad",'actionModeActive',this._handleEditModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("shell","notificationsPreviewContainerCreated",this._notificationsPreviewContainerCreated,this);sap.ui.getCore().getEventBus().unsubscribe("shell","setPlaceForNotificationsPreview",this._setPlaceForNotificationsPreview,this);}});},false);
