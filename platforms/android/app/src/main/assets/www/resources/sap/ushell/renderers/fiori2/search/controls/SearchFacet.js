sap.ui.define(['sap/ushell/renderers/fiori2/search/controls/SearchFacetItem','sap/m/List'],function(){"use strict";sap.m.List.extend('sap.ushell.renderers.fiori2.search.controls.SearchFacet',{metadata:{properties:{eshRole:{type:"string",defaultValue:"datasource"}}},init:function(){this.data("sap-ui-fastnavgroup","false",true);},constructor:function(i,o){o=jQuery.extend({},{mode:sap.m.ListMode.SingleSelectMaster,showSeparators:sap.m.ListSeparators.None,includeItemInSelection:true,selectionChange:function(e){if(this.getEshRole()==="attribute"){this.handleItemPress(e);}},itemPress:function(e){if(this.getEshRole()==="datasource"){this.handleItemPress(e);}}},o);sap.m.List.prototype.constructor.apply(this,[i,o]);this.addStyleClass('sapUshellSearchFacet');},handleItemPress:function(e){var l=e.mParameters.listItem;var s=l.getBindingContext().getObject();if(l.getSelected()){this.getModel().addFilterCondition(s.filterCondition);this.getModel().eventLogger.logEvent({type:this.getModel().eventLogger.FACET_FILTER_ADD,referencedAttribute:s.facetAttribute,clickedValue:s.value,clickedPosition:l.getList().getItems().indexOf(l)});}else{this.getModel().removeFilterCondition(s.filterCondition);this.getModel().eventLogger.logEvent({type:this.getModel().eventLogger.FACET_FILTER_DEL,referencedAttribute:s.facetAttribute,clickedValue:s.value,clickedPosition:l.getList().getItems().indexOf(l)});}},renderer:'sap.m.ListRenderer',onAfterRendering:function(){var i=jQuery(this.getDomRef()).closest(".sapUshellSearchFacetIconTabBar").find(".sapUshellSearchFacetInfoZeile")[0];if(i){var I=sap.ui.getCore().byId(i.id);I.setVisible(false);}},setEshRole:function(r){var t=this;var i={path:"items",template:new sap.ushell.renderers.fiori2.search.controls.SearchFacetItem(),groupHeaderFactory:function(g){var a=new sap.m.GroupHeaderListItem({title:g.key,upperCase:false});if(t.getModel().config.charts){a.setVisible(false);}return a;}};switch(r.toLowerCase()){default:case"datasource":this.setMode(sap.m.ListMode.SingleSelectMaster);this.setHeaderText(sap.ushell.resources.i18n.getText("searchIn"));break;case"attribute":this.setMode(sap.m.ListMode.MultiSelect);this.setHeaderText("");break;}this.bindAggregation("items",i);this.setProperty("eshRole",r);return this;},setModel:function(){return sap.m.List.prototype.setModel.apply(this,arguments);}});});
