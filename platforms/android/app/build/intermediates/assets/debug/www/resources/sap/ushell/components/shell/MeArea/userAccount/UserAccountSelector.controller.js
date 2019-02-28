// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/ui5service/UserStatus','sap/ushell/ui/launchpad/AccessibilityCustomData'],function(U,A){"use strict";sap.ui.controller("sap.ushell.components.shell.MeArea.userAccount.UserAccountSelector",{onInit:function(){var t=this;var s=sap.ushell.Container.getRenderer("fiori2").getShellController();var S=s.getView();this.oShellConfig=(S.getViewData()?S.getViewData().config:{})||{};this.imgConsentEnabled=this.oShellConfig.enableUserImgConsent?this.oShellConfig.enableUserImgConsent:false;this.userStatusEnabled=this.oShellConfig.enableOnlineStatus&&U.prototype.isEnabled;this.userStatusEnabled=this.userStatusEnabled?this.userStatusEnabled:false;if(this.imgConsentEnabled){try{this.userInfoService=sap.ushell.Container.getService("UserInfo");this.oUser=this.userInfoService.getUser();}catch(e){jQuery.sap.log.error("Getting UserInfo service failed.");this.oUser=sap.ushell.Container.getUser();}this.currentUserImgConsent=this.oUser.getImageConsent();this.origUserImgConsent=this.currentUserImgConsent;this.addImgConsentEnableSwitch(this.currentUserImgConsent);}if(this.userStatusEnabled){if(this.isServiceEnable()){this.originalEnableStatus=null;this.originalUserStatus=null;var o=sap.ui.core.service.ServiceFactoryRegistry.get("sap.ushell.ui5service.UserStatus");var a=o.createInstance();a.then(function(o){t.oUserStatusService=o;var p=t._getUserStatusSetting();p.then(function(u){var b=u&&u.userStatusEnabled?u.userStatusEnabled:false;var d=u&&u.userStatusDefault?u.userStatusDefault:undefined;this.originalEnableStatus=b;this.originalUserStatus=d;t.userStatusButton=t._getOnlineStatusPopOver(this.originalUserStatus);t.addUserStatusDropdown();t.addUserEnableSwitch(b);}.bind(t));},function(E){});}}},getContent:function(){var d=jQuery.Deferred();var r=sap.ushell.resources.getTranslationModel();this.getView().setModel(r,"i18n");this.getView().setModel(this.getConfigurationModel(),"config");d.resolve(this.getView());return d.promise();},getValue:function(){var d=jQuery.Deferred();d.resolve(sap.ushell.Container.getUser().getFullName());return d.promise();},onCancel:function(){if(this.userStatusEnabled){if(this.isServiceEnable()){this.oUserEnableOnlineStatusSwitch.setState(this.originalEnableStatus);this.userStatusButton.setStatus(sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM[this.originalUserStatus]);}}if(this.imgConsentEnabled){this.currentUserImgConsent=this.oUser.getImageConsent();this.oUserEnableImgConsentSwitch.setState(this.currentUserImgConsent);}},onSave:function(){var r=jQuery.Deferred(),w,u,a,p=[];if(this.userStatusEnabled){u=this.onSaveUserStatus();p.push(u);}if(this.imgConsentEnabled){a=this.onSaveUserImgConsent();p.push(a);}w=jQuery.when.apply(null,p);w.done(function(){r.resolve();});return r.promise();},onSaveUserImgConsent:function(){var d=jQuery.Deferred();var u;if(this.oUser.getImageConsent()!==this.currentUserImgConsent){if(this.currentUserImgConsent!=undefined){this.oUser.setImageConsent(this.currentUserImgConsent);u=this.userInfoService.updateUserPreferences(this.oUser);u.done(function(){this.oUser.resetChangedProperties();this.origUserImgConsent=this.currentUserImgConsent;d.resolve();}.bind(this));u.fail(function(e){this.oUser.setImageConsent(this.origUserImgConsent);this.oUser.resetChangedProperties();this.currentUserImgConsent=this.origUserImgConsent;jQuery.sap.log.error(e);d.reject(e);}.bind(this));}else{d.reject(this.currentUserImgConsent+"is undefined");}}else{d.resolve();}return d.promise();},onSaveUserStatus:function(){var d=jQuery.Deferred(),u;if(this.isServiceEnable()){if(this.originalEnableStatus!==this.oUserEnableOnlineStatusSwitch.getState()||this.originalUserStatus!==this.userStatusButton.getStatus().status){if(!this.oUserEnableOnlineStatusSwitch.getState()){u=null;this.oUserStatusService.setStatus(null);}else{u=this.userStatusButton.getStatus()?this.userStatusButton.getStatus().status:"AVAILABLE";}this._writeUserStatusSettingToPersonalization({userStatusEnabled:this.oUserEnableOnlineStatusSwitch.getState(),userStatusDefault:u});if(!this.originalEnableStatus&&this.oUserEnableOnlineStatusSwitch.getState()){this.oUserStatusService.setStatus(u);}this.originalEnableStatus=this.oUserEnableOnlineStatusSwitch.getState();this.originalUserStatus=u;}}d.resolve();return d.promise();},addUserStatusDropdown:function(){var u=sap.ui.getCore().byId("UserAccountSelector--userStatusDropDownFlexBox");u.addItem(this.userStatusButton);},addUserEnableSwitch:function(e){var u=sap.ui.getCore().byId("UserAccountSelector--userStatusEnableFlexBox");this.oUserEnableOnlineStatusSwitch=new sap.m.Switch({type:sap.m.SwitchType.Default,state:e,change:function(E){this.userStatusButton.setEnabled(E.mParameters.state);jQuery("#"+this.userStatusButton.getId()).attr("tabindex",E.mParameters.state?0:-1);}.bind(this)});this.oUserEnableOnlineStatusSwitch.addCustomData(new A({key:"aria-labelledBy",value:"UserAccountSelector--sapUshellEnableStatusLabel",writeToDom:true}));this.userStatusButton.setEnabled(e);jQuery("#"+this.userStatusButton.getId()).attr("tabindex",e?0:-1);if(!u){jQuery.sap.log.error("UserAccountSelector: addUserEnableSwitch was called before the renderer");return;}u.addItem(this.oUserEnableOnlineStatusSwitch);},isServiceEnable:function(){return U?U.prototype.isEnabled:false;},getConfigurationModel:function(){var c=new sap.ui.model.json.JSONModel({});var u=sap.ushell.Container.getUser();c.setData({isRTL:sap.ui.getCore().getConfiguration().getRTL(),sapUiContentIconColor:sap.ui.core.theming.Parameters.get('sapUiContentIconColor'),isStatusEnable:this.originalEnableStatus?this.originalEnableStatus:false,flexAlignItems:sap.ui.Device.system.phone?'Stretch':'Center',textAlign:sap.ui.Device.system.phone?'Left':'Right',textDirection:sap.ui.Device.system.phone?'Column':'Row',labelWidth:sap.ui.Device.system.phone?"auto":"12rem",name:u.getFullName(),mail:u.getEmail(),server:window.location.host,imgConsentEnabled:this.imgConsentEnabled,isImageConsent:this.currentUserImgConsent,userStatusEnabled:this.userStatusEnabled});return c;},_getOnlineStatusPopOver:function(u){var p=new sap.m.Popover({placement:sap.m.PlacementType.Bottom,showArrow:true,showHeader:false,content:[new sap.ushell.ui.launchpad.UserStatusItem({status:sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.AVAILABLE,isOpener:false,press:function(e){o.setStatus(sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.AVAILABLE);p.close();}}).addStyleClass('sapUserStatusContainer'),new sap.ushell.ui.launchpad.UserStatusItem({status:sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.AWAY,isOpener:false,press:function(e){o.setStatus(sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.AWAY);p.close();}}).addStyleClass('sapUserStatusContainer'),new sap.ushell.ui.launchpad.UserStatusItem({status:sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.BUSY,isOpener:false,press:function(e){o.setStatus(sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.BUSY);p.close();}}).addStyleClass('sapUserStatusContainer'),new sap.ushell.ui.launchpad.UserStatusItem({status:sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.APPEAR_OFFLINE,isOpener:false,press:function(e){o.setStatus(sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.APPEAR_OFFLINE);p.close();}}).addStyleClass('sapUserStatusContainer')]});var o=new sap.ushell.ui.launchpad.UserStatusItem({tooltip:"{i18n>headerActionsTooltip}",enabled:false,ariaLabel:sap.ushell.Container.getUser().getFullName(),image:sap.ui.core.IconPool.getIconURI("account"),status:u?sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM[u]:sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM["AVAILABLE"],press:function(e){var b=sap.ui.getCore().byId(e.mParameters.id);p.openBy(b);}.bind(this),contentList:p}).addStyleClass('sapUserStatusOpener');return o;},_writeUserStatusSettingToPersonalization:function(u){var d,p;try{p=this._getUserSettingsPersonalizer().setPersData(u);}catch(e){jQuery.sap.log.error("Personalization service does not work:");jQuery.sap.log.error(e.name+": "+e.message);d=new jQuery.Deferred();d.reject(e);p=d.promise();}return p;},_getUserSettingsPersonalizer:function(){if(this.oUserPersonalizer===undefined){this.oUserPersonalizer=this._createUserPersonalizer();}return this.oUserPersonalizer;},_createUserPersonalizer:function(){var p=sap.ushell.Container.getService("Personalization"),c,s={keyCategory:p.constants.keyCategory.FIXED_KEY,writeFrequency:p.constants.writeFrequency.LOW,clientStorageAllowed:true},P={container:"sap.ushell.services.UserStatus",item:"userStatusData"},o=p.getPersonalizer(P,s,c);return o;},_getUserStatusSetting:function(){var p=this._getUserSettingsPersonalizer();return p.getPersData();},addImgConsentEnableSwitch:function(e){var u=sap.ui.getCore().byId("UserAccountSelector--userImgConsentEnableFlexBox");this.oUserEnableImgConsentSwitch=new sap.m.Switch({customTextOff:sap.ushell.resources.i18n.getText("No"),customTextOn:sap.ushell.resources.i18n.getText("Yes"),type:sap.m.SwitchType.Default,state:e,change:this.setCurrentUserImgConsent.bind(this)});this.oUserEnableImgConsentSwitch.addCustomData(new A({key:"aria-labelledBy",value:"UserAccountSelector--sapUshellUserImageConsentSwitchLabel",writeToDom:true}));if(!u){jQuery.sap.log.error("UserAccountSelector: addImgConsentEnableSwitch was called before the renderer");return;}u.addItem(this.oUserEnableImgConsentSwitch);},setCurrentUserImgConsent:function(e){this.currentUserImgConsent=e.mParameters.state;},termsOfUserPress:function(){var t=sap.ui.getCore().byId("UserAccountSelector--termsOfUseTextFlexBox");var a=sap.ui.getCore().byId("UserAccountSelector--termsOfUseLink");var i=t.getVisible();if(i){t.setVisible(false);a.setText(sap.ushell.resources.i18n.getText("userImageConsentDialogShowTermsOfUse"));}else{a.setText(sap.ushell.resources.i18n.getText("userImageConsentDialogHideTermsOfUse"));t.setVisible(true);}}});},false);
