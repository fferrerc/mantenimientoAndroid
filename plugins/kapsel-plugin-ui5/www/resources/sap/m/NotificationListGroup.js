/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','./NotificationListBase','sap/ui/core/InvisibleText','./ListItemBase','sap/ui/core/IconPool','sap/ui/core/library','sap/ui/Device','sap/m/Button','jquery.sap.keycodes'],function(q,l,N,I,L,a,c,D,B){'use strict';var P=c.Priority;var b=l.ButtonType;var d=N.extend('sap.m.NotificationListGroup',{metadata:{library:'sap.m',properties:{collapsed:{type:'boolean',group:'Behavior',defaultValue:false},autoPriority:{type:'boolean',group:'Behavior',defaultValue:true},showEmptyGroup:{type:'boolean',group:'Behavior',defaultValue:false},enableCollapseButtonWhenEmpty:{type:'boolean',group:'Behavior',defaultValue:false}},defaultAggregation:'items',aggregations:{items:{type:'sap.m.NotificationListItem',multiple:true,singularName:'item'},_ariaDetailsText:{type:'sap.ui.core.InvisibleText',multiple:false,visibility:'hidden'}},events:{onCollapse:{parameters:{collapsed:{type:'boolean'}}}}}});d.prototype.init=function(){N.prototype.init.call(this);var r=sap.ui.getCore().getLibraryResourceBundle('sap.m');this._closeText=r.getText('NOTIFICATION_LIST_BASE_CLOSE');var _=new B(this.getId()+'-closeButton',{type:b.Transparent,icon:a.getIconURI('decline'),tooltip:this._closeText,press:function(){this.close();}.bind(this)});this.setAggregation('_closeButton',_,true);var f=new B({type:b.Transparent,press:function(){this.setCollapsed(!this.getCollapsed());}.bind(this)});this.setAggregation('_collapseButton',f,true);this._maxNumberReached=false;this._ariaLabbeledByIds='';this.setAggregation('_ariaDetailsText',new I());this._resourceBundle=sap.ui.getCore().getLibraryResourceBundle('sap.m');};d.prototype.setCollapsed=function(f){this._toggleCollapsed();this.setProperty('collapsed',f,true);this.fireOnCollapse({collapsed:f});return this;};d.prototype.getPriority=function(){if(!this.getAutoPriority()){return this.getProperty('priority');}var n=this.getAggregation('items');var p=P.None;if(n){n.forEach(function(i){p=e(p,i.getPriority());});}else{p=this.getProperty('priority');}return p;};d.prototype.getUnread=function(){var n=this.getItems();if(n.length){return n.some(function(i){return i.getUnread();});}return this.getProperty('unread');};d.prototype.onBeforeRendering=function(){var n=this.getItems();var f=n.length;var g=this.getAggregation('_collapseButton');this._maxNumberOfNotifications=D.system.desktop?400:100;g.setEnabled(this._getCollapseButtonEnabled(),true);this._maxNumberReached=f>this._maxNumberOfNotifications;n.forEach(function(i){i.addEventDelegate({onfocusin:this._notificationFocusHandler},this);i.addEventDelegate({onkeydown:this._notificationNavigationHandler},this);}.bind(this));this._updateAccessibilityInfo();this._updateCollapseButtonText(this.getCollapsed());this._maxNumberOfNotificationsTitle=this._resourceBundle.getText('NOTIFICATION_LIST_GROUP_MAX_NOTIFICATIONS_TITLE',f-this._maxNumberOfNotifications);this._maxNumberOfNotificationsBody=this._resourceBundle.getText('NOTIFICATION_LIST_GROUP_MAX_NOTIFICATIONS_BODY');};d.prototype.clone=function(){return N.prototype.clone.apply(this,arguments);};d.prototype._getHeaderTitle=function(){var t=N.prototype._getHeaderTitle.call(this);t.addStyleClass('sapMNLG-Title');if(this.getUnread()){t.addStyleClass('sapMNLGTitleUnread');}return t;};d.prototype._getDateTimeText=function(){var f=N.prototype._getDateTimeText.call(this);f.setTextAlign('End');return f;};d.prototype._toggleCollapsed=function(){var n=!this.getCollapsed();this._updateCollapseButtonText(n);this.$().toggleClass('sapMNLG-Collapsed',n);this.$().toggleClass('sapMNLG-NoNotifications',this._getVisibleItemsCount()<=0);};d.prototype._getVisibleItemsCount=function(){var i=this.getItems();var r=0;i.forEach(function(f){if(f.getVisible()){r+=1;}});return r;};d.prototype._getCollapseButtonEnabled=function(){if(this._getVisibleItemsCount()>0){return true;}return this.getEnableCollapseButtonWhenEmpty();};d.prototype._notificationFocusHandler=function(f){L.prototype.onfocusin.call(this,f);var t=f.srcControl;if(t.getMetadata().getName()!='sap.m.NotificationListItem'){return;}var n=t.getParent();var g=n.indexOfItem(t);var h=t.getDomRef();h.setAttribute('aria-posinset',g+1);h.setAttribute('aria-setsize',n.getItems().length);};d.prototype._notificationNavigationHandler=function(f){L.prototype.onkeydown.call(this,f);var t=f.srcControl;if(t.getMetadata().getName()!='sap.m.NotificationListItem'){return;}var n=t.getParent();var g=n.indexOfItem(t);switch(f.which){case q.sap.KeyCodes.ARROW_UP:if(g==0){return;}var p=g-1;n.getItems()[p].focus();break;case q.sap.KeyCodes.ARROW_DOWN:var h=g+1;if(h==n.getItems().length){return;}n.getItems()[h].focus();break;default:return;}};d.prototype._updateAccessibilityInfo=function(){var f=this.getAuthorName();var i=this._resourceBundle.getText('NOTIFICATION_LIST_ITEM_DATETIME_PRIORITY',[this.getDatetime(),this.getPriority()]);var u=this.getUnread()?this._resourceBundle.getText('NOTIFICATION_LIST_GROUP_UNREAD'):this._resourceBundle.getText('NOTIFICATION_LIST_GROUP_READ');var g='';var h=this.getAggregation('_ariaDetailsText');if(f){g+=this._resourceBundle.getText('NOTIFICATION_LIST_ITEM_CREATED_BY')+' '+f+' ';}g+=i+' '+u;h.setText(g);this._ariaLabbeledByIds=this._getHeaderTitle().getId()+' '+h.getId();};d.prototype._updateCollapseButtonText=function(f){var g=f?this._resourceBundle.getText('NOTIFICATION_LIST_GROUP_EXPAND'):this._resourceBundle.getText('NOTIFICATION_LIST_GROUP_COLLAPSE');this.getAggregation('_collapseButton').setText(g,true);};function e(f,s){if(f==s){return f;}if((f=='None')){return s;}if((f=='Low')&&(s!='None')){return s;}if((f=='Medium')&&(s!='None'&&s!='Low')){return s;}return f;}return d;});
