/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['./BaseController','sap/m/library','sap/ui/comp/library','./ChartWrapper','./Util','sap/ui/comp/odata/ChartMetadata'],function(B,M,C,c,U,d){"use strict";var D=B.extend("sap.ui.comp.personalization.DimeasureController",{constructor:function(i,s){B.apply(this,arguments);this.setType(M.P13nPanelType.dimeasure);this.setItemType(M.P13nPanelType.dimeasure+"Items");},metadata:{events:{afterDimeasureModelDataChange:{}}}});D.prototype.setTable=function(t){B.prototype.setTable.apply(this,arguments);if(this.getTableType()!==C.personalization.TableType.ChartWrapper){throw"The provided object is incorrect. 'oTable' has to be an instance of sap.ui.comp.personalization.ChartWrapper. ";}var o=t.getChartObject();o.detachDrilledDown(this._onDrilledDown,this);o.attachDrilledDown(this._onDrilledDown,this);o.detachDrilledUp(this._onDrilledUp,this);o.attachDrilledUp(this._onDrilledUp,this);this._monkeyPatchTable(o);};D.prototype._monkeyPatchTable=function(o){var t=this;var s=o.setChartType.bind(o);var S=function(a){s(a);t._onSetChartType(a);};if(o.setChartType.toString()===S.toString()){return;}o.setChartType=S;};D.prototype._onSetChartType=function(s){var o=this.getControlData();if(!s||s===o.dimeasure.chartTypeKey){return;}this.fireBeforePotentialTableChange();o.dimeasure.chartTypeKey=s;this.updateControlDataBaseFromJson(o);this.fireAfterPotentialTableChange();this.fireAfterDimeasureModelDataChange();};D.prototype._onDrilledDown=function(e){this.fireBeforePotentialTableChange();this._addVisibleDimensions(e.getParameter("dimensions")||[]);this.fireAfterPotentialTableChange();this.fireAfterDimeasureModelDataChange();};D.prototype._addVisibleDimensions=function(a){if(!a.length){return;}var o=this.getControlData();var s=o.dimeasure.dimeasureItems.filter(function(m){return m.visible&&m.aggregationRole===C.personalization.AggregationRole.Dimension&&a.indexOf(m.columnKey)<0;}).reduce(function(b,m){return m.columnKey;},"");a.forEach(function(b){var i=U.getIndexByKey("columnKey",s,o.dimeasure.dimeasureItems)+1;var I=U.getIndexByKey("columnKey",b,o.dimeasure.dimeasureItems);s=b;if(I<0||i<0||I>o.dimeasure.dimeasureItems.length-1||i>o.dimeasure.dimeasureItems.length-1){return;}var m=o.dimeasure.dimeasureItems.splice(I,1);m[0].visible=true;o.dimeasure.dimeasureItems.splice(i,0,m[0]);var e=-1;o.dimeasure.dimeasureItems.forEach(function(f){if(f.index!==undefined){f.index=++e;}});this.updateControlDataBaseFromJson(o);},this);};D.prototype._onDrilledUp=function(e){this.fireBeforePotentialTableChange();var o=this.getControlData();var i=e.getParameter("dimensions")||[];i.forEach(function(s){var m=U.getArrayElementByKey("columnKey",s,o.dimeasure.dimeasureItems);if(!m){throw"No entry found in 'controlDataBase' for columnKey '"+s+"'";}m.visible=false;this.updateControlDataBaseFromJson(o);},this);this.fireAfterPotentialTableChange();this.fireAfterDimeasureModelDataChange();};D.prototype.getColumn2Json=function(o,s,i){if(!U.isAggregatable(o)){return null;}return{columnKey:s,index:i,visible:o.getVisible(),role:o.getRole(),aggregationRole:o.getAggregationRole()};};D.prototype.getAdditionalData2Json=function(j,t){var o=t.getChartObject();j.dimeasure.chartTypeKey=o.getChartType();};D.prototype.getColumn2JsonTransient=function(o,s,t,T){if(!U.isAggregatable(o)){return null;}return{columnKey:s,text:t,tooltip:T,aggregationRole:o.getAggregationRole()};};D.prototype.handleIgnore=function(j,i){j.dimeasure.dimeasureItems[i].visible=false;};D.prototype.syncJson2Table=function(j){var o=this.getTable().getChartObject();var u=function(b,s,S,g){var e=U.copy(b);e.sort(D._sortByIndex);var f=[];e.forEach(function(h){if(h.visible===true){f.push(h.columnKey);var i=g(h.columnKey);if(i){i.setRole(h.role);}}});if(JSON.stringify(f)!==JSON.stringify(s)){S(f);}};this.fireBeforePotentialTableChange();var a=j.dimeasure.dimeasureItems.filter(function(b){return b.aggregationRole===C.personalization.AggregationRole.Dimension;});var m=j.dimeasure.dimeasureItems.filter(function(b){return b.aggregationRole===C.personalization.AggregationRole.Measure;});var v=o.getVisibleDimensions();u(a,v,o.setVisibleDimensions.bind(o),o.getDimensionByName.bind(o));var V=o.getVisibleMeasures();u(m,V,o.setVisibleMeasures.bind(o),o.getMeasureByName.bind(o));o.setChartType(j.dimeasure.chartTypeKey);this.fireAfterPotentialTableChange();};D.prototype.getDataSuiteFormat2Json=function(o){var j=this.createControlDataStructure();var a=function(s,p,P){var i=U.getIndexByKey("columnKey",s,j.dimeasure.dimeasureItems);if(i<0){i=j.dimeasure.dimeasureItems.length;j.dimeasure.dimeasureItems.splice(i,0,{columnKey:s});}j.dimeasure.dimeasureItems[i][p]=P;};this.getControlDataInitial().dimeasure.dimeasureItems.filter(function(m){return m.visible===true;}).forEach(function(m){a(m.columnKey,"visible",false);});if(o.Visualizations&&o.Visualizations.length){var b=o.Visualizations.filter(function(V){return V.Type==="Chart";});if(b.length){var v=0;if(b[0].Content.Dimensions.length){v=b[0].Content.Dimensions.length;b[0].Content.Dimensions.forEach(function(n,i){var A=U.getArrayElementByKey("Dimension",n,b[0].Content.DimensionAttributes);a(n,"visible",true);a(n,"index",i);if(A&&A.Role){a(n,"role",d.getDimensionRole(A.Role));}a(n,"aggregationRole",C.personalization.AggregationRole.Dimension);},this);}if(b[0].Content.Measures.length){b[0].Content.Measures.forEach(function(n,i){var A=U.getArrayElementByKey("Measure",n,b[0].Content.MeasureAttributes);a(n,"visible",true);a(n,"index",v+i);if(A&&A.Role){a(n,"role",d.getMeasureRole(A.Role));}a(n,"aggregationRole",C.personalization.AggregationRole.Measure);},this);}}j.dimeasure.chartTypeKey=d.getChartType(b[0].Content.ChartType);}return j;};D.prototype.getDataSuiteFormatSnapshot=function(o){var a=this.getUnionData(this.getControlDataInitial(),this.getControlData());if(!a.dimeasure||!a.dimeasure.dimeasureItems||!a.dimeasure.dimeasureItems.length){return;}var b=a.dimeasure.dimeasureItems.filter(function(e){return e.aggregationRole===C.personalization.AggregationRole.Dimension;}).filter(function(e){return e.visible===true;});var m=a.dimeasure.dimeasureItems.filter(function(e){return e.aggregationRole===C.personalization.AggregationRole.Measure;}).filter(function(e){return e.visible===true;});if(b.length||m.length){if(!o.Visualizations){o.Visualizations=[];}o.Visualizations.push({Type:"Chart",Content:{ChartType:d.getAnnotationChartType(a.dimeasure.chartTypeKey),Dimensions:b.map(function(e){return e.columnKey;}),DimensionAttributes:b.map(function(e){return{Dimension:e.columnKey,Role:d.getAnnotationDimensionRole(e.role)};}),Measures:m.map(function(e){return e.columnKey;}),MeasureAttributes:m.map(function(e){return{Measure:e.columnKey,Role:d.getAnnotationMeasureRole(e.role)};})}});}};D.prototype.getPanel=function(p){if(!U.hasAggregatableColumns(this.getColumnMap())){return null;}var a=(p&&p.availableChartTypes)?p.availableChartTypes:[];return new Promise(function(r){sap.ui.require(['sap/m/P13nDimMeasurePanel','sap/m/P13nItem','sap/m/P13nDimMeasureItem'],function(P,b,e){return r(new P({availableChartTypes:a,chartTypeKey:"{$sapmP13nPanel>/controlDataReduce/dimeasure/chartTypeKey}",items:{path:'$sapmP13nPanel>/transientData/dimeasure/dimeasureItems',template:new b({columnKey:'{$sapmP13nPanel>columnKey}',text:'{$sapmP13nPanel>text}',tooltip:'{$sapmP13nPanel>tooltip}',aggregationRole:'{$sapmP13nPanel>aggregationRole}'})},dimMeasureItems:{path:"$sapmP13nPanel>/controlDataReduce/dimeasure/dimeasureItems",template:new e({columnKey:"{$sapmP13nPanel>columnKey}",index:"{$sapmP13nPanel>index}",visible:"{$sapmP13nPanel>visible}",role:"{$sapmP13nPanel>role}"})},beforeNavigationTo:this.setModelFunction(),changeChartType:function(E){var o=this.getControlDataReduce();o.dimeasure.chartTypeKey=E.getParameter("chartTypeKey");this.setControlDataReduce2Model(o);this.fireAfterPotentialModelChange({json:o});}.bind(this),changeDimMeasureItems:function(E){if(!E.getParameter("items")){return;}var i=E.getParameter("items");var o=this.getControlDataReduce();o.dimeasure.dimeasureItems.forEach(function(m){var f=U.getArrayElementByKey("columnKey",m.columnKey,i);if(!f){return;}m.index=f.index;m.visible=f.visible;m.role=f.role;});this.setControlDataReduce2Model(o);this.fireAfterPotentialModelChange({json:o});}.bind(this)}));}.bind(this));}.bind(this));};D.prototype._isDimMeasureItemEqual=function(o,a){if(!o&&!a){return true;}if(o&&!a){if(o.index===-1&&o.visible===false){return true;}return false;}if(a&&!o){if(a.index===-1&&a.visible===false){return true;}return false;}for(var p in o){if(a[p]===undefined||o[p]!==a[p]){return false;}}return true;};D.prototype._isSemanticEqual=function(p,P){if(p.dimeasure.chartTypeKey!==P.dimeasure.chartTypeKey){return false;}var s=function(a,b){if(a.visible===true&&(b.visible===false||b.visible===undefined)){return-1;}else if((a.visible===false||a.visible===undefined)&&b.visible===true){return 1;}else if(a.visible===true&&b.visible===true){if(a.index<b.index){return-1;}else if(a.index>b.index){return 1;}else{return 0;}}else if((a.visible===false||a.visible===undefined)&&(b.visible===false||b.visible===undefined)){if(a.columnKey<b.columnKey){return-1;}else if(a.columnKey>b.columnKey){return 1;}else{return 0;}}};var e=U.copy(p.dimeasure.dimeasureItems).sort(s);var f=U.copy(P.dimeasure.dimeasureItems).sort(s);var i=true;e.some(function(o,I){if(!this._isDimMeasureItemEqual(o,f[I])){i=false;return true;}},this);return i;};D.prototype.getChangeType=function(p,P){if(!P||!P.dimeasure||!P.dimeasure.dimeasureItems){return C.personalization.ChangeType.Unchanged;}return this._isSemanticEqual(p,P)?C.personalization.ChangeType.Unchanged:C.personalization.ChangeType.TableChanged;};D.prototype.getChangeData=function(p,P){if(!p||!p.dimeasure||!p.dimeasure.dimeasureItems){return this.createControlDataStructure();}if(!P||!P.dimeasure||!P.dimeasure.dimeasureItems){return{chartTypeKey:p.dimeasure.chartTypeKey,dimeasure:U.copy(p.dimeasure)};}if(!this._isSemanticEqual(p,P)){return{chartTypeKey:p.dimeasure.chartTypeKey,dimeasure:U.copy(p.dimeasure)};}return null;};D.prototype.getUnionData=function(j,J){if(!J||!J.dimeasure||!J.dimeasure.dimeasureItems){return U.copy(j);}var u=U.copy(J);Object.keys(j.dimeasure).forEach(function(a){if(Array.isArray(j.dimeasure[a])){j.dimeasure[a].forEach(function(m){var o=U.getArrayElementByKey("columnKey",m.columnKey,u.dimeasure[a]);if(!o){u.dimeasure[a].push(m);return;}if(o.visible===undefined&&m.visible!==undefined){o.visible=m.visible;}if(o.role===undefined&&m.role!==undefined){o.role=m.role;}if(o.index===undefined&&m.index!==undefined){o.index=m.index;}if(o.aggregationRole===undefined&&m.aggregationRole!==undefined){o.aggregationRole=m.aggregationRole;}});return;}if(u.dimeasure[a]===undefined&&j.dimeasure[a]!==undefined){u.dimeasure[a]=j.dimeasure[a];}},this);return u;};D._sortByIndex=function(a,b){if(a.index!==undefined&&b.index===undefined){return-1;}if(b.index!==undefined&&a.index===undefined){return 1;}if(a.index<b.index){return-1;}if(a.index>b.index){return 1;}return 0;};D.prototype.isChartConsistent=function(o){var t=this.getTable();if(!t){return true;}var a=t.getChartObject();if(!a){return true;}sap.ui.getCore().loadLibrary("sap.chart");try{var r=sap.chart.api.getChartTypeLayout(o.dimeasure.chartTypeKey,a.getDimensions(),a.getMeasures());return r.errors.length===0;}catch(e){return false;}};D.prototype.exit=function(){B.prototype.exit.apply(this,arguments);var t=this.getTable();if(t){var o=t.getChartObject();if(o){o.detachDrilledDown(this._onDrilledDown,this);o.detachDrilledUp(this._onDrilledUp,this);}}};return D;},true);
