sap.ui.define(["sap/ui/base/EventProvider","sap/ui/comp/personalization/Util","sap/ui/table/AnalyticalTable","sap/ui/core/mvc/Controller","sap/m/Table","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/table/RowSettings","sap/ui/model/FilterOperator","sap/ui/table/library","sap/suite/ui/generic/template/listTemplates/listUtils","sap/base/Log"],function(E,P,A,C,R,J,F,a,b,S,l,L){"use strict";var e=new E();var t=C.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.DetailController",{setState:function(s){this.oState=s;this._enableExpandByFilter=true;this._enableUpdateExpandLevelInfo=false;var c=this.oState.oSmartTable;var o=this.oState.oController.getOwnerComponent();var T=this.oState.oController.getOwnerComponent().getModel("_templPriv");T.setProperty('/alp/autoHide',o.getAutoHide()?"filter":"highlight");c.attachInitialise(this._onSmartTableInit,this);c.attachBeforeRebindTable(this._onBeforeRebindTable,this);},_onSmartTableInit:function(){var s=this.oState.oSmartTable,c=s.getCustomToolbar(),T=c.getContent(),n;this.oState.oTemplateUtils.oCommonUtils.checkToolbarIntentsSupported(s);if(this.oState._pendingTableToolbarInit){if(!this.oState.oSmartFilterableKPI){c.insertContent(this.oState.alr_viewSwitchButtonOnTable,T.length);}}if(this.oState._pendingTableToolbarInit){for(var i=0;i<T.length;i++){if(T[i].mProperties.text==="Settings"){n=i;}}c.insertContent(this.oState._autoHideToggleBtn,n);}delete this.oState._pendingTableToolbarInit;this.oState.oSmartTable.attachShowOverlay(function(o){this.oState.oSmartTable.getCustomToolbar().setEnabled(!o.getParameter("overlay").show);},this);var d=new J({"highlightMode":"rebindTable"});this.oState.oSmartTable.setModel(d,"_tableHighlight");},_onBindingDataReceived:function(){var c=this.oState.oSmartTable.getTable();if(c instanceof A){this._expandByFilter("bindingDataReceived");}},_onBeforeRebindTable:function(o){var v=this.oState.oSmartTable.fetchVariant(),B=o.getParameter("bindingParams");B.parameters=B.parameters||{};if(this.oState.chartController&&this.oState.chartController.oChart){var c=this.oState.chartController.oChart,d=this.oState.chartController._chartInfo,f=(d.drillStack&&d.drillStack.length>0)?d.drillStack.pop():undefined;}if(!v){return;}var T=this.oState.oController.getOwnerComponent().getModel("_templPriv");var _=T.getProperty('/alp/_ignoreChartSelections');if(this.isFilter()&&this.oState.oSmartChart&&!_){this._applyChartSelectionOnTableAsFilter(o,c);}if(this.isFilter()&&f&&f.filter){o.getParameter("bindingParams").filters.push(f.filter);}var g=[];var h=this.oState.oSmartTable.getTable().getColumns();for(var i=0;i<h.length;i++){var j=h[i];if(j.getGrouped&&j.getGrouped()){g.push(j.getLeadingProperty?j.getLeadingProperty():P.getColumnKey(j));}}this._updateExpandLevelInfo(g);if(this.oState.oController.getOwnerComponent().getModel().getDefaultCountMode()==="None"&&this.oState.oSmartTable._isAnalyticalTable){o.mParameters.bindingParams.parameters.provideTotalResultSize=false;this.oState.oSmartTable.setShowRowCount(false);}var n=this._getValueFromCustomData(this.oState.oSmartTable,"InitialExpansionLevel");if(n){o.mParameters.bindingParams.parameters.numberOfExpandedLevels=parseInt(n,10);}this.oState.oController.onBeforeRebindTableExtension(o);this.oState.oTemplateUtils.oCommonEventHandlers.onBeforeRebindTable(o,{ensureExtensionFields:this.oState.oController.templateBaseExtension.ensureFieldsForSelect,addExtensionFilters:this.oState.oController.templateBaseExtension.addFilters,isAnalyticalListPage:true},this.oState.oSmartFilterbar);this.oState.oSmartTable.getModel("_tableHighlight").setProperty("/highlightMode","rebindTable");this._applyCriticalityInfo(o,this.oState.oSmartTable);l.handleErrorsOnTableOrChart(this.oState.oTemplateUtils,o);},attachTableChange:function(d,f,o){return e.attachEvent("TableChange",d,f,o);},detachTableChange:function(f,o){return e.detachEvent("TableChange",f,o);},isFilter:function(){var T=this.oState.oController.getOwnerComponent().getModel("_templPriv");return T.getProperty("/alp/autoHide")==="filter";},applyParamsToTable:function(){var s=this.oState.chartController,c=s.oChart,v=s._chartInfo.vizSelection;if(c&&v){var d=this.oState.oSmartTable.getModel("_tableHighlight"),o=s._chartInfo.chartSelection,i=s._chartInfo.drillStack.length>0;if(this.isFilter()||(o&&o.count)||d.getProperty("/highlightMode")==="eyeModeSwitch"||i){this.oState.oSmartTable.rebindTable(true);}else{this._applyCriticalityInfo(undefined,this.oState.oSmartTable);d.refresh(true);}}},_getValueFromCustomData:function(s,p){var _=s.getCustomData();for(var i=0;i<_.length;i++){if(_[i].mProperties.key===p){if(p==="lineItemCriticality"){return _[i].mProperties.value&&JSON.parse(_[i].mProperties.value);}else{return _[i].mProperties.value;}}}return"";},_applyCriticalityInfo:function(o,s){var T=s.getTable(),B=[],r=[],m=this,c=this._getValueFromCustomData(s,"lineItemCriticality");var d=this.oState.chartController&&this.oState.chartController.oChart;if(d){var p=this._getSelParamsFromChart(d);if(p&&p.length>0){p.forEach(function(i){if(i){var k=Object.keys(i);if(k){k.forEach(function(j){if(j!=="__metadata"&&r.indexOf(j)<0){B.push({path:j});r.push(j);}});}}});}this._setParamMap(d);}var f=c&&c.Path;if(f){B.push({path:f});if(o&&o.mParameters){o.mParameters.bindingParams.parameters.select.indexOf(f)===-1?o.mParameters.bindingParams.parameters.select+=","+f:"";}}else if(c&&c.EnumMember){B.push({path:"EnumMember"});}m.isFilterMode=this.isFilter();m.isResponsive=T instanceof R;if(!m.isFilterMode&&s.getModel("_tableHighlight").getProperty("/highlightMode")!=="eyeModeSwitch"){B.push({path:"_tableHighlight>/highlightMode"});}if(B&&B.length>0){var h=function(){var j=m._paramMap,_=m.isFilterMode;var k=m.isResponsive?this:this._getRow();if(!k){return;}if(k.getBindingContext()){var n;var q=this.getBindingContext();if(j&&!jQuery.isEmptyObject(j)){for(var u in j){if(!q.getObject(u)){continue;}for(var i=0;i<j[u].length;i++){if(j[u][i]===q.getObject(u)){n=true;break;}else{n=false;}}}}else{n=false;}m._applyCSSHighlight(k,_,n);if(f){var v=q.getObject(f);switch(v&&v.toString()){case"0":return"None";case"1":return"Error";case"2":return"Warning";case"3":return"Success";default:return"None";}}else if(c&&c.EnumMember){switch(c.EnumMember){case"com.sap.vocabularies.UI.v1.CriticalityType/Neutral":return"None";case"com.sap.vocabularies.UI.v1.CriticalityType/Negative":return"Error";case"com.sap.vocabularies.UI.v1.CriticalityType/Critical":return"Warning";case"com.sap.vocabularies.UI.v1.CriticalityType/Positive":return"Success";default:return"None";}}else{return"None";}}else{m._applyCSSHighlight(k,_,false);return"None";}};if(m.isResponsive){this.oState.alp_ColumnListItem.bindProperty("highlight",{parts:B,formatter:h});}else{var g=new a({highlight:{parts:B,formatter:h}});T.setRowSettingsTemplate(g);}}else{if(m.isResponsive){this.oState.alp_ColumnListItem.bindProperty("highlight",{path:"{_tableHighlight>/highlightMode}",formatter:function(){var _=m.isResponsive?this:this._getRow();if(!_){return;}m._applyCSSHighlight(_,false,false);return"None";}});}else{var g=new a({highlight:{path:"{_tableHighlight>/highlightMode}",formatter:function(){return"None";}}});T.setRowSettingsTemplate(g);}}},_applyCSSHighlight:function(r,i,c){if(c===undefined){return;}var d=r.getDomRefs?r.getDomRefs(true):r.getDomRef();if(d&&d.row){d.row.toggleClass("sapSmartTemplatesAnalyticalListPageRowHighlighted",(i&&c)?i:c);}else{r.toggleStyleClass("sapSmartTemplatesAnalyticalListPageRowHighlighted",(i&&c)?i:c);}},_getBindingProperty:function(c,n){if(c.getProperty){return c.getProperty(n);}else{var p=c.oEntityType.property;for(var i=0;i<p.length;i++){if(p[i].name==n){return p[i];}}return null;}},_getPageFilters:function(B){var p=this.oState.oSmartFilterbar.getFilters();for(var i=0;i<p.length;i++){if(p[i].aFilters!==undefined){var f=p[i].aFilters;for(var j=0;j<f.length;j++){var c=f[j];var n=c.sPath;if(!B.getProperty(n)){L.warning("Could not apply filter with name \""+n+"\" as that field does not exist in the entity type");continue;}c.sPath=n;}}else{var c=p[i];var n=c.sPath;if(!B.getProperty(n)){L.warning("Could not apply filter with name \""+n+"\" as that field does not exist in the entity type");continue;}c.sPath=n;}}return p;},_applyParamsToTableAsHighlight:function(u){if(!this.oState){return;}var c=this.oState.chartController.oChart;if(!c){return;}var p=this._getSelParamsFromChart(c);var d=c.getVisibleDimensions();var f=this.oState.oSmartChart._lastSelected;var g=this.oState.oSmartTable.getTable();var h=this._getTableBinding(g);var j=this.oState.chartController._chartInfo.drillStack;if(!h){L.error("No table binding to apply the selection(s) to");return;}var k=[];for(var i=0;i<p.length;i++){var m=p[i];var n={};for(var o in m){if(d.indexOf(o)==-1||!this._getBindingProperty(h,o)){continue;}n[o]=m[o];}k.push(n);}j.forEach(function(q){var o=q.sPath,r={};r[o]=q.oValue1;k.push(r);});var n={};k.forEach(function(q){for(var r in q){if(!n.hasOwnProperty(r)){n[r]=[q[r]];}else{n[r].push(q[r]);}}});this._paramListFiltered=k;this._lastSelected=f;this._paramMap=n;this._updateRows(u);},_setParamMap:function(c){var p=this._getSelParamsFromChart(c);var d=c.getVisibleDimensions();var f=this.oState.chartController._chartInfo.drillStack;var g={};if(!this.oState.oController.getOwnerComponent().getModel("_templPriv").getProperty('/alp/_ignoreChartSelections')){p.forEach(function(o){for(var k in o){if(d.indexOf(k)==-1){continue;}if(!g.hasOwnProperty(k)){g[k]=[o[k]];}else{g[k].push(o[k]);}}});}f.forEach(function(o){if(!g.hasOwnProperty(o.sPath)){g[o.sPath]=[o.oValue1];}else{g[o.sPath].indexOf(o.oValue1)===-1?g[o.sPath].push(o.oValue1):"";}});this._paramMap=g;},_expandByFilter:function(u){if(!this._enableExpandByFilter){return;}var c=this.oState.oSmartTable.getTable();var d=this._getTableBinding(c);if(d&&this._lastBinding!=d){var m=this;d.attachDataReceived(this._onBindingDataReceived,this);d.attachEvent("change",function(j){if(m._expandingProgrammatically){return;}var k=j.getParameter("reason");if(k=="expand"||k=="collapse"){m._inUserChartSelectMode=false;}});this._lastBinding=d;}if(u=="selection"||u=="bindingDataReceived"){this._firstVisibleRelevantEventTS=new Date().getTime();}if(u=="selection"){this._inUserChartSelectMode=true;}if(!this._inUserChartSelectMode){return;}var r=this._getTableRows();for(var i=0;i<r.length;i++){var f=r[i];var g=f.getBindingContext();if(!g){continue;}var h=c.getFirstVisibleRow()+i;if(this._isRowHighlighted(g.getObject())){if(c.isExpanded(h)){continue;}if(!f._bHasChildren){continue;}if(!d.findNode(h)){continue;}this._expandingProgrammatically=true;c.expand(h);this._expandingProgrammatically=false;}else{if(!c.isExpanded(h)){continue;}if(!f._bHasChildren){continue;}if(!d.findNode(h)){continue;}this._expandingProgrammatically=true;c.collapse(h);this._expandingProgrammatically=false;}}this._updateFirstVisibleRow(u);},_updateFirstVisibleRow:function(u){var c=this.oState.oSmartTable.getTable();var d=this._getTableBinding(c);var f=d.getTotalSize();if(f==0||(new Date().getTime()-this._firstVisibleRelevantEventTS)>250){return;}var c=this.oState.oSmartTable.getTable();if(u=="selection"&&(!this._paramListFiltered||this._paramListFiltered.length==0)){c.setFirstVisibleRow(0);return;}var g=d.getContexts(0,f);for(var i=0;i<g.length;i++){var r=g[i].getObject();if(!this._isRowHighlighted(r)){continue;}if(this._lastSelected&&!this._rowMatch(this._lastSelected,r)){continue;}var h=c.getFirstVisibleRow();if(u=="selection"||this.isFilter()){c.setFirstVisibleRow(i);}else{if(i>h){c.setFirstVisibleRow(i);}}break;}},_rowMatch:function(s,r){for(var n in s){if(n.indexOf("__")!=-1){continue;}if(!r.hasOwnProperty(n)){continue;}if(s[n]!=r[n]){return false;}}return true;},_updateExpandLevelInfo:function(g){if(!this._enableUpdateExpandLevelInfo){return false;}var T=this.oState.oSmartTable.getTable();if(!T.getNumberOfExpandedLevels){return false;}var B=T.getBinding();if(!B){return false;}var c=g.length;var d=false;if(c>=B.aMaxAggregationLevel.length){d=true;c=B.aMaxAggregationLevel.length-1;this.wasAtMaxLevel=true;}else{d=T.getNumberOfExpandedLevels()!=c||this.wasAtMaxLevel;this.wasAtMaxLevel=false;}if(d){if(c>=0){T.setNumberOfExpandedLevels(c);T.bindRows(T.getBindingInfo("rows"));}var f=T.getGroupedColumns();T.fireGroup({column:f[0],groupedColumns:f,type:S.GroupEventType.group});}return d;},_updateRows:function(u){var c=this.oState.oSmartTable.getTable();if(c instanceof A){this._expandByFilter(u);}},_getTableRows:function(){var c=this.oState.oSmartTable.getTable();if(c.getRows){return c.getRows();}else{return c.getItems();}},_isRowHighlighted:function(r){var p=this._paramMap;if(!p||jQuery.isEmptyObject(p)){return false;}var m=true;for(var n in p){if(!r.hasOwnProperty(n)){continue;}if(p[n].indexOf(r[n])==-1){m=false;}}return m;},_getTableBinding:function(c){return c.getBinding()?c.getBinding():c.getBinding("items");},_applyChartSelectionOnTableAsFilter:function(o,c){var d=[];if(!c){return;}var p=this._getSelParamsFromChart(c);if(p.length>0){var f=c.getVisibleDimensions();for(var i=0;i<p.length;i++){var g=p[i],h=[];for(var n in g){if(f.indexOf(n)==-1){L.warning("Could not apply filter with name \""+n+"\" as that field does not exist in the entity type");continue;}var k=false;var m=o.mParameters.bindingParams.filters;if(m.length>0){var m=m[0].aFilters?m[0].aFilters:m;for(var j=0;j<m.length;j++){var D=m[j].aFilters?m[j].aFilters:m;if(D.length==1){if(D[0].sPath===n&&D[0].oValue1===g[n]){k=true;}}}}if(!k){h.push(new F({path:n,operator:b.EQ,value1:g[n]}));}}if(h.length>0){d.push(new F(h,true));}}if(d.length>0){o.mParameters.bindingParams.filters.push(new F(d,false));}}},_latestUpdateRow:function(p){var c=this.isFilter();var r=this._getTableRows();var d=false;for(var i=0;i<r.length;i++){var f=r[i];if(!c){if(f.getBindingContext()){var g=f.getBindingContext().getObject();d=this._isRowHighlighted(g);}}var h=f.getDomRefs?f.getDomRefs(true):f.getDomRef();if(!h){continue;}if(h.row){h.row.toggleClass("sapSmartTemplatesAnalyticalListPageRowHighlighted",(c&&p)?c:d);}else{$(h).toggleClass("sapSmartTemplatesAnalyticalListPageRowHighlighted",(c&&p)?c:d);}}},_getSelParamsFromChart:function(c){var d=[];var o=this.oState.chartController._chartInfo;if(o.vizSelection){d=o.chartSelection.dataPoints;}return this._getSelParamsFromDPList(d);},_getSelParamsFromDPList:function(d){if(!d){return[];}var p=[];for(var i=0;i<d.length;i++){var c=d[i];var f=c.context;if(!f){if(c.dimensions){p.push(c.dimensions);}continue;}var g=f.getProperty(f.sPath);var h={};if(this._selectFilterByMeasure){for(var j=0;j<c.measures.length;j++){var n=c.measures[j];var v=g[n];h[n]=v;}}else{for(var n in g){h[n]=g[n];}}p.push(h);}return p;}});return t;});
