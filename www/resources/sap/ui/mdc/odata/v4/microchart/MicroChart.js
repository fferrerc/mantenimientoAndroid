/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define("sap/ui/mdc/odata/v4/microchart/MicroChart",['sap/base/Log','sap/ui/mdc/XMLComposite','sap/m/library'],function(L,X,m){"use strict";var V=m.ValueColor;var M=X.extend("sap.ui.mdc.odata.v4.microchart.MicroChart",{metadata:{specialSettings:{metadataContexts:{defaultValue:"{ model: 'chartAnnotationModel', path:'',name: 'chartAnnotation'}"}},properties:{title:{type:"any",invalidate:"template"}},events:{},aggregations:{},publicMethods:[]},alias:"this",fragment:"sap.ui.mdc.odata.v4.microchart.MicroChart"});M._helper={getEntitySetPathBinding:function(e,v){return"{/"+v.context.getPath().split("/")[1]+"}";},getDimension:function(o,v){return"{"+v.context.getModel().getProperty(v.context.getPath().replace("MeasureAttributes","Dimensions")+"/$PropertyPath")+"}";},getMicroChartColor:function(d,v){var s=V.Neutral;if(d){if(d.Criticality){s=M._helper._criticality(d,v);}else if(d.CriticalityCalculation){s=M._helper._criticalityCalculation(d,v);}else{L.warning("Returning the default value Neutral");}}return s;},_criticalityCalculation:function(d,v){var c=d.CriticalityCalculation,C=c.ImprovementDirection&&c.ImprovementDirection.$EnumMember,t=typeof c.ToleranceRangeHighValue==='object'?+c.ToleranceRangeHighValue.$Decimal:c.ToleranceRangeHighValue,T=typeof c.ToleranceRangeLowValue==='object'?+c.ToleranceRangeLowValue.$Decimal:c.ToleranceRangeLowValue,D=typeof c.DeviationRangeHighValue==='object'?+c.DeviationRangeHighValue.$Decimal:c.DeviationRangeHighValue,s=typeof c.DeviationRangeLowValue==='object'?+c.DeviationRangeLowValue.$Decimal:c.DeviationRangeLowValue,a=typeof c.AcceptanceRangeHighValue==='object'?+c.AcceptanceRangeHighValue.$Decimal:c.AcceptanceRangeHighValue,A=typeof c.AcceptanceRangeLowValue==='object'?+c.AcceptanceRangeLowValue.$Decimal:c.AcceptanceRangeLowValue,b=V.Neutral;if(C==="com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize"){if(typeof a==='number'&&typeof D==='number'&&typeof t==='number'){b="{= %{"+v.$PropertyPath+"} <= "+a+" ? '"+V.Good+"' : "+"(%{"+v.$PropertyPath+"} <= "+D+" ? "+"(%{"+v.$PropertyPath+"} > "+t+" ? '"+V.Critical+"' : '"+V.Neutral+"') : '"+V.Error+"') }";}else{if(typeof a==='number'&&typeof t==='number'){b="{= %{"+v.$PropertyPath+"} <= "+a+" ? '"+V.Good+"' : "+"%{"+v.$PropertyPath+"}  <= "+t+" ? '"+V.Neutral+"' : '"+V.Critical+"' }";}else if(typeof a==='number'&&typeof D==='number'){b="{= %{"+v.$PropertyPath+"} <= "+a+" ? '"+V.Good+"' : "+"%{"+v.$PropertyPath+"}  <= "+D+" ? '"+V.Neutral+"' : '"+V.Error+"' }";}else if(typeof t==='number'&&typeof D==='number'){b="{= %{"+v.$PropertyPath+"} <= "+t+" ? '"+V.Good+"' : "+"%{"+v.$PropertyPath+"}  <= "+D+" ? '"+V.Critical+"' : '"+V.Error+"' }";}}}else if(C==="com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"){if(typeof s==='number'&&typeof A==='number'&&typeof T==='number'){b="{= %{"+v.$PropertyPath+"} >= "+A+" ? '"+V.Good+"' : "+"(%{"+v.$PropertyPath+"} >= "+s+" ? "+"(%{"+v.$PropertyPath+"} >= "+T+" ? '"+V.Neutral+"' : '"+V.Critical+"') : '"+V.Error+"') }";}else{if(typeof A==='number'&&typeof T==='number'){b="{= %{"+v.$PropertyPath+"} >= "+A+" ? '"+V.Good+"' : "+"%{"+v.$PropertyPath+"}  >= "+T+" ? '"+V.Neutral+"' : '"+V.Critical+"' }";}else if(typeof A==='number'&&typeof s==='number'){b="{= %{"+v.$PropertyPath+"} >= "+A+" ? '"+V.Good+"' : "+"%{"+v.$PropertyPath+"}  >= "+s+" ? '"+V.Neutral+"' : '"+V.Error+"' }";}else if(typeof T==='number'&&typeof s==='number'){b="{= %{"+v.$PropertyPath+"} >= "+T+" ? '"+V.Good+"' : "+"%{"+v.$PropertyPath+"}  >= "+s+" ? '"+V.Critical+"' : '"+V.Error+"' }";}}}else if(C==='com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target'){if(typeof s==='number'&&typeof D==='number'&&typeof T==='number'&&typeof t==='number'&&typeof A==='number'&&typeof a==='number'){b="{= %{"+v.$PropertyPath+"} < "+s+" ? '"+V.Error+"' : "+"(%{"+v.$PropertyPath+"} > "+D+" ? '"+V.Error+"' : "+"(%{"+v.$PropertyPath+"} >= "+T+" && %{"+v.$PropertyPath+"} <= "+t+" ? "+"(%{"+v.$PropertyPath+"} >= "+A+" && %{"+v.$PropertyPath+"} <= "+a+" ? '"+V.Good+"' : '"+V.Neutral+"') : '"+V.Critical+"')) }";}else{if(typeof T==='number'&&typeof t==='number'&&typeof A==='number'&&typeof a==='number'){b="{= %{"+v.$PropertyPath+"} < "+T+" ? '"+V.Critical+"' : "+"(%{"+v.$PropertyPath+"} > "+t+" ? '"+V.Critical+"' : "+"(%{"+v.$PropertyPath+"} >= "+A+" && %{"+v.$PropertyPath+"} <= "+a+" ? '"+V.Good+"' : '"+V.Neutral+"')) }";}if(typeof s==='number'&&typeof D==='number'&&typeof A==='number'&&typeof a==='number'){b="{= %{"+v.$PropertyPath+"} < "+s+" ? '"+V.Error+"' : "+"(%{"+v.$PropertyPath+"} > "+D+" ? '"+V.Error+"' : "+"(%{"+v.$PropertyPath+"} >= "+A+" && %{"+v.$PropertyPath+"} <= "+a+" ? '"+V.Good+"' : '"+V.Neutral+"')) }";}if(typeof s==='number'&&typeof D==='number'&&typeof T==='number'&&typeof t==='number'){b="{= %{"+v.$PropertyPath+"} < "+s+" ? '"+V.Error+"' : "+"(%{"+v.$PropertyPath+"} > "+D+" ? '"+V.Error+"' : "+"(%{"+v.$PropertyPath+"} >= "+T+" && %{"+v.$PropertyPath+"} <= "+t+" ? '"+V.Good+"' : '"+V.Critical+"')) }";}}}else{L.warning("Case not supported, returning the default Value Neutral");}return b;},_criticality:function(d,v){var c=V.Neutral,C=d.Criticality,s;if(C){if(C.$Path){s=C.$Path;c="{= (${"+s+"} === 'Negative' || ${"+s+"} === '1' || ${"+s+"} === 1 ) ? '"+V.Error+"' : "+"(${"+s+"} === 'Critical' || ${"+s+"} === '2' || ${"+s+"} === 2 ) ? '"+V.Critical+"' : "+"(${"+s+"} === 'Positive' || ${"+s+"} === '3' || ${"+s+"} === 3 ) ? '"+V.Good+"' : '"+V.Neutral+"'}";}else if(C.$EnumMember){c=this._getCriticalityFromEnum(C.$EnumMember);}else{L.warning("Case not supported, returning the default Value Neutral");}}else{L.warning("Case not supported, returning the default Value Neutral");}return c;},_getCriticalityFromEnum:function(c){var i;if(c==='com.sap.vocabularies.UI.v1.CriticalityType/Negative'){i=V.Error;}else if(c==='com.sap.vocabularies.UI.v1.CriticalityType/Positive'){i=V.Good;}else if(c==='com.sap.vocabularies.UI.v1.CriticalityType/Critical'){i=V.Critical;}else{i=V.Neutral;}return i;}};return M;},true);
