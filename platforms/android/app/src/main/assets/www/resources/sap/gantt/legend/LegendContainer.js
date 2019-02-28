/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Control","sap/m/NavContainer","sap/m/Page","sap/m/List","sap/m/StandardListItem"],function(C,N,P,L,S){"use strict";var a=C.extend("sap.gantt.legend.LegendContainer",{metadata:{properties:{width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"200px"},height:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"200px"}},aggregations:{legendSections:{type:"sap.m.Page",multiple:true,visibility:"public",singularName:"legendSection"}}}});a.prototype.init=function(){this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this._sTitle=this._oRb.getText("LEGEND_TITLE");this._oNavContainer=new N({autoFocus:false,width:this.getWidth(),height:this.getHeight()});this._oInitNavPage=new P({title:this._oRb.getText("LEGEND_TITLE"),content:[new L()]});this._aLegendSections=[];};a.prototype.setWidth=function(w){this.setProperty("width",w,true);this._oNavContainer.setWidth(w);return this;};a.prototype.setHeight=function(h){this.setProperty("height",h,true);this._oNavContainer.setHeight(h);return this;};a.prototype.addLegendSection=function(l){if(l){if(this._aLegendSections.length==1){this._oNavContainer.insertPage(this._oInitNavPage,0);this._aLegendSections[0].setShowNavButton(true);}if(this._aLegendSections.length!==0){l.setShowNavButton(true);}l.attachNavButtonPress(this._onNavBack,this);l.setBackgroundDesign(sap.m.PageBackgroundDesign.Solid);l.setEnableScrolling(true);var s=l.getTitle();if(s!==undefined){var o=new S({title:s,type:sap.m.ListType.Navigation});o.attachPress(this._onNavToLegendSection,this);this._oInitNavPage.getContent()[0].addItem(o);}this._aLegendSections.push(l);this._oNavContainer.addPage(l);}return this;};a.prototype.insertLegendSection=function(l,i){if(l){var m=this._aLegendSections.length;if(m==1){this._oNavContainer.insertPage(this._oInitNavPage,0);this._aLegendSections[0].setShowNavButton(true);}if(m!==0){l.setShowNavButton(true);}if(i>=m){i=m;}l.attachNavButtonPress(this._onNavBack,this);l.setBackgroundDesign(sap.m.PageBackgroundDesign.Solid);l.setEnableScrolling(true);var s=l.getTitle();if(s!==undefined){var o=new S({title:s,type:sap.m.ListType.Navigation});o.attachPress(this._onNavToLegendSection,this);this._oInitNavPage.getContent()[0].insertItem(o,i);}this._oNavContainer.insertPage(l,i+1);this._aLegendSections.splice(i,0,l);}return this;};a.prototype.indexOfLegendSection=function(l){var i=jQuery.inArray(l,this._aLegendSections);return i;};a.prototype.removeLegendSection=function(p){var r;if((typeof p)==="number"){this._oNavContainer.removePage(p+1);this._oInitNavPage.getContent()[0].removeItem(p);r=this._aLegendSections.splice(p+1,1);}else if(p){this._oInitNavPage.getContent()[0].removeItem(jQuery.inArray(p,this._oNavContainer.getPages())-1);this._oNavContainer.removePage(p);r=this._aLegendSections.splice(jQuery.inArray(p,this._aLegendSections),1);}if(this._aLegendSections.length==1){if(this._oNavContainer.getCurrentPage()==this._oInitNavPage){this._oNavContainer.to(this._aLegendSections[0]);}this._aLegendSections[0].setShowNavButton(false);}return r;};a.prototype.removeAllLegendSection=function(){var r=this._aLegendSections.splice(0,this._aLegendSections.length);this._oInitNavPage.getContent()[0].removeAllItems();this._oNavContainer.removeAllPages();return r;};a.prototype.getLegendSections=function(){var p=this._oNavContainer.getPages();var t=this;return p.filter(function(v){if(v.getTitle()!==t._sTitle){return true;}});};a.prototype.getNavigationPage=function(){return this._oInitNavPage;};a.prototype.getNavigationItems=function(){return this._oInitNavPage.getContent()[0].getItems();};a.prototype.getCurrentLegendSection=function(){return this._oNavContainer.getCurrentPage();};a.prototype._onNavToLegendSection=function(e){var l=e.getSource().getTitle();this._oNavContainer.setAutoFocus(true);for(var i=0;i<this._aLegendSections.length;i++){if(l==this._aLegendSections[i].getTitle()){this._oNavContainer.to(this._aLegendSections[i]);}}};a.prototype._onNavBack=function(e){this._oNavContainer.to(this._oInitNavPage);};return a;});