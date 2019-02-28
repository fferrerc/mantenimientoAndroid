/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/Dialog','sap/m/DialogRenderer','sap/ui/layout/form/SimpleForm','sap/ui/layout/form/ResponsiveGridLayout','sap/ui/rta/Utils'],function(D,a,S,R,b){"use strict";var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");var d,t,T,s,o,c,e,i,I,f,g,C,h;function _(){d=new sap.m.GenericTile("tile",{header:"{/title}",subheader:"{/subtitle}",ariaLabel:r.getText("APP_VARIANT_TILE_ARIA_LABEL"),tileContent:[new sap.m.TileContent({content:[new sap.m.ImageContent({src:"{/icon}"})]})]}).addStyleClass("sapUiMediumMarginBegin").addStyleClass("sapUiTinyMarginTop").addStyleClass("sapUiTinyMarginBottom");}function j(E){var v=E.getParameter("value");var F=new sap.ui.model.Filter("name",sap.ui.model.FilterOperator.Contains,v);var B=E.getSource().getBinding("items");B.filter([F]);}function k(E){var q=E.getParameter("selectedContexts");if(q&&q.length){q.forEach(function(u){var v=u.getObject().name;I.setValue(v);C.setProperty("/icon",u.getObject().icon);});}E.getSource().getBinding("items").filter([]);}function l(){if(!g){g=new sap.m.SelectDialog("selectDialog",{noDataText:r.getText("APP_VARIANT_ICON_NO_DATA"),title:r.getText("APP_VARIANT_ICON_SELECT_ICON"),search:function(E){j(E);},confirm:function(E){k(E);},cancel:function(E){k(E);}});}g.addStyleClass(b.getRtaStyleClassName());g.bindAggregation("items",{path:"/icons",template:new sap.m.StandardListItem({title:"{name}",description:"",icon:"{icon}",iconDensityAware:false,iconInset:false,type:"Active"})});var u=sap.ui.core.IconPool.getIconNames();var q=[];u.forEach(function(N){q.push({icon:sap.ui.core.IconPool.getIconInfo(N).uri,name:N.toLowerCase()});});h.setProperty("/icons",q);g.setModel(h);g.getBinding("items").filter([]);g.open();}function m(){t=new sap.m.Label({required:true,text:r.getText("APP_DIALOG_TITLE_TEXT"),textAlign:"Left"});T=new sap.m.Input("titleInput",{value:"{/title}",valueLiveUpdate:true,placeholder:r.getText("SAVE_AS_DIALOG_PLACEHOLDER_TITLE_TEXT"),liveChange:function(){var q=sap.ui.getCore().byId("saveButton");if(this.getValue()===""){this.setValueState(sap.ui.core.ValueState.Error);q.setEnabled(false);}else{this.setValueState(sap.ui.core.ValueState.None);q.setEnabled(true);}}});s=new sap.m.Label({text:r.getText("APP_DIALOG_SUB_TITLE_TEXT"),textAlign:"Left"});o=new sap.m.Input({value:"{/subtitle}",valueLiveUpdate:true});c=new sap.m.Label({text:r.getText("APP_DIALOG_DESCRIPTION_TEXT"),textAlign:"Left"});e=new sap.m.TextArea({rows:4});i=new sap.m.Label({text:r.getText("APP_DIALOG_ICON_TEXT"),textAlign:"Left"});I=new sap.m.Input("selectInput",{showValueHelp:true,liveChange:function(E){l(E);},valueHelpRequest:function(E){l(E);},value:"{/iconname}",valueLiveUpdate:true});}function n(){f=new sap.ui.layout.form.SimpleForm({editable:true,layout:"ResponsiveGridLayout",labelSpanXL:4,labelSpanL:4,labelSpanM:4,labelSpanS:4,adjustLabelSpan:false,emptySpanXL:0,emptySpanL:0,emptySpanM:0,emptySpanS:0,columnsXL:2,columnsL:2,columnsM:2,singleContainerFullSize:false,content:[new sap.ui.core.Title("title1"),t,T,s,o,i,I,c,e,new sap.ui.core.Title("title2"),d]});return f;}function p(){var v=new sap.m.VBox({items:[n()]}).addStyleClass("sapUISmallMargin");return v;}var A=D.extend("sap.ui.rta.appVariant.AppVariantDialog",{metadata:{library:"sap.ui.rta",events:{create:{},cancel:{}}},init:function(){D.prototype.init.apply(this);this.setTitle(r.getText("CREATE_APP_VARIANT_DIALOG_TITLE"));this.setContentWidth("620px");this.setContentHeight("250px");C=new sap.ui.model.json.JSONModel({title:null,subtitle:null,icon:" ",iconname:null});h=new sap.ui.model.json.JSONModel({icons:null});sap.ui.getCore().setModel(C);_();m();this.addContent(p());this._createButtons();this.addStyleClass(b.getRtaStyleClassName());},onAfterRendering:function(){document.getElementById('title1').style.height="0px";document.getElementById('title2').style.height="0px";document.getElementById('tile').style.float="left";},_onCreate:function(){var q=T.getValue()||" ";var u=o.getValue()||" ";var v=e.getValue()||" ";var w=I.getValue()?sap.ui.core.IconPool.getIconInfo(I.getValue()).uri:" ";this.fireCreate({title:q,subTitle:u,description:v,icon:w});this.close();this.destroy();},_createButtons:function(){this.addButton(new sap.m.Button("saveButton",{text:r.getText("APP_VARIANT_DIALOG_SAVE"),tooltip:r.getText("TOOLTIP_APP_VARIANT_DIALOG_SAVE"),enabled:false,press:function(){this._onCreate();}.bind(this)}));this.addButton(new sap.m.Button({text:r.getText("SAVE_AS_APP_VARIANT_DIALOG_CANCEL"),tooltip:r.getText("TOOLTIP_SAVE_AS_APP_VARIANT_DIALOG_CANCEL"),press:function(){this.fireCancel();this.close();this.destroy();}.bind(this)}));},destroy:function(){if(C){C.destroy();}D.prototype.destroy.apply(this,arguments);},renderer:a.render});return A;},true);