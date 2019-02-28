sap.ui.define(["sap/ui/core/mvc/Controller","sap/suite/ui/generic/template/listTemplates/listUtils","sap/base/Log"],function(C,l,L){"use strict";var c=C.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.SmartChartController",{setState:function(s){this.triggeredByTableSort=false;this.tableSortSelection;this._selectFilterByMeasure=false;this.oState=s;s.oSmartChart.attachInitialise(this._onSmartChartInit,this);s.oSmartChart.attachBeforeRebindChart(this._onBeforeRebindChart,this);s.oSmartChart.attachDataReceived(this._onDataReceived,this);},_onBeforeRebindChart:function(E){if(this.triggeredByTableSort&&this.tableSortSelection){var v=this.oState.oSmartChart.fetchVariant();if(this.tableSortSelection.length>0){v.sort={};v.sort.sortItems=[];for(var i=0;i<(this.tableSortSelection.length);i++){E.mParameters.bindingParams.sorter.push(this.tableSortSelection[i]);v.sort.sortItems.push({columnKey:this.tableSortSelection[i].sPath,operation:this.tableSortSelection[i].bDescending?"Descending":"Ascending"});}}else{E.mParameters.bindingParams.sorter=this.tableSortSelection;if(v.sort){delete v.sort;}}this.oState.oSmartChart.applyVariant(v);this.triggeredByTableSort=false;}if(this.oState.oSmartFilterbar&&this.oState.oSmartFilterbar.getAnalyticBindingPath&&this.oState.oSmartFilterbar.getConsiderAnalyticalParameters()){try{var a=this.oState.oSmartFilterbar.getAnalyticBindingPath();if(a){this.oState.oSmartChart.setChartBindingPath(a);}}catch(e){L.warning("Mandatory parameters have no values","","AnalyticalListPage");}}this.oState.oController.onBeforeRebindChartExtension(E);this.oState.oTemplateUtils.oCommonUtils.onBeforeRebindTableOrChart(E,{addExtensionFilters:this.oState.oController.templateBaseExtension.addFilters,isAnalyticalListPage:true},this.oState.oSmartFilterbar);l.handleErrorsOnTableOrChart(this.oState.oTemplateUtils,E);},_onDataReceived:function(e){if(!this.oState.oSmartChart.getToolbar().getEnabled()){this.oState.oContentArea.enableToolbar();}this.oState.oTemplateUtils.oCommonUtils.setEnabledToolbarButtons(e.getSource());},_onSmartChartInit:function(e){var s=this.oState;this.oChart=s.oSmartChart.getChart();this._chartInfo={};this._chartInfo.drillStack=this.oChart.getDrillStack();s.oSmartChart.attachShowOverlay(function(E){s.oSmartChart.getToolbar().setEnabled(!E.getParameter("overlay").show);},this);this.oState.oTemplateUtils.oCommonUtils.setEnabledToolbarButtons(e.getSource());this.oState.oTemplateUtils.oCommonUtils.checkToolbarIntentsSupported(e.getSource());this.oChart.attachSelectData(this._onChartSelectData,this);this.oChart.attachDeselectData(this._onChartDeselectData,this);this.oState.oSmartChart.attachChartDataChanged(this._onPersonalisationDimeasureChange,this);if(this.oState._pendingChartToolbarInit&&this.oState.oSmartTable){if(!this.oState.oSmartFilterableKPI){this.oState.oSmartChart.getToolbar().insertContent(this.oState.alr_viewSwitchButtonOnChart,this.oState.oSmartChart.getToolbar().getContent().length);}}delete this.oState._pendingChartToolbarInit;this._changeValueAxisTitleVisibility();this.oState.oSmartChart.getChart().setVizProperties({"legendGroup":{"layout":{"position":"bottom"}},"categoryAxis":{"layout":{"maxHeight":0.5}}});this.oState.oSmartChart.attachSelectionDetailsActionPress(function(E){var o=E.getSource();var b=E.getParameter("itemContexts")&&E.getParameter("itemContexts")[0];s.oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){if(!b){L.error("Binding context for the selected chart item is missing");return;}if(o.data("CrossNavigation")){s.oTemplateUtils.oCommonEventHandlers.onEditNavigateIntent(o,b,s.oSmartFilterbar,s.oSmartChart.getChart());return;}s.oTemplateUtils.oCommonUtils.navigateFromListItem(b,s.oSmartChart);},jQuery.noop,s);});L.info("Smart Chart Annotation initialized");},_onChartSelectData:function(e){this.oState.oController.getOwnerComponent().getModel("_templPriv").setProperty('/alp/_ignoreChartSelections',(e.getId()==="chartDataChanged"));var a=this.oChart;this._chartInfo.drillStack=a.getDrillStack();var v=a._getVizFrame().vizSelection();if(v){this._chartInfo.vizSelection=v;this._chartInfo.chartSelectionBehavior=this.oChart.getSelectionBehavior();this._chartInfo.chartSelection=this.oState.oTemplateUtils.oCommonUtils.getSelectionPoints(a,this._chartInfo.chartSelectionBehavior);var s=this._chartInfo.chartSelection.dataPoints;this._lastSelected=this._getLastSel(s,this._lastSelectedList);this._lastSelectedList=s;}this._updateTable();this.oState.oTemplateUtils.oCommonUtils.setEnabledToolbarButtons(e.getSource(),this._chartInfo.chartSelectionBehavior,this._chartInfo.chartSelection);},_onPersonalisationDimeasureChange:function(e){var o=e.getParameters().changeTypes;if(o.dimeasure&&!o.filter&&!o.sort){this._onChartSelectData(e);}this._changeValueAxisTitleVisibility();},_getLastSel:function(n,o){var b=this.oChart;var d=this.oState.detailController&&this.oState.detailController._getSelParamsFromDPList(n);var e=this.oState.detailController&&this.oState.detailController._getSelParamsFromDPList(o);if(d){for(var i=0;i<d.length;i++){var f=d[i];var m=false;for(var j=0;j<e.length;j++){var g=e[j];m=true;for(var a in g){if(a.indexOf("__")!=-1){continue;}if(f[a]!=g[a]){m=false;break;}}if(m){break;}}if(!m){var h=b.getVisibleDimensions();var k={};for(var j=0;j<h.length;j++){var p=h[j];k[p]=f[p];}return k;}}}return null;},_onChartDeselectData:function(e){var m=this;this._lastSelected=null;var E=jQuery.extend(true,{},e);setTimeout(function(){var b=m.oChart;if(m._chartInfo.chartSelection.count==0){m._updateTable();}else if(b.getSelectionMode()=="MULTIPLE"){m._onChartSelectData(E);}},1);var a=e.getParameter("oSource");if(a&&a instanceof sap.m.Link&&a.getParent()instanceof sap.m.Breadcrumbs){m._onChartDrilledUp(e);}this.oState.oTemplateUtils.oCommonUtils.setEnabledToolbarButtons(e.getSource());this.oState.oTemplateUtils.oCommonUtils.setEnabledFooterButtons(e.getSource());},_onChartDrilledUp:function(e){this._updateTable();},_onChartDrilledDown:function(e){this._updateTable();},_updateTable:function(){var a=this.oChart;if(!a){return;}var d=[];var v=this._chartInfo.vizSelection;v=v||a._getVizFrame().vizSelection();if(v&&v.length){d=this._chartInfo.chartSelection.dataPoints;}if(!d||d.length==0){this._lastSelected=null;}if(this.oState.detailController){this.oState.detailController.applyParamsToTable();}},_changeValueAxisTitleVisibility:function(e){if(this.oState.oSmartChart.getChart().getChartType().indexOf("dual_")==0){this.oState.oSmartChart.getChart().setVizProperties({"valueAxis":{"title":{"visible":true}}});}else{this.oState.oSmartChart.getChart().setVizProperties({"valueAxis":{"title":{"visible":false}}});}}});return c;});
