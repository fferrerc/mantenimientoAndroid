// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Layout","sap/ui/base/Object","sap/ushell/ui/launchpad/DashboardGroupsContainer","sap/ushell/EventHub","sap/ushell/Config","sap/ui/core/Component"],function(L,b,D,E,C,a){"use strict";var c=b.extend("sap.ushell.components.homepage.DashboardGroupsBox",{metadata:{publicMethods:["createGroupsBox"]},constructor:function(i,s){if(sap.ushell.components.homepage.getDashboardGroupsBox&&sap.ushell.components.homepage.getDashboardGroupsBox()){return sap.ushell.components.homepage.getDashboardGroupsBox();}sap.ushell.components.homepage.getDashboardGroupsBox=jQuery.sap.getter(this.getInterface());this.oController=undefined;this.oGroupsContainer=undefined;this.bTileContainersContentAdded=false;this.isLinkPersonalizationSupported=sap.ushell.Container.getService("LaunchPage").isLinkPersonalizationSupported();sap.ui.getCore().getEventBus().subscribe("launchpad","actionModeActive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().subscribe("launchpad","actionModeInactive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().subscribe("launchpad","GroupHeaderVisibility",this._updateGroupHeaderVisibility,this);},destroy:function(){sap.ui.getCore().getEventBus().unsubscribe("launchpad","actionModeActive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad","actionModeInactive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad","GroupHeaderVisibility",this._updateGroupHeaderVisibility,this);sap.ushell.components.homepage.getDashboardGroupsBox=undefined;},calculateFilter:function(){var f=[];var F;var g=this.oModel.getProperty('/homePageGroupDisplay'),e=this.oModel.getProperty("/tileActionModeActive");if(!e){if(g&&g==="tabs"){F=new sap.ui.model.Filter("isGroupSelected",sap.ui.model.FilterOperator.EQ,true);}else{F=new sap.ui.model.Filter("isGroupVisible",sap.ui.model.FilterOperator.EQ,true);}f.push(F);}return f;},createGroupsBox:function(o,m){this.oController=o;var t=this,A,g,T=this._getTileContainerTemplate(o,m),e=function(){return t.oModel.getProperty('/enableLockedGroupsCompactLayout')&&!t.oModel.getProperty('/tileActionModeActive');},d=function(G){var h,p;if(G&&(h=G.getDomRef())){p=h.querySelector('.sapUshellPlusTile');if(p){return p;}}return null;},r=function(l){var p=d(l.currentGroup),h=d(l.endGroup),i=(l.tiles[l.tiles.length-2]===l.item)||(l.endGroup.getTiles().length===0);if(i){t._hidePlusTile(h);}else{t._showPlusTile(h);}if(l.currentGroup!==l.endGroup){t._showPlusTile(p);}};A=function(){L.getLayoutEngine().setExcludedControl(sap.ushell.ui.launchpad.PlusTile);L.getLayoutEngine().setReorderTilesCallback.call(L.layoutEngine,r);};g=function(){if(!L.isInited){L.init({getGroups:this.getGroups.bind(this),getAllGroups:t.getAllGroupsFromModel.bind(t),isTabBarActive:t.isTabBarActive.bind(t),isLockedGroupsCompactLayoutEnabled:e,animationsEnabled:(t.oModel.getProperty('/animationMode')==='full')}).done(A);sap.ui.Device.media.attachHandler(function(){if(!this.bIsDestroyed){L.reRenderGroupsLayout(null);}},this,sap.ui.Device.media.RANGESETS.SAP_STANDARD);var h=this.getDomRef();o.getView().sDashboardGroupsWrapperId=!jQuery.isEmptyObject(h)&&h.parentNode?h.parentNode.id:'';}L.reRenderGroupsLayout(null);if(this.getGroups().length){if(o.bModelInitialized){o._initializeUIActions();}o._addBottomSpace();if(this.getModel().getProperty("/enableTilesOpacity")){sap.ushell.utils.handleTilesOpacity(this.getModel());}}E.emit("CenterViewPointContentRendered",{"groups":this.getGroups().length});sap.ui.getCore().getEventBus().publish("launchpad","contentRendered");sap.ui.getCore().getEventBus().publish("launchpad","contentRefresh");this.getBinding("groups").filter(t.calculateFilter());};this.isTabBarActive=function(){return this.oModel.getProperty("/homePageGroupDisplay")==="tabs";};this.oModel=m;var f=this.calculateFilter();this.oGroupsContainer=new D("dashboardGroups",{accessibilityLabel:sap.ushell.resources.i18n.getText("DashboardGroups_label"),groups:{filters:f,path:"/groups",template:T},displayMode:"{/homePageGroupDisplay}",afterRendering:g});this.oGroupsContainer.addEventDelegate({onsapskipback:function(h){h.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);var j=jQuery(".sapUshellAnchorItem:visible:first");if(!j.length){sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(h);}else{sap.ushell.components.homepage.ComponentKeysHandler.goToSelectedAnchorNavigationItem();}},onsapskipforward:function(h){h.preventDefault();var i=jQuery("#sapUshellDashboardFooterDoneBtn:visible");if(i.length){i.focus();}else{if(jQuery("#sapUshellFloatingContainerWrapper:visible").length==1&&(h.originalEvent.srcElement.id)!=""){sap.ui.getCore().getEventBus().publish("launchpad","shellFloatingContainerIsAccessible");}else{sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(h);}}},onsaptabnext:function(h){if(t.oModel.getProperty("/tileActionModeActive")){var j=jQuery(document.activeElement).closest(".sapUshellTileContainerHeader");if(!j||j.length===0){h.preventDefault();var i=jQuery("#sapUshellDashboardFooterDoneBtn:visible");if(i.length){i.focus();}}else{var k=jQuery(document.activeElement).closest(".sapUshellTileContainer");var l=jQuery(document.activeElement).hasClass("sapUshellContainerTitle");var n=k.find('.sapUshellHeaderActionButton');var p=n&&n.length>0;var q=false;if(p){q=document.activeElement.id===n.last()[0].id;}if((l&&!p)||(q)){h.preventDefault();var H=k.find(".sapUshellTile:visible, sapUshellLink:visible").length>0;if(H){sap.ushell.components.homepage.ComponentKeysHandler.goToLastVisitedTile(k,true);}else{var i=jQuery("#sapUshellDashboardFooterDoneBtn:visible");if(i.length){i.focus();}else{if(jQuery("#sapUshellFloatingContainerWrapper:visible").length==1&&(h.originalEvent.srcElement.id)!=""){sap.ui.getCore().getEventBus().publish("launchpad","shellFloatingContainerIsAccessible");}else{sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(h);}}}}}}else{h.preventDefault();if(jQuery("#sapUshellFloatingContainerWrapper:visible").length==1&&(h.originalEvent.srcElement.id)!=""){sap.ui.getCore().getEventBus().publish("launchpad","shellFloatingContainerIsAccessible");}else{sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(h);}}},onsaptabprevious:function(h){sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);var j=jQuery(":focus");if(!t.oModel.getProperty("/tileActionModeActive")||j.hasClass("sapUshellTileContainerHeader")){h.preventDefault();var i=jQuery(".sapUshellAnchorItem:visible:first"),k=jQuery(".sapUshellAnchorItemOverFlow");if(!i.length){sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(h);}if(k.hasClass("sapUshellShellHidden")){sap.ushell.components.homepage.ComponentKeysHandler.goToSelectedAnchorNavigationItem();}else{k.find("button").focus();}}else if(t.oModel.getProperty("/tileActionModeActive")){var l=jQuery(document.activeElement);if(l.hasClass('sapUshellTile')){h.preventDefault();var n=l.closest(".sapUshellTileContainer");var p=n.find('.sapUshellHeaderActionButton:visible').last();if(p.length>0){p.focus();}else{n.find('.sapUshellContainerTitle').focus();}}}}});return this.oGroupsContainer;},getAllGroupsFromModel:function(){return this.oModel.getProperty("/groups");},_getTileContainerTemplate:function(o,m){var t=this,T=new sap.ushell.ui.launchpad.TileContainer({headerText:"{title}",showDragIndicator:{parts:['/tileActionModeActive','/enableDragIndicator'],formatter:function(i,d){return i&&d&&!this.getIsGroupLocked()&&!this.getDefaultGroup();}},showEmptyLinksArea:{parts:['/tileActionModeActive','links/length',"isGroupLocked",'/isInDrag','/homePageGroupDisplay'],formatter:function(d,n,i,I,A){if(n){return true;}else if(i){return false;}else{return d||I&&A==='tabs';}}},showMobileActions:{parts:['/tileActionModeActive'],formatter:function(i){return i&&!this.getDefaultGroup();}},showIcon:{parts:['/isInDrag','/tileActionModeActive'],formatter:function(i,I){return(this.getIsGroupLocked()&&(i||I));}},deluminate:{parts:['/isInDrag'],formatter:function(i){return this.getIsGroupLocked()&&i;}},transformationError:{parts:['/isInDrag','/draggedTileLinkPersonalizationSupported'],formatter:function(i,d){return i&&!d;}},showBackground:'{/tileActionModeActive}',tooltip:"{title}",tileActionModeActive:'{/tileActionModeActive}',ieHtml5DnD:o.getView().ieHtml5DnD,enableHelp:'{/enableHelp}',groupId:"{groupId}",defaultGroup:"{isDefaultGroup}",isLastGroup:"{isLastGroup}",isGroupLocked:"{isGroupLocked}",isGroupSelected:"{isGroupSelected}",showHeader:true,showGroupHeader:"{showGroupHeader}",homePageGroupDisplay:"{/homePageGroupDisplay}",editMode:"{editMode}",supportLinkPersonalization:this.isLinkPersonalizationSupported,titleChange:function(e){sap.ui.getCore().getEventBus().publish("launchpad","changeGroupTitle",{groupId:e.getSource().getGroupId(),newTitle:e.getParameter("newTitle")});},showEmptyLinksAreaPlaceHolder:{parts:['links/length','/isInDrag','/homePageGroupDisplay'],formatter:function(n,i,A){return i&&A==='tabs'&&!n;}},showPlaceholder:{parts:["/tileActionModeActive","tiles/length"],formatter:function(d){return d&&!this.getIsGroupLocked();}},visible:{parts:["/tileActionModeActive","isGroupVisible","visibilityModes"],formatter:function(d,i,v){if(!v[d?1:0]){return false;}return i||d;}},hidden:{parts:['/tileActionModeActive','isGroupVisible'],formatter:function(i,I){return i&&!I;}},links:this._getLinkTemplate(),tiles:this._getTileTemplate(),add:function(e){if(document.toDetail){document.toDetail();}a.getOwnerComponentFor(t.oController.getView().parentComponent).getRouter().navTo("appfinder",{"innerHash*":"catalog/"+JSON.stringify({targetGroup:encodeURIComponent(e.getSource().getBindingContext().sPath)})});}});return T;},_getLinkTemplate:function(){var f=new sap.ui.model.Filter("isTileIntentSupported",sap.ui.model.FilterOperator.EQ,true);if(!this.isLinkPersonalizationSupported){return{path:"links",templateShareable:true,template:new sap.ushell.ui.launchpad.LinkTileWrapper({uuid:"{uuid}",tileCatalogId:"{tileCatalogId}",target:"{target}",isLocked:"{isLocked}",tileActionModeActive:"{/tileActionModeActive}",animationRendered:false,debugInfo:"{debugInfo}",ieHtml5DnD:this.oController.getView().ieHtml5DnD,tileViews:{path:"content",factory:function(i,o){return o.getObject();}},afterRendering:function(e){var j=jQuery(this.getDomRef().getElementsByTagName("a"));j.attr("tabindex",-1);}}),filters:[f]};}else{return{path:"links",factory:function(i,o){var d=o.getObject().content[0];if(d&&d.bIsDestroyed){d=d.clone();o.getModel().setProperty(o.getPath()+"/content/0",d);}return d;},filters:[f]};}},_getTileTemplate:function(){var f=new sap.ui.model.Filter("isTileIntentSupported",sap.ui.model.FilterOperator.EQ,true);var t=new sap.ushell.ui.launchpad.Tile({"long":"{long}",isDraggedInTabBarToSourceGroup:"{draggedInTabBarToSourceGroup}",uuid:"{uuid}",tileCatalogId:"{tileCatalogId}",isCustomTile:"{isCustomTile}",target:"{target}",isLocked:"{isLocked}",navigationMode:"{navigationMode}",tileActionModeActive:"{/tileActionModeActive}",showActionsIcon:"{showActionsIcon}",rgba:"{rgba}",animationRendered:false,debugInfo:"{debugInfo}",ieHtml5DnD:this.oController.getView().ieHtml5DnD,tileViews:{path:"content",factory:function(i,o){return o.getObject();}},coverDivPress:function(e){if(!e.oSource.getBindingContext().getObject().tileIsBeingMoved){sap.ushell.components.homepage.ActionMode._openActionsMenu(e);}},showActions:function(e){sap.ushell.components.homepage.ActionMode._openActionsMenu(e);},deletePress:function(e){var T=e.getSource(),t=T.getBindingContext().getObject().object,d={originalTileId:sap.ushell.Container.getService("LaunchPage").getTileId(t)};sap.ui.getCore().getEventBus().publish("launchpad","deleteTile",d,this);},press:[this.oController.dashboardTilePress,this.oController]});var v=sap.ui.getCore().byId("viewPortContainer");t.addEventDelegate({onclick:function(e){jQuery.sap.measure.start("FLP:DashboardGroupsBox.onclick","Click on tile","FLP");jQuery.sap.measure.start("FLP:OpenApplicationonClick","Open Application","FLP");function d(){jQuery.sap.measure.end("FLP:DashboardGroupsBox.onclick");v.detachAfterNavigate(d);}v.attachAfterNavigate(d);}});return{path:"tiles",templateShareable:true,template:t,filters:[f]};},_updateGroupHeaderVisibility:function(A,B,g){this._updateFirstGroupHeaderVisibility(g.group.getModel().getProperty("/tileActionModeActive"),this.oModel.getProperty("/homePageGroupDisplay")!=="tabs");},_updateFirstGroupHeaderVisibility:function(I,e){var g=this.oGroupsContainer.getGroups(),f=undefined,v=0;for(var i=0;i<g.length;i++){if(g[i].getProperty("visible")){v++;if(f===undefined){f=i;}else{g[i].setShowGroupHeader(I||e);}}}if(f!==undefined){var G=this.oModel.getProperty('/homePageGroupDisplay'),V=I||(v==1&&e),F=g.length>1||G==="tabs";g[f].setShowGroupHeader(V,F);}},_handleActionModeChange:function(){var A=this.oModel.getProperty('/tileActionModeActive');if(A){this._addTileContainersContent();}else{L.reRenderGroupsLayout(null);}},_addTileContainersContent:function(){if(!this.bTileContainersContentAdded){var g=this.oGroupsContainer.getGroups();g.forEach(function(d,e){this._addTileContainerContent(e);}.bind(this));this.bTileContainersContentAdded=true;}},_addTileContainerContent:function(g){var G=this.oGroupsContainer.getGroups()[g],B;if(G){B=G.getBindingContext().getPath()+'/';G.addBeforeContent(this._getBeforeContent(this.oController,B));G.addAfterContent(this._getAfterContent(this.oController,B));sap.ui.require(["sap/ushell/ui/launchpad/GroupHeaderActions"],function(d){var h=new d({content:this._getHeaderActions(),tileActionModeActive:{parts:['/tileActionModeActive',B+'isDefaultGroup'],formatter:function(i,I){return i&&!I;}},isOverflow:'{/isPhoneWidth}'}).addStyleClass("sapUshellOverlayGroupActionPanel");G.addHeaderAction(h);}.bind(this));}},_handleAddGroupButtonPress:function(d){this.oController._addGroupHandler(d);if(this.bTileContainersContentAdded){var g=this.oGroupsContainer.getGroups(),i;for(i=0;i<g.length;i++){if(!g[i].getBeforeContent().length){this._addTileContainerContent(i);}}}},_getBeforeContent:function(o){var d=new sap.m.Button({icon:"sap-icon://add",text:sap.ushell.resources.i18n.getText("add_group_at"),visible:{parts:["/tileActionModeActive"],formatter:function(t){return(!this.getParent().getIsGroupLocked()&&!this.getParent().getDefaultGroup()&&t);}},enabled:{parts:["/editTitle"],formatter:function(i){return!i;}},press:[this._handleAddGroupButtonPress.bind(this)]}).addStyleClass("sapUshellAddGroupButton");d.addDelegate({onAfterRendering:function(){jQuery(".sapUshellAddGroupButton").attr("tabindex",-1);}});return d;},_getAfterContent:function(o){var d=new sap.m.Button({icon:"sap-icon://add",text:sap.ushell.resources.i18n.getText("add_group_at"),visible:{parts:["isLastGroup","/tileActionModeActive","/isInDrag"],formatter:function(i,t,e){return(i&&t);}},enabled:{parts:["/editTitle"],formatter:function(i){return!i;}},press:[this._handleAddGroupButtonPress.bind(this)]}).addStyleClass("sapUshellAddGroupButton");d.addDelegate({onAfterRendering:function(){jQuery(".sapUshellAddGroupButton").attr("tabindex",-1);}});return d;},_getHeaderActions:function(){var s=new sap.m.Button({text:{path:'isGroupVisible',formatter:function(i){if(sap.ui.Device.system.phone){this.setIcon(i?"sap-icon://hide":"sap-icon://show");}return sap.ushell.resources.i18n.getText(i?'HideGroupBtn':'ShowGroupBtn');}},visible:{parts:['/tileActionModeActive','/enableHideGroups','isGroupLocked','isDefaultGroup'],formatter:function(i,I,e,f){return i&&I&&!e&&!f;}},press:function(e){var S=e.getSource(),g=S.getBindingContext();this.oController._changeGroupVisibility(g);}.bind(this)}).addStyleClass("sapUshellHeaderActionButton");var d=new sap.m.Button({text:{path:'removable',formatter:function(i){if(sap.ui.Device.system.phone){if(i){this.setIcon("sap-icon://delete");}else{this.setIcon("sap-icon://refresh");}}return sap.ushell.resources.i18n.getText(i?'DeleteGroupBtn':'ResetGroupBtn');}},visible:{parts:['/tileActionModeActive','isDefaultGroup'],formatter:function(i,I){return i&&!I;}},enabled:{parts:["/editTitle"],formatter:function(i){return!i;}},press:function(e){var S=e.getSource(),g=S.getBindingContext();this.oController._handleGroupDeletion(g);}.bind(this)}).addStyleClass("sapUshellHeaderActionButton");return[s,d];},_hidePlusTile:function(p){if(p){p.className+=" sapUshellHidePlusTile";}},_showPlusTile:function(p){if(p){p.className=p.className.split(' '+'sapUshellHidePlusTile').join('');}}});return c;});
