/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/thirdparty/jquery','./BaseController','sap/m/library','sap/ui/comp/library','./Util'],function(q,B,M,C,U){"use strict";var S=B.extend("sap.ui.comp.personalization.SortController",{constructor:function(i,s){B.apply(this,arguments);this.setType(M.P13nPanelType.sort);this.setItemType(M.P13nPanelType.sort+"Items");},metadata:{events:{afterSortModelDataChange:{}}}});S.prototype.setTable=function(t){B.prototype.setTable.apply(this,arguments);if(this.getTable()&&t.detachSort&&t.attachSort){t.detachSort(this._onSort,this);t.attachSort(this._onSort,this);}};S.prototype.getColumn2Json=function(c,s,i){if(!U.isSortable(c)){return null;}if(!c.getSorted||(c.getSorted&&!c.getSorted())){return null;}return{columnKey:s,operation:c.getSortOrder()};};S.prototype.getColumn2JsonTransient=function(c,s,t,T){if(!U.isSortable(c)){return null;}return{columnKey:s,text:t,tooltip:T};};S.prototype.handleIgnore=function(j,i){j.sort.sortItems.splice(i,1);};S.prototype.syncJson2Table=function(j){var c=this.getColumnMap();var o=q.extend(true,{},c);this.fireBeforePotentialTableChange();if(this.getTableType()===C.personalization.TableType.AnalyticalTable||this.getTableType()===C.personalization.TableType.Table||this.getTableType()===C.personalization.TableType.TreeTable){j.sort.sortItems.forEach(function(m){var a=c[m.columnKey];if(!a){return;}if(m.operation===undefined){return;}if(!a.getSorted()){a.setSorted(true);}if(a.getSortOrder()!==m.operation){a.setSortOrder(m.operation);}delete o[m.columnKey];});for(var s in o){var a=o[s];if(a&&a.getSorted()){a.setSorted(false);}}}this.fireAfterPotentialTableChange();};S.prototype.getDataSuiteFormat2Json=function(d){var j=this.createControlDataStructure();if(!d.SortOrder||!d.SortOrder.length){return j;}j.sort.sortItems=d.SortOrder.map(function(s){return{columnKey:s.Property,operation:s.Descending?"Descending":"Ascending"};});return j;};S.prototype.getDataSuiteFormatSnapshot=function(d){var c=this.getUnionData(this.getControlDataInitial(),this.getControlData());if(!c.sort||!c.sort.sortItems||!c.sort.sortItems.length){return;}d.SortOrder=c.sort.sortItems.map(function(s){return{Property:s.columnKey,Descending:s.operation==="Descending"};});};S.prototype._onSort=function(e){e.preventDefault();this._updateInternalModel(U.getColumnKey(e.getParameter("column")),e.getParameter("sortOrder"),e.getParameter("columnAdded"));this.syncJson2Table(this.getControlData());this.fireAfterSortModelDataChange();};S.prototype._updateInternalModel=function(c,o,a){if(!c||(o!=="Descending"&&o!=="Ascending")){return;}if(!a){this.getInternalModel().setProperty("/controlData/sort/sortItems",[]);}var b=this.getControlData();var i=U.getIndexByKey("columnKey",c,b.sort.sortItems);i=(i>-1)?i:b.sort.sortItems.length;this.getInternalModel().setProperty("/controlData/sort/sortItems/"+i+"/",{columnKey:c,operation:o});this.updateControlDataBaseFromJson(b);};S.prototype.getPanel=function(){if(!U.hasSortableColumns(this.getColumnMap())){return null;}return new Promise(function(r){sap.ui.require(['sap/m/P13nSortPanel','sap/m/P13nItem','sap/m/P13nSortItem'],function(P,a,b){return r(new P({containerQuery:true,items:{path:"$sapmP13nPanel>/transientData/sort/sortItems",template:new a({columnKey:"{$sapmP13nPanel>columnKey}",text:"{$sapmP13nPanel>text}",tooltip:"{$sapmP13nPanel>tooltip}"})},sortItems:{path:"$sapmP13nPanel>/controlDataReduce/sort/sortItems",template:new b({columnKey:"{$sapmP13nPanel>columnKey}",operation:"{$sapmP13nPanel>operation}"})},beforeNavigationTo:this.setModelFunction(),updateSortItem:function(){this.fireAfterPotentialModelChange({json:this.getControlDataReduce()});}.bind(this),addSortItem:function(e){if(!e.getParameter("sortItemData")){return;}var i=e.getParameter("index");var s=e.getParameter("sortItemData");var o={columnKey:s.getColumnKey(),operation:s.getOperation()};var c=this.getControlDataReduce();if(i>-1){c.sort.sortItems.splice(i,0,o);}else{c.sort.sortItems.push(o);}this.setControlDataReduce2Model(c);this.fireAfterPotentialModelChange({json:c});}.bind(this),removeSortItem:function(e){var i=e.getParameter("index");if(i<0){return;}var c=this.getControlDataReduce();c.sort.sortItems.splice(i,1);this.setControlDataReduce2Model(c);this.fireAfterPotentialModelChange({json:c});}.bind(this)}));}.bind(this));}.bind(this));};S.prototype.getChangeType=function(p,P){if(!P||!P.sort||!P.sort.sortItems){return C.personalization.ChangeType.Unchanged;}var i=JSON.stringify(p.sort.sortItems)!==JSON.stringify(P.sort.sortItems);return i?C.personalization.ChangeType.ModelChanged:C.personalization.ChangeType.Unchanged;};S.prototype.getChangeData=function(p,P){if(!p||!p.sort||!p.sort.sortItems){return{sort:{sortItems:[]}};}if(!P||!P.sort||!P.sort.sortItems){return{sort:U.copy(p.sort)};}if(JSON.stringify(p.sort.sortItems)!==JSON.stringify(P.sort.sortItems)){return{sort:U.copy(p.sort)};}return null;};S.prototype.getUnionData=function(j,J){if(!J||!J.sort||!J.sort.sortItems){return{sort:U.copy(j.sort)};}return{sort:U.copy(J.sort)};};S.prototype.exit=function(){B.prototype.exit.apply(this,arguments);var t=this.getTable();if(t&&t.detachSort){t.detachSort(this._onSort,this);}};return S;},true);
