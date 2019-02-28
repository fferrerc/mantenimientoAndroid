sap.ui.define(["sap/suite/ui/microchart/InteractiveLineChart","sap/suite/ui/microchart/InteractiveLineChartPoint","sap/ui/model/json/JSONModel","sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/FilterItemMicroChart","sap/suite/ui/generic/template/AnalyticalListPage/util/CriticalityUtil","sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil","sap/base/Log"],function(I,a,J,F,C,b,L){"use strict";var c=F.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroLine",{metadata:{properties:{labelWidthPercent:{type:"float",group:"Misc",defaultValue:1/3},fixedCount:{type:"int",defaultValue:6}},aggregations:{control:{type:"sap.suite.ui.microchart.InteractiveLineChart",multiple:false}}},renderer:{}});c.prototype.init=function(){this._chart=new I({maxDisplayedPoints:6,selectionEnabled:true,points:[]});this.setControl(this._chart);this.setModel(new J(),'__alp_chartJSONModel');this._sorters=[];F.prototype.init.apply(this,arguments);};c.prototype._updateBinding=function(){if(b.isVisualFilterLazyLoaded(this)){return;}this.applyOverlay();this._chart.setBusyIndicatorDelay(0);this._chart.setBusy(true);this._chart.unbindPoints();var e=this.getEntitySet(),d=this.getDimensionField(),f=this.getDimensionFieldDisplay(),m=this.getMeasureField(),u=this.getUnitField(),g=this.getDimensionFilterExternal(),s=[],S=this.getSortOrder(),M=this.getModel(),o=M.getMetaModel(),h=F._getSorter(S);this._sorters=h.sorter;s=h.sortFields;if(!e||!m||!d||!f){return;}if(this._determineHiddenVisualFilter(o,e,m)){this.applyOverlay(this.hiddenMeasureMessage);return;}var i=[m,d],n=b.IsNavigationProperty(this.getModel(),e,f)?f.split("/")[0]:null,N=b.getKeysForNavigationEntitySet(o,this.getEntitySet(),n),i=b.getVisualFilterSelectFields(m,d,f,u,s,N);var j=[];if(g&&g.aFilters&&g.aFilters.length>0){j=[g];}var k=this;var l=this.getFixedCount();var M=this.getModel(),v=this.getModel("visualFilter")||M;var B="/"+e;if(M){var D=C.getDataPoint(M,this);if(D){(D.ValueFormat&&D.ValueFormat.ScaleFactor)?this.setScaleFactor(b.getPrimitiveValue(D.ValueFormat.ScaleFactor)):this.setScaleFactor(null);(D.ValueFormat&&D.ValueFormat.NumberOfFractionalDigits)?this.setNumberOfFractionalDigits(b.getPrimitiveValue(D.ValueFormat.NumberOfFractionalDigits)):this.setNumberOfFractionalDigits(null);var r=C.getCriticalityRefProperties(D);}B=this._getPathForVisualFilter(M,e);if(!B){return;}if(this._oObject){this._oObject.abort();}var U={"$select":r?[r].concat(i).join(","):i.join(","),"$top":l};if(n){jQuery.extend(U,{"$expand":n});}this._oObject=v.read(B,{async:true,filters:j,sorters:this._sorters,urlParameters:U,success:function(p,q){k._oObject=null;p=D?C.CalculateCriticality(D,p,k.getMeasureField()):p;k._onDataReceived(p);},error:function(E){L.error("Error reading URL:"+E);if(E&&E.statusCode!==0&&E.statusText!=="abort"){k.applyOverlay(k.technicalIssueMessage);k._oObject=null;}}});}};c.prototype._onDataReceived=function(d){if(!d||!d.results||!d.results.length){this.applyOverlay(this.noDataIssueMessage);return;}var D=this.getDimensionFieldIsDateTime()?d.results.slice().reverse():d.results;F.prototype._onDataReceived.call(this,d.results);this.getModel('__alp_chartJSONModel').setData(D);this._chart.setModel(this.getModel('__alp_chartJSONModel'));var e=this.getFixedCount(),f={path:'/',template:new a(this._getChartAggregationSettings()),startIndex:0,length:e};this._chart.bindPoints(f);this._chart.setBusy(false);};return c;},true);
