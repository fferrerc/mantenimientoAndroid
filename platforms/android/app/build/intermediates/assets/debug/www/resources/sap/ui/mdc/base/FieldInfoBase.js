/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/Element','sap/m/ResponsivePopover'],function(E,R){"use strict";var F=E.extend("sap.ui.mdc.base.FieldInfoBase",{metadata:{library:"sap.ui.mdc",events:{dataUpdate:{},popoverAfterOpen:{}}}});F.prototype.isTriggerable=function(){throw new Error("sap.ui.mdc.base.FieldInfoBase: method isTriggerable must be redefined");};F.prototype.getTriggerHref=function(){throw new Error("sap.ui.mdc.base.FieldInfoBase: method getTriggerHref must be redefined");};F.prototype.open=function(c){var p=this.getParent();if(!p){throw new Error("sap.ui.mdc.base.FieldInfoBase: popover can not be open because the control is undefined");}if(this._oPopover&&this._oPopover.isOpen()){return Promise.resolve();}return this.createPopover().then(function(P){this._oPopover=P;this.addDependent(this._oPopover);this._oPopover.openBy(c||p);this._oPopover.attachAfterOpen(function(){this.firePopoverAfterOpen();}.bind(this));}.bind(this));};F.prototype.getContent=function(g){throw new Error("sap.ui.mdc.base.FieldInfoBase: method getContent must be redefined");};F.prototype.getContentTitle=function(){throw new Error("sap.ui.mdc.base.FieldInfoBase: method getContentTitle must be redefined");};F.prototype.getSourceControl=function(){return this.getParent();};F.prototype.createPopover=function(){var p;return this.getContent(function(){return p;}).then(function(P){p=new R(this.getId()+"-popover",{ariaLabelledBy:this.getContentTitle(),contentWidth:"380px",horizontalScrolling:false,showHeader:sap.ui.Device.system.phone,placement:sap.m.PlacementType.Auto,content:[P,this.getContentTitle()],afterClose:function(){if(this._oPopover){this._oPopover.destroy();}}.bind(this)});return p;}.bind(this));};return F;},true);
