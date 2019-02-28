// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/resources','sap/ui/core/UIComponent','sap/ushell/components/homepage/ComponentKeysHandler','sap/ushell/utils','sap/ushell/EventHub'],function(r,U,C,u,E){"use strict";var s=sap.ushell.Container.getRenderer("fiori2").getShellController(),S=s.getView();return U.extend("sap.ushell.components.shell.ShellElements.Component",{metadata:{version:"1.53.0-SNAPSHOT",library:"sap.ushell.components.shell.ShellElements",dependencies:{libs:["sap.m"]}},createContent:function(){var c=this.getComponentData().config;this.oDefConfig={};this.oDefConfig=jQuery.extend(this.oDefConfig,c);sap.ui.getCore().getEventBus().subscribe("shell","notificationsCompLoaded",this._handleNotificationsCompLoaded,this);sap.ui.getCore().getEventBus().subscribe("shell","userImageCompLoaded",this._handleUserImageCompLoaded,this);sap.ui.getCore().getEventBus().subscribe("shell","meAreaCompLoaded",this._handleMeAreaCompLoaded,this);this._startComponentLoadSequence();},_startComponentLoadSequence:function(){function g(){return S.getModel().getProperty('/currentState/stateName');}if(u.isNotificationsEnabled()&&g()!=="lean"){sap.ui.getCore().getEventBus().publish("shell","loadNotificationsComponent");}else{this._handleNotificationsCompLoaded(undefined,undefined,{delay:0});}},_handleNotificationsCompLoaded:function(c,e,d){function g(){return S.getModel().getProperty('/currentState/stateName');}function i(){var v=S.getViewData()||{},o=v.config||{};return o.enableUserImage&&g()!=="headerless";}if(i()){if(!d||d.delay<=0){sap.ui.getCore().getEventBus().publish("shell","loadUserImageComponent");}else{setTimeout(function(){sap.ui.getCore().getEventBus().publish("shell","loadUserImageComponent");},d.delay);}}else{this._handleUserImageCompLoaded(undefined,undefined,{delay:0});}},_handleUserImageCompLoaded:function(c,e,d){var a=S.getModel().getProperty('/currentState/stateName'),l=true;if(a==="headerless"){l=false;}if(l){if(!d||d.delay<=0){sap.ui.getCore().getEventBus().publish("shell","loadMeAreaComponent");}else{setTimeout(function(){sap.ui.getCore().getEventBus().publish("shell","loadMeAreaComponent");},d.delay);}}else{this._handleNMeAreaCompLoaded(undefined,undefined,{delay:0});}},_handleMeAreaCompLoaded:function(c,e,d){E.emit("ShellComplete");},exit:function(){sap.ui.getCore().getEventBus().unsubscribe("shell","notificationsCompLoaded",this._handleNotificationsCompLoaded,this);sap.ui.getCore().getEventBus().unsubscribe("shell","userImageCompLoaded",this._handleUserImageCompLoaded,this);sap.ui.getCore().getEventBus().unsubscribe("shell","meAreaCompLoaded",this._handleNMeAreaCompLoaded,this);}});});