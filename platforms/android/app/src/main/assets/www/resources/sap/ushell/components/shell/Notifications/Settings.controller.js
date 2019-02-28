// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(function(){"use strict";sap.ui.controller("sap.ushell.components.shell.Notifications.Settings",{onInit:function(){var t=this,s=sap.ushell.Container.getService("Notifications").readSettings(),m=new sap.ui.model.json.JSONModel(),v,n,r,d;m.setProperty("/aDitryRowsIndicator",[]);m.setProperty("/rows",[]);m.setProperty("/originalRows",[]);s.done(function(R){r=JSON.parse(R);m.setProperty("/rows",r.value);d=JSON.parse(JSON.stringify(r.value));m.setProperty("/originalRows",d);});s.fail(function(){n=t.getView().getNoDataUI();t.getView().removeAllContent();t.getView().addContent(n);});this._handleSwitchFlagsDataInitialization(m);v=this.getView();v.setModel(m);},onExit:function(){},onBeforeRendering:function(){},onAfterRendering:function(){var o=this.getView().getModel().getProperty("/flags"),r=this.getView().getModel().getProperty("/rows"),d;if(r!==undefined){d=JSON.parse(JSON.stringify(r));this.getView().getModel().setProperty("/originalRows",d);}this.getView().getModel().setProperty("/originalFlags/previewNotificationEnabled",o.previewNotificationEnabled);this.getView().getModel().setProperty("/originalFlags/highPriorityBannerEnabled",o.highPriorityBannerEnabled);this.getView().getModel().setProperty("/aDitryRowsIndicator",[]);},getContent:function(){var d=jQuery.Deferred();d.resolve(this.getView());return d.promise();},getValue:function(){var d=jQuery.Deferred();d.resolve(" ");return d.promise();},onCancel:function(){var o=this.getView().getModel().getProperty("/originalFlags"),O=this.getView().getModel().getProperty("/originalRows"),d=JSON.parse(JSON.stringify(O));this.getView().getModel().setProperty("/flags/previewNotificationEnabled",o.previewNotificationEnabled);this.getView().getModel().setProperty("/flags/highPriorityBannerEnabled",o.highPriorityBannerEnabled);this.getView().getModel().setProperty("/rows",d);this.getView().getModel().setProperty("/originalFlags",{});this.getView().getModel().setProperty("/originalRows",[]);this.getView().getModel().setProperty("/aDitryRowsIndicator",[]);},onSave:function(){var d=jQuery.Deferred(),r=this.getView().getModel().getProperty("/rows"),o=this.getView().getModel().getProperty("/originalRows"),t,T,i,D=this.getView().getModel().getProperty("/aDitryRowsIndicator");d.resolve();this._handleSwitchFlagsSave();for(i=0;i<r.length;i++){if(D[i]&&D[i]===true){t=r[i];T=o[i];if(!this._identicalRows(t,T)){sap.ushell.Container.getService("Notifications").saveSettingsEntry(t);}}}this.getView().getModel().setProperty("/aDitryRowsIndicator",[]);return d.promise();},setControlDirtyFlag:function(){var c=this.getBindingContext().sPath,i=c.substring(c.lastIndexOf("/")+1,c.length),o=this.getModel().getProperty("/aDitryRowsIndicator");if(o!==undefined){this.getModel().setProperty("/aDitryRowsIndicator/"+i,true);}},_handleSwitchFlagsDataInitialization:function(m){var s=sap.ushell.Container.getService("Notifications").getUserSettingsFlags(),M=sap.ushell.Container.getService("Notifications")._getNotificationSettingsMobileSupport();s.done(function(S){m.setProperty("/flags",{});m.setProperty("/flags/previewNotificationEnabled",S.previewNotificationEnabled);m.setProperty("/flags/highPriorityBannerEnabled",S.highPriorityBannerEnabled);m.setProperty("/flags/mobileNotificationsEnabled",M);m.setProperty("/originalFlags",{});m.setProperty("/originalFlags/previewNotificationEnabled",S.previewNotificationEnabled);m.setProperty("/originalFlags/highPriorityBannerEnabled",S.highPriorityBannerEnabled);});},_handleSwitchFlagsSave:function(){var p=this.getView().getModel().getProperty("/flags/previewNotificationEnabled"),h=this.getView().getModel().getProperty("/flags/highPriorityBannerEnabled"),o=this.getView().getModel().getProperty("/originalFlags/previewNotificationEnabled"),O=this.getView().getModel().getProperty("/originalFlags/highPriorityBannerEnabled");if((o!==p)||(O!==h)){sap.ushell.Container.getService("Notifications").setUserSettingsFlags({previewNotificationEnabled:p,highPriorityBannerEnabled:h});if(p!==o){sap.ui.getCore().getEventBus().publish("sap.ushell.services.Notifications","enablePreviewNotificationChanged",{bPreviewEnabled:p});}this.getView().getModel().setProperty("/originalFlags/previewNotificationEnabled",p);this.getView().getModel().setProperty("/originalFlags/highPriorityBannerEnabled",h);}},_identicalRows:function(r,a){if((r.NotificationTypeId===a.NotificationTypeId)&&(r.PriorityDefault===a.PriorityDefault)&&(r.DoNotDeliver===a.DoNotDeliver)&&(r.DoNotDeliverMob===a.DoNotDeliverMob)){return true;}return false;}});},false);
