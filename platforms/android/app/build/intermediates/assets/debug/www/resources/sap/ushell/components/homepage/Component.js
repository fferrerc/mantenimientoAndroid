// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/components/HomepageManager','sap/ushell/resources','sap/ui/core/UIComponent','sap/ushell/components/homepage/ComponentKeysHandler','sap/ushell/UserActivityLog','sap/ushell/Config','sap/ushell/bootstrap/common/common.load.model',"sap/ushell/components/SharedComponentUtils"],function(H,r,U,C,a,b,m,s){"use strict";return U.extend("sap.ushell.components.homepage.Component",{metadata:{version:"1.61.0",library:"sap.ushell.components.homepage",dependencies:{libs:["sap.m"]},config:{semanticObject:'Shell',action:'home',title:r.i18n.getText("homeBtn_tooltip"),fullWidth:true,hideLightBackground:true}},init:function(){this.oModel=m.getModel();this.setModel(this.oModel);U.prototype.init.apply(this,arguments);var d={model:this.oModel,view:this.oDashboardView};this.oHomepageManager=new H("dashboardMgr",d);this.setModel(r.i18nModel,"i18n");sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.UsageAnalytics","usageAnalyticsStarted",function(){sap.ui.require(["sap/ushell/components/homepage/FLPAnalytics"]);});s.toggleUserActivityLog();s.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay","/core/home/enableHomePageSettings");b.on("/core/home/homePageGroupDisplay").do(function(n){this.oHomepageManager.handleDisplayModeChange(n);}.bind(this));s.getEffectiveHomepageSetting("/core/home/sizeBehavior","/core/home/sizeBehaviorConfigurable");b.on("/core/home/sizeBehavior").do(function(S){var M=this.oHomepageManager.getModel();M.setProperty("/sizeBehavior",S);}.bind(this));this.setInitialConfiguration();},createContent:function(){this.oDashboardView=sap.ui.view({viewName:"sap.ushell.components.homepage.DashboardContent",type:"JS",async:true});return this.oDashboardView;},setInitialConfiguration:function(){sap.ui.getCore().getEventBus().publish("launchpad","initialConfigurationSet");},exit:function(){m.unsubscribeEventHandlers();this.oHomepageManager.destroy();}});});