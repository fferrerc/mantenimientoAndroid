// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['jquery.sap.global','./DashboardUIActions','sap/ushell/utils','sap/ushell/EventHub','sap/ui/Device','sap/ushell/components/homepage/ComponentKeysHandler'],function(q,D,u,E,a,C){"use strict";sap.ui.controller("sap.ushell.components.homepage.DashboardContent",{onInit:function(){var e=sap.ui.getCore().getEventBus();this.isActionModeInited=false;this.handleDashboardScroll=this._handleDashboardScroll.bind(this);e.subscribe("sap.ushell","appClosed",this._resizeHandler,this);e.subscribe("sap.ushell","appOpened",this._appOpenedHandler,this);e.subscribe("launchpad","dashboardModelContentLoaded",this._modelLoaded,this);e.subscribe('launchpad','actionModeInactive',this._handleGroupVisibilityChanges,this);e.subscribe("launchpad",'animationModeChange',this._handleAnimationModeChange,this);e.subscribe("launchpad",'switchTabBarItem',this._handleTabBarItemPressEventHandler,this);window.document.addEventListener("visibilitychange",u.handleTilesVisibility,false);this.sViewId="#"+this.oView.getId();if(a.browser.mobile){e.subscribe("launchpad","contentRefresh",this._webkitMobileRenderFix,this);}this.isDesktop=(a.system.desktop&&(navigator.userAgent.toLowerCase().indexOf('tablet')<0));this._setCenterViewPortShift();},onExit:function(){var e=sap.ui.getCore().getEventBus();e.unsubscribe("launchpad","contentRefresh",this._webkitMobileRenderFix,this);e.unsubscribe("sap.ushell","appClosed",this._resizeHandler,this);e.unsubscribe("sap.ushell","appOpened",this._appOpenedHandler,this);e.unsubscribe("launchpad","dashboardModelContentLoaded",this._modelLoaded,this);e.unsubscribe("launchpad",'switchTabBarItem',this._handleTabBarItemPressEventHandler,this);window.document.removeEventListener("visibilitychange",u.handleTilesVisibility,false);},onAfterRendering:function(){u.setPerformanceMark("FLP - dashboard after rendering");var e=sap.ui.getCore().getEventBus(),m,t,g,i,b;e.unsubscribe("launchpad","scrollToGroup",this._scrollToGroup,this);e.unsubscribe("launchpad","scrollToGroupByName",this._scrollToGroupByName,this);e.subscribe("launchpad","scrollToGroup",this._scrollToGroup,this);e.subscribe("launchpad","scrollToGroupByName",this._scrollToGroupByName,this);e.unsubscribe("launchpad","scrollToFirstVisibleGroup",this._scrollToFirstVisibleGroup,this);e.subscribe("launchpad","scrollToFirstVisibleGroup",this._scrollToFirstVisibleGroup,this);a.orientation.attachHandler(function(){var j=q('#dashboardGroups').find('.sapUshellTileContainer:visible');if(j.length){m=this.getView().getModel();t=m.getProperty('/topGroupInViewPortIndex');if(j.get(t)){g=sap.ui.getCore().byId(j.get(t).id);i=m.getProperty('/editTitle');this._publishAsync("launchpad","scrollToGroup",{group:g,isInEditTitle:i});}}},this);q(window).bind("resize",function(){clearTimeout(b);b=setTimeout(this._resizeHandler.bind(this),300);}.bind(this));if(this.getView().getModel().getProperty("/personalization")&&!this.isActionModeInited){sap.ui.require(["sap/ushell/components/homepage/ActionMode"],function(A){A.init(this.getView().getModel());}.bind(this));this.isActionModeInited=true;}this._updateTopGroupInModel();},_setCenterViewPortShift:function(){var v=sap.ui.getCore().byId("viewPortContainer");if(v){v.shiftCenterTransition(true);}},_dashboardDeleteTileHandler:function(e){var t=e.getSource(),T=t.getBindingContext().getObject().object,d={originalTileId:sap.ushell.Container.getService("LaunchPage").getTileId(T)};sap.ui.getCore().getEventBus().publish("launchpad","deleteTile",d,this);},dashboardTilePress:function(e){var t=e.getSource();if(!t){return;}var s=document.activeElement.id.indexOf("feedTile")!==-1;if(document.activeElement.tagName!=="INPUT"&&s!==true){if(sap.ui.getCore().byId(t.getId())){C.setTileFocus(t.$());}}sap.ui.getCore().getEventBus().publish("launchpad","dashboardTileClick",{uuid:t.getUuid()});},_updateTopGroupInModel:function(){var m=this.getView().getModel(),t=this._getIndexOfTopGroupInViewPort();var s=this._getModelGroupFromVisibleIndex(t);m.setProperty('/iSelectedGroup',s);m.setProperty('/topGroupInViewPortIndex',t);},_getIndexOfTopGroupInViewPort:function(){var v=this.getView(),d=v.getDomRef(),s=d.getElementsByTagName('section'),j=q(s).find('.sapUshellTileContainer'),o=j.not('.sapUshellHidden').first().offset(),f=(o&&o.top)||0,t=[],n=s[0].scrollTop,b=0;if(!j||!o){return b;}j.each(function(){if(!q(this).hasClass("sapUshellHidden")){var e=q(this).parent().offset().top;t.push([e,e+q(this).parent().height()]);}});var c=n+f;q.each(t,function(i,e){var g=e[0],h=e[1];if(g-24<=c&&c<=h){b=i;return false;}});return b;},_handleDashboardScroll:function(){var v=this.getView(),m=v.getModel(),n=400;var h=m.getProperty("/homePageGroupDisplay"),e=h!=="tabs",t=m.getProperty("/tileActionModeActive");function H(){u.handleTilesVisibility();}clearTimeout(this.timeoutId);this.timeoutId=setTimeout(H,n);if(!a.system.phone){v.oAnchorNavigationBar.closeOverflowPopup();}if(e||t){this._updateTopGroupInModel();}v.oAnchorNavigationBar.reArrangeNavigationBarElements();},_handleGroupDeletion:function(g){var e=sap.ui.getCore().getEventBus(),G=g.getObject(),i=G.removable,s=G.title,b=G.groupId,r=sap.ushell.resources.i18n,m=sap.ushell.Container.getService("Message"),A,c,v=this.getView();sap.ui.require(['sap/m/MessageBox'],function(M){A=M.Action;c=(i?A.DELETE:r.getText('ResetGroupBtn'));m.confirm(r.getText(i?'delete_group_msg':'reset_group_msg',s),function(o){if(o===c){e.publish("launchpad",i?'deleteGroup':'resetGroup',{groupId:b});}},r.getText(i?'delete_group':'reset_group'),[c,A.CANCEL]);v.oAnchorNavigationBar.updateVisibility();});},_modelLoaded:function(){this.bModelInitialized=true;sap.ushell.Layout.getInitPromise().then(function(){this._initializeUIActions();}.bind(this));},_initializeUIActions:function(){this.oDashboardUIActionsModule=new D();this.oDashboardUIActionsModule.initializeUIActions(this);},_forceBrowserRerenderElement:function(e){var b=window.requestAnimationFrame||window.webkitRequestAnimationFrame;if(b){b(function(){var d=e.style.display;e.style.display='none';e.style.display=d;});}else{q.sap.log.info('unsupported browser for animation frame');}},_webkitMobileRenderFix:function(){if(a.browser.chrome||a.os.android){this._forceBrowserRerenderElement(document.body);}},_resizeHandler:function(){this._addBottomSpace();u.handleTilesVisibility();var i=q.find("#dashboardGroups:visible").length;if(E.last("AppRendered")!=undefined){E.emit("AppRendered",undefined);}if(sap.ushell.Layout&&i){sap.ushell.Layout.reRenderGroupsLayout(null);this._initializeUIActions();}},_handleAnimationModeChange:function(c,e,d){var m=this.getView().getModel();m.setProperty('/animationMode',d.sAnimationMode);},_appOpenedHandler:function(c,e,d){var v,p,P,m=this.getView().getModel();p=this.getOwnerComponent();P=p.getMetadata().getComponentName();if(d.additionalInformation.indexOf(P)===-1){u.setTilesNoVisibility();v=sap.ui.getCore().byId("viewPortContainer");if(v){v.shiftCenterTransition(false);}}if(sap.ushell.components.homepage.ActionMode&&sap.ushell.components.homepage.ActionMode.oModel&&sap.ushell.components.homepage.ActionMode.oModel.getProperty("/tileActionModeActive")){sap.ushell.components.homepage.ActionMode.toggleActionMode(m,"Menu Item");}if(this.oDashboardUIActionsModule){this.oDashboardUIActionsModule.disableAllDashboardUiAction();}},_addBottomSpace:function(){u.addBottomSpace();},_scrollToFirstVisibleGroup:function(c,e,d){var g,v=this.oView.oDashboardGroupsBox.getGroups(),f=d.fromTop>0?d.fromTop:0;if(d.group){g=d.group.getGroupId();}else{g=d.groupId;}if(v){q.each(v,function(n,G){if(G.getGroupId()===g){var y=document.getElementById(G.sId).offsetTop;q('.sapUshellDashboardView section').stop().animate({scrollTop:y+f},0);C.setTileFocus(q("#"+G.getId()+" li").first());return false;}});u.addBottomSpace();}},_scrollToGroupByName:function(c,e,d){var g=this.getView().getModel().getProperty("/groups"),G=d.groupName,l=sap.ushell.Container.getService('LaunchPage');q.each(g,function(n,o){if(l.getGroupTitle(o.object)===G){this._scrollToGroup(c,e,{groupId:o.groupId});}}.bind(this));},_scrollToGroup:function(c,e,d,i){var g,i=d.iDuration==undefined?500:d.iDuration,v=this.getView(),m=v.getModel(),M=m.getProperty('/animationMode')==='minimal',t=this;if(M){i=0;}if(d.group){g=d.group.getGroupId();}else{g=d.groupId;}t.iAnimationDuration=i;if(this.oView.oDashboardGroupsBox.getGroups()){q.each(this.oView.oDashboardGroupsBox.getGroups(),function(n,G){if(G.getGroupId()===g){var y;setTimeout(function(){y=-1*(document.getElementById('dashboardGroups').getBoundingClientRect().top)+document.getElementById(G.sId).getBoundingClientRect().top;var b=q(document.getElementById(G.sId)).find(".sapUshellTileContainerHeader").height();var f=q(document.getElementById(G.sId)).find(".sapUshellTileContainerBeforeContent").height();var I=G.getModel().getProperty('/tileActionModeActive');y=b>0&&!I?y+48:y+f+8;q('.sapUshellDashboardView section').stop().animate({scrollTop:y},t.iAnimationDuration,function(){if(d.groupChanged){if(!d.restoreLastFocusedTile){C.setTileFocus(q("#"+G.getId()+" li").first());}}if(d.restoreLastFocusedTile){var T="#"+G.getId();var l=false;if(d.restoreLastFocusedTileContainerById){T="#"+d.restoreLastFocusedTileContainerById;l=true;}C.goToLastVisitedTile(q(T),l);}});if(d.isInEditTitle){G.setEditMode(true);}},0);if(d.groupId||d.groupChanged){t._addBottomSpace();}u.handleTilesVisibility();return false;}});}},_handleDrop:function(e,b){var l=sap.ushell.Layout.getLayoutEngine(),t=l.layoutEndCallback(),i=!t.dstArea,o=sap.ui.getCore().getEventBus(),n,c,T,d=q.Deferred(),v=this.getView(),m=v.getModel(),f=m.getProperty('/homePageGroupDisplay')&&m.getProperty('/homePageGroupDisplay')==='tabs',g=m.getProperty('/tileActionModeActive'),I=true,h=!!(m.getProperty("/personalization")&&(a.browser.msie||a.browser.edge)&&a.browser.version>=11&&(a.system.combi||a.system.tablet)),p=sap.ushell.Container.getService("LaunchPage"),j=t.tile.getBindingContext().getObject().object,k=p.isLinkPersonalizationSupported(j);sap.ushell.Layout.getLayoutEngine()._toggleAnchorItemHighlighting(false);if(t.dstGroup){var r=t.dstGroup.getBindingContext(),s=r.getProperty(r.sPath).isGroupLocked;I=i&&s;}if(!t.tileMovedFlag||(h&&l.isTabBarCollision())||I||(!k&&t.dstArea==='links')){o.publish("launchpad","sortableStop");return null;}if(!g&&!f&&t.dstArea==="links"&&!t.dstGroupData.getLinks().length){o.publish("launchpad","sortableStop");return null;}n=true;c=true;if((t.srcGroup!==t.dstGroup)){n=c=false;}else if(t.tile!==t.dstGroup.getTiles()[t.dstTileIndex]){c=false;}T=this._getTileUuid(t.tile);if(t.srcGroup&&t.srcGroup.removeAggregation&&t.srcArea){t.srcGroup.removeAggregation('tiles',t.tile,n);}var S=t.dstGroupData&&t.dstGroupData.insertAggregation&&t.dstArea===t.srcArea;if(S){t.tile.sParentAggregationName=t.dstArea;t.dstGroupData.insertAggregation(t.dstArea,t.tile,t.dstTileIndex,c);this._showDropToastMessage(t);d=this._handleSameTypeDrop(t,T,S);}else{this._showDropToastMessage(t);if(i){d=this._handleShortDrop(t,T,S);}else{d=this._handleConvertDrop(t,S,b);}}if(this.getView().getModel()){this.getView().getModel().setProperty('/draggedTileLinkPersonalizationSupported',true);}o.publish("launchpad","sortableStop");return d.promise();},_showDropToastMessage:function(t){var T=this._getTileTitle(t),d=t.dstGroup.getHeaderText?t.dstGroup.getHeaderText():t.dstGroup.getTitle(),s=sap.ushell.resources.i18n.getText('added_tile_to_group'),b=T+' '+s+' '+d,c=t.dstGroupData.getGroupId?t.dstGroupData.getGroupId():t.dstGroupData.groupId,e=t.srcGroup.getGroupId?t.srcGroup.getGroupId():t.srcGroup.groupId;if(c!==e){sap.m.MessageToast.show(sap.ushell.resources.i18n.getText(b));}},_handleSameTypeDrop:function(t,T,s){var e=sap.ui.getCore().getEventBus(),d=q.Deferred();t.tile._getBindingContext().oModel.setProperty(t.tile._getBindingContext().sPath+'/draggedInTabBarToSourceGroup',false);e.publish("launchpad","movetile",{sTileId:T,sToItems:t.dstArea?t.dstArea:"tiles",sFromItems:t.srcArea?t.srcArea:"tiles",sTileType:t.dstArea?t.dstArea.substr(0,t.dstArea.length-1):undefined,toGroupId:t.dstGroupData.getGroupId?t.dstGroupData.getGroupId():t.dstGroupData.groupId,toIndex:t.dstTileIndex,longDrop:s,callBack:function(){d.resolve();}});return d.promise();},_handleShortDrop:function(t,T,s){var e=sap.ui.getCore().getEventBus(),d=q.Deferred();e.publish("launchpad","movetile",{sTileId:T,sToItems:t.srcArea||"tiles",sFromItems:t.srcArea||"tiles",sTileType:t.srcArea?t.srcArea.substr(0,t.srcArea.length-1):undefined,toGroupId:t.dstGroupData.getGroupId?t.dstGroupData.getGroupId():t.dstGroupData.groupId,toIndex:t.dstTileIndex,longDrop:s,callBack:function(){d.resolve();}});return d.promise();},_handleConvertDrop:function(t,s,b){var e=sap.ui.getCore().getEventBus(),d=q.Deferred();e.publish("launchpad","convertTile",{toGroupId:t.dstGroupData.getGroupId?t.dstGroupData.getGroupId():t.dstGroupData.groupId,toIndex:t.dstTileIndex,tile:sap.ui.getCore().byId(b.id),srcGroupId:t.srcGroup.getGroupId?t.srcGroup.getGroupId():t.srcGroup.groupId,longDrop:s,callBack:function(){d.resolve();}});return d.promise();},_getTileTitle:function(t){var m=this.getView().getModel(),b=t.tile.getBindingContext().getPath(),T=m.getProperty(b).object,s=sap.ushell.Container.getService('LaunchPage').getTileTitle(T);return s;},_getTileUuid:function(t){var T=t.getMode?t.getMode():'ContentMode',s;if(T==='LineMode'){s=t.getUuid?t.getUuid():t.getBindingContext().getObject().uuid;}else{s=t.getUuid?t.getUuid():t.getBindingContext().getObject().getParent().getUuid();}return s;},_handleDrag:function(e,b){var t=sap.ushell.Layout.getLayoutEngine().layoutEndCallback(),p=sap.ushell.Container.getService("LaunchPage"),T=t.tile.getBindingContext().getObject().object,i=p.isLinkPersonalizationSupported(T),v=this.getView(),m=v.getModel();if(m){m.setProperty('/draggedTileLinkPersonalizationSupported',i);}},_handleTabBarItemPressEventHandler:function(c,e,d){var v=this.getView(),m=v.getModel(),g=m.getProperty("/groups"),G=d.iGroupIndex;for(var i=0;i<g.length;i++){m.setProperty("/groups/"+i+"/isGroupSelected",false);}m.setProperty("/groups/"+G+"/isGroupSelected",true);this._handleTabBarItemPress(c,e,G);},_handleTabBarItemPress:function(c,e,g,o){var v=this.getView(),s,f;if(o){s=o.getParameter("group").getIndex();}else{s=g;}sap.ui.getCore().getEventBus().publish("launchpad","tabSelected",{iSelectedGroup:s});f=this._getVisibleGroupIndex(s);v.oDashboardGroupsBox.removeLinksFromUnselectedGroups();v.oDashboardGroupsBox.getBinding("groups").filter([v.oFilterSelectedGroup]);v.oAnchorNavigationBar.setSelectedItemIndex(f);v.oAnchorNavigationBar.reArrangeNavigationBarElements();setTimeout(function(){u.handleTilesVisibility();},0);},_getVisibleGroupIndex:function(s){var g=this.getView().getModel().getProperty("/groups");var h=0;for(var i=0;i<s;i++){if(!g[i].isGroupVisible||!g[i].visibilityModes[0]){h++;}}return s-h;},_getModelGroupFromVisibleIndex:function(s){var g=this.getView().getModel().getProperty("/groups"),v=0;for(var i=0;i<g.length;i++){if(g[i].isGroupVisible&&g[i].visibilityModes[0]){v++;if(v>s){return i;}}}return 0;},_handleAnchorItemPress:function(e){var v=this.getView(),m=v.getModel(),g=m.getProperty("/groups");if(a.system.phone&&e.getParameter("manualPress")){e.oSource.openOverflowPopup();}for(var i=0;i<g.length;i++){if(m.getProperty("/groups/"+i+"/isGroupSelected")===true){m.setProperty("/groups/"+i+"/isGroupSelected",false);}}m.setProperty("/groups/"+e.getParameter("group").getIndex()+"/isGroupSelected",true);m.setProperty("/iSelectedGroup",e.getParameter("group").getIndex());if(m.getProperty("/homePageGroupDisplay")&&m.getProperty("/homePageGroupDisplay")==="tabs"&&!m.getProperty("/tileActionModeActive")){this._handleTabBarItemPress(undefined,undefined,undefined,e);}else{if(!m.getProperty("/tileActionModeActive")){v.oDashboardGroupsBox.getBinding("groups").filter([new sap.ui.model.Filter("isGroupVisible",sap.ui.model.FilterOperator.EQ,true)]);}else{v.oDashboardGroupsBox.getBinding("groups").filter([]);}this._scrollToGroup("launchpad","scrollToGroup",{group:e.getParameter('group'),groupChanged:true,focus:(e.getParameter("action")==="sapenter")});}},_addGroupHandler:function(d){var i,p=d.getSource().getBindingContext().getPath(),b=p.split("/");i=window.parseInt(b[b.length-1],10);if(d.getSource().sParentAggregationName==="afterContent"){i=i+1;}sap.ui.getCore().getEventBus().publish("launchpad","createGroupAt",{title:"",location:i,isRendered:true});},_publishAsync:function(c,e,d){var b=sap.ui.getCore().getEventBus();window.setTimeout(q.proxy(b.publish,b,c,e,d),1);},_changeGroupVisibility:function(g){var b=g.getPath(),m=g.getModel(),G=m.getProperty(b+'/isGroupVisible'),v=this.getView();m.setProperty(b+'/isGroupVisible',!G);v.oAnchorNavigationBar.updateVisibility();},_handleGroupVisibilityChanges:function(c,e,o){var l=sap.ushell.Container.getService('LaunchPage'),m=this.getView().getModel(),b=u.getCurrentHiddenGroupIds(m),s=b.length===o.length,i=s,p;b.some(function(h,I){if(!i){return true;}i=q.inArray(h,o)!==-1;return!i;});if(!i){p=l.hideGroups(b);p.done(function(){m.updateBindings('groups');}.bind(this));p.fail(function(){var d=sap.ushell.Container.getService('Message');d.error(sap.ushell.resources.i18n.getText('hideGroups_error'));});}},_updateShellHeader:function(){if(!this.oShellUIService){this._initializeShellUIService();}else{this.oShellUIService.setTitle();this.oShellUIService.setHierarchy();}},_initializeShellUIService:function(){return sap.ui.require(["sap/ushell/ui5service/ShellUIService"],function(S){this.oShellUIService=new S({scopeObject:this.getOwnerComponent(),scopeType:"component"});this.oShellUIService.setTitle();this.oShellUIService.setHierarchy();return this.oShellUIService;}.bind(this));},_deactivateActionModeInTabsState:function(){var v=this.getView(),m=v.getModel();var g=m.getProperty("/groups");for(var i=0;i<g.length;i++){m.setProperty("/groups/"+i+"/isGroupSelected",false);}var s=v.oAnchorNavigationBar.getSelectedItemIndex();var h=0;if(!this._isGroupVisible(s)){for(var i=0;i<g.length;i++){if(!this._isGroupVisible(i)){h++;}else{s=i;break;}}}else{for(var i=0;i<s;i++){if(!this._isGroupVisible(i)){h++;}}}var f=s-h;v.oAnchorNavigationBar.adjustItemSelection(f);v.oAnchorNavigationBar.setSelectedItemIndex(f);m.setProperty("/groups/"+s+"/isGroupSelected",true);v.oDashboardGroupsBox.removeLinksFromAllGroups();var G=m.getProperty('/homePageGroupDisplay');if(G&&G==="tabs"){v.oDashboardGroupsBox.getBinding("groups").filter([v.oFilterSelectedGroup]);}},_isGroupVisible:function(g){var G=this.getView().getModel().getProperty("/groups");return(G[g].isGroupVisible&&G[g].visibilityModes[0]);}});},false);