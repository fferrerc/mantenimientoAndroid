/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/m/library','./P13nPanel','./P13nSortModel'],function(q,M,P,a){"use strict";var b=P.extend("sap.ui.mdc.experimental.P13nSortPanel",{metadata:{library:"sap.ui.mdc"}});b.prototype.init=function(){P.prototype.init.apply(this,arguments);this._sColumnKeyOfMarkedItem=undefined;this._oInternalModel=undefined;this._proxyOnModelContextChange=q.proxy(this._onModelContextChange,this);this.attachModelContextChange(this._proxyOnModelContextChange);};b.prototype.refreshInitialState=function(){this._bInternalModelToBeUpdated=true;this.invalidate();};b.prototype._onModelContextChange=function(){if(!this.getModel()){return;}this._updateInternalModel();};b.prototype.onBeforeRendering=function(){this._updateInternalModel();};b.prototype.exit=function(){this.detachModelContextChange(this._proxyOnModelContextChange);};b.prototype.onSelectionChange=function(e){e.getParameter("listItems").forEach(function(t){this._selectTableItem(t);},this);};b.prototype._selectTableItem=function(t){var i=this._getTable().indexOfItem(t);this._oInternalModel.selectModelItem(i,t.getSelected());this._oInternalModel.updateProperties(i,{sortOrder:t.getSelected()?t.getCells()[1].getSelectedKey():undefined});this._toggleMarkedTableItem(t);this._updateControlLogic();};b.prototype.onItemPressed=function(e){this._toggleMarkedTableItem(e.getParameter('listItem'));this._updateControlLogic();};b.prototype.onPressButtonMoveToTop=function(){this._moveTableItem(this._getMarkedTableItem(),this._getVisibleTableItems()[0]);};b.prototype.onPressButtonMoveUp=function(){var v=this._getVisibleTableItems();this._moveTableItem(this._getMarkedTableItem(),v[v.indexOf(this._getMarkedTableItem())-1]);};b.prototype.onPressButtonMoveDown=function(){var v=this._getVisibleTableItems();this._moveTableItem(this._getMarkedTableItem(),v[v.indexOf(this._getMarkedTableItem())+1]);};b.prototype.onPressButtonMoveToBottom=function(){var v=this._getVisibleTableItems();this._moveTableItem(this._getMarkedTableItem(),v[v.length-1]);};b.prototype._moveTableItem=function(t,T){var i=this._getTable().indexOfItem(t);var I=this._getTable().indexOfItem(T);this._oInternalModel.moveModelItemPosition(i,I);this._oInternalModel.moveModelItem(i,I);this._removeStyleFromTableItem(this._getMarkedTableItem());this._sortTableItemsAccordingToInternalModel();this._toggleMarkedTableItem(this._getMarkedTableItem());this._updateControlLogic();};b.prototype.onSwitchButtonShowSelected=function(){this.setShowOnlySelectedItems(!this.getShowOnlySelectedItems());this._removeStyleFromTableItem(this._getMarkedTableItem());this._filterTableItems();this._toggleMarkedTableItem(this._getMarkedTableItem());this._updateControlLogic();};b.prototype.onSearchFieldLiveChange=function(){this._removeStyleFromTableItem(this._getMarkedTableItem());this._filterTableItems();this._toggleMarkedTableItem(this._getMarkedTableItem());this._updateControlLogic();};b.prototype._filterTableItems=function(){var f=[];if(this._isFilteredByShowSelected()===true){f.push(new sap.ui.model.Filter("selected","EQ",true));}var s=this._getSearchText();if(s){f.push(new sap.ui.model.Filter([new sap.ui.model.Filter("text",sap.ui.model.FilterOperator.Contains,s),new sap.ui.model.Filter("tooltip",sap.ui.model.FilterOperator.Contains,s),new sap.ui.model.Filter("role",sap.ui.model.FilterOperator.Contains,s),new sap.ui.model.Filter("aggregationRole",sap.ui.model.FilterOperator.Contains,s)],false));}this._getTable().getBinding("items").filter(f);};b.prototype._sortTableItemsAccordingToInternalModel=function(){var c=function(i,I){var m=this._oInternalModel.getModelItemByColumnKey(i.getColumnKey());var o=this._oInternalModel.getModelItemByColumnKey(I.getColumnKey());var d=this._oInternalModel.getIndexOfModelItem(m);var e=this._oInternalModel.getIndexOfModelItem(o);if(d<e){return-1;}else if(d>e){return 1;}return 0;};this._getTable().getBinding("items").sort(new sap.ui.model.Sorter({path:'',descending:false,group:false,comparator:c.bind(this)}));};b.prototype._getVisibleTableItems=function(){return this._getTable().getItems().filter(function(t){return!!t.getVisible();});};b.prototype._getMarkedTableItem=function(){return this._getTableItemByColumnKey(this._sColumnKeyOfMarkedItem);};b.prototype._toggleMarkedTableItem=function(t){this._removeStyleFromTableItem(this._getMarkedTableItem());var c=this._getColumnKeyByTableItem(t);if(c){this._sColumnKeyOfMarkedItem=c;this._addStyleToTableItem(t);}};b.prototype._getStyledAsMarkedTableItem=function(){var d=this._getTable().$().find(".sapMP13nColumnsPanelItemSelected");return d.length?q(d[0]).control()[0]:undefined;};b.prototype._getTableItemByColumnKey=function(c){var C=this._getTable().getBinding("items").getContexts();var t=this._getTable().getItems().filter(function(T,i){return C[i].getObject().getColumnKey()===c;});return t[0];};b.prototype._getColumnKeyByTableItem=function(t){var i=this._getTable().indexOfItem(t);if(i<0){return null;}return this._getTable().getBinding("items").getContexts()[i].getObject().getColumnKey();};b.prototype._addStyleToTableItem=function(t){if(t){t.addStyleClass("sapMP13nColumnsPanelItemSelected");}};b.prototype._removeStyleFromTableItem=function(t){if(t){t.removeStyleClass("sapMP13nColumnsPanelItemSelected");}};b.prototype._isFilteredByShowSelected=function(){return false;};b.prototype._getTable=function(){return sap.ui.getCore().byId(this.getId()+"--IDTable")||null;};b.prototype._updateControlLogic=function(){var v=this._getVisibleTableItems();this._getManagedObjectModel().setProperty("/@custom/isMoveUpButtonEnabled",v.indexOf(this._getMarkedTableItem())>0);this._getManagedObjectModel().setProperty("/@custom/isMoveDownButtonEnabled",v.indexOf(this._getMarkedTableItem())>-1&&v.indexOf(this._getMarkedTableItem())<v.length-1);};b.prototype._updateInternalModel=function(){if(!this._bInternalModelToBeUpdated){return;}this._bInternalModelToBeUpdated=false;this._removeStyleFromTableItem(this._getMarkedTableItem());this._oInternalModel=new a({preventInitialSort:false,tableItems:this.getItems().filter(function(i){return i;}),availableItems:this.getItems().filter(function(i){return i;})});this._sortTableItemsAccordingToInternalModel();this._filterTableItems();if(!this._sColumnKeyOfMarkedItem){this._sColumnKeyOfMarkedItem=this._getColumnKeyByTableItem(this._getVisibleTableItems()[0]);}this._toggleMarkedTableItem(this._getMarkedTableItem());this._updateControlLogic();};return b;},true);
