/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2018 SAP SE. All rights reserved
 */
sap.ui.define(['sap/chart/coloring/ColoringUtils','sap/chart/coloring/ColorPalette','sap/chart/data/MeasureSemantics','sap/chart/coloring/CriticalityType','sap/chart/ChartLog','sap/chart/ColoringType','sap/chart/coloring/criticality/Criticality','sap/chart/utils/ChartUtils',"sap/ui/thirdparty/jquery"],function(C,c,M,d,f,g,h,j,q){"use strict";var k=['sapUiChartPaletteQualitativeHue1','sapUiChartPaletteQualitativeHue2','sapUiChartPaletteQualitativeHue3','sapUiChartPaletteQualitativeHue4','sapUiChartPaletteQualitativeHue5','sapUiChartPaletteQualitativeHue6','sapUiChartPaletteQualitativeHue7','sapUiChartPaletteQualitativeHue8','sapUiChartPaletteQualitativeHue9','sapUiChartPaletteQualitativeHue10','sapUiChartPaletteQualitativeHue11','sapUiChartPaletteQualitativeHue12','sapUiChartPaletteQualitativeHue13','sapUiChartPaletteQualitativeHue14','sapUiChartPaletteQualitativeHue15','sapUiChartPaletteQualitativeHue16','sapUiChartPaletteQualitativeHue17','sapUiChartPaletteQualitativeHue18','sapUiChartPaletteQualitativeHue19','sapUiChartPaletteQualitativeHue20','sapUiChartPaletteQualitativeHue21','sapUiChartPaletteQualitativeHue22'],D=[['sapUiChartPaletteSequentialHue1','sapUiChartPaletteSequentialHue1Light2','sapUiChartPaletteSequentialHue1Dark1'],['sapUiChartPaletteSequentialHue2','sapUiChartPaletteSequentialHue2Light2','sapUiChartPaletteSequentialHue2Dark1']],S='sapUiChartPaletteSequentialNeutralDark2',l='sapUiChartPaletteSemanticNeutral',L={actual:'solid',projected:'dash',reference:'dot'},P={projected:'diagonalLightStripe',reference:'noFill'};var m=[d.Positive,d.Neutral,d.Critical,d.Negative];function r(a){var R={};if(a.getSemanticallyRelatedMeasures){var b=a.getSemanticallyRelatedMeasures();if(b){if(b.projectedValueMeasure){R.projected=b.projectedValueMeasure;}if(b.referenceValueMeasure){R.reference=b.referenceValueMeasure;}return R;}}return R;}function n(a,I){var b=a.reduce(function(b,e){b[e.getName()]={msr:e,sem:(e.getSemantics&&e.getSemantics())||"actual",rel:r(e)};return b;},{});q.each(b,function(x,y){if(y.sem==="actual"){q.each(y.rel,function(G,T){if(b[T]&&b[T].sem!==G){delete y.rel[G];var H=new f("error","Semantic Pattern",T+" shouldn't be used as "+G+" in semantic relation. ");H.display();}});}});if(I){for(var i=0;i<I.length;i++){var e=I[i];var R=r(e);if(R.projected&&R.reference&&b[R.projected]&&b[R.reference]){b[R.projected]={msr:e,sem:'projected',rel:{reference:R.reference}};}}}return b;}function o(e,i,x){var T=[],y=0,G;var H;if(!x){H=e.slice().sort(function(a,b){var I=i[a.getName()].sem,J=i[b.getName()].sem;if(I<J){return-1;}else if(I>J){return 1;}else{return e.indexOf(a)-e.indexOf(b);}});}else{H=q.extend(true,{},e);}q.each(H,function(a,b){var N=b.getName();if(!i[N]){return;}var I=i[N];var J={};var K;J[x?'actual':I.sem]=N;if(b.getLabel){K=b.getLabel();if(K){J.labels={};J.labels[I.sem]=K;}}J.index=y++;if(!x&&(I.sem==="actual"||I.sem==="projected")){if(I.rel.projected){if(i[I.rel.projected]){J.projected=I.rel.projected;if(i[I.rel.projected].msr.getLabel){K=i[I.rel.projected].msr.getLabel();if(K){J.labels=q.extend(true,J.labels,{projected:K});}}delete i[I.rel.projected];}else{G=new f('error','Semantic Pattern',I.msr.getName()+' has an invalid projected semantic relation.');G.display();}}if(I.rel.reference){if(i[I.rel.reference]){J.reference=I.rel.reference;if(i[I.rel.reference].msr.getLabel){K=i[I.rel.reference].msr.getLabel();if(K){J.labels=q.extend(true,J.labels,{reference:K});}}delete i[I.rel.reference];}else{G=new f('error','Semantic Pattern',I.msr.getName()+' has an invalid reference semantic relation.');G.display();}}delete i[N];}J.order=[M.Actual,M.Projected,M.Reference];T.push(J);});return T;}var p=function(a,b){if(!a.dataPointStyle){a=q.extend(true,a,{"dataPointStyle":{"rules":[],others:null}});}a.dataPointStyle.rules.push(b);};var s=function(a,i,b){var e,x;if(a.indexOf('dual')===-1){x=k;e=k.length;}else{var y=(b==='valueAxis')?0:1;x=D[y];e=x.length;}return{actual:x[i%e],projected:x[i%e],reference:x[i%e]};};var t=function(T,a,b){if(T.projectedValueStartTime&&T.timeAxis&&a!==M.Reference){b=b||function(){return true;};var i=function(e){return e.hasOwnProperty(T.semanticMsrName);};if(a===M.Actual){return function(e){return b(e)&&i(e)&&(new Date(e[T.timeAxis]).getTime()<T.projectedValueStartTime);};}else if(a===M.Projected){return function(e){return b(e)&&i(e)&&(new Date(e[T.timeAxis]).getTime()>=T.projectedValueStartTime);};}}else{b=b||function(e){return e.hasOwnProperty(T[a]);};return b;}};var u=function(T,a,b,e){var i,x;if(a){if(T.iUnMentionedIndex==undefined){x=l;}else{i=C.assignUnmentionedColor(c.CRITICALITY.Neutral,e.unMentionedTuplesNumber);x=i[T.iUnMentionedIndex];}}else{if(b===M.Reference&&e.hasSingleReference){x=S;}else{i=s(e.chartType,T.index,T.valueAxisID);x=i[b];}}return x;};var v=function(a,T,b){var i=false;if(a.chartType.indexOf('combination')>-1){if(a.chartType.indexOf('timeseries')>-1){if(T.index!==0||T.valueAxisID!=='valueAxis'){i=true;}else{if(T.hasOwnProperty('actual')){if((!T.projectedValueStartTime&&b!=='actual')||b==='reference'){i=true;}}}}else{if(b!=='actual'){i=true;}}}return i;};var w=function(T,a,b,e,i){var x,y,G={},H;var I=T[b];var J;(a||[]).forEach(function(U){if(U.parsed.msr&&U.parsed.msr.getName()===I){y=U.parsed;J=U.type;}});var K=(T.labels&&T.labels[b])?T.labels[b]:I;if(T.semanticMsrName&&(b===M.Actual||b===M.Projected)){G[T.semanticMsrName]=K;}if(y){var N=m,O,Q=0;if(a.Levels){N=a.Levels;O=c.GRADATION.SingleColorScheme[a.SingleColorScheme];Q=N.length;}N.forEach(function(U,V){var W=y.callbacks[U];if(W){var R=t(T,b,W[0]);var X=C.assignColor(O||c.CRITICALITY[U],Q||W.length);if(a.Saturation==='DarkToLight'){X=X.reverse();}x=X[Q===0?0:V];H={"color":x,"pattern":P[b]};if(j.CONFIG.lineChartType.indexOf(i.chartType)>-1){H.lineType=L[b];if(J==='Static'||J==='DelineatedMeasures'){H.lineColor=x;}}if(v(i,T,b)){if(b==='projected'){H.pattern='';}H.lineType=L[b];if(J==='Static'){H.lineColor=x;}}p(e,{"callback":R,"properties":H,"displayName":y.legend[U],"dataName":G});}});}else{if(!a||a.bShowUnmentionedMsr){var R=t(T,b);x=u(T,a,b,i);H={'color':x,"pattern":P[b]};if(j.CONFIG.lineChartType.indexOf(i.chartType)>-1){H.lineType=L[b];H.lineColor=x;}if(v(i,T,b)){if(b==='projected'){H.pattern='';}H.lineType=L[b];H.lineColor=x;}p(e,{"callback":R,"properties":H,"displayName":K,"dataName":G});}}};var z=function(a){return a.reference&&(!(a.actual||a.projected));};var A=function(T,a,b,e){var i=(T.filter(function(x){return x.reference;}).length===1);var U=T.filter(function(x){return x.hasOwnProperty('iUnMentionedIndex');}).length;T.forEach(function(x){x.order.forEach(function(y){var N=true;if(e.indexOf('bullet')>-1){N=(y!==M.Reference||z(x));}if(x.hasOwnProperty(y)&&N){var G={chartType:e,hasSingleReference:i,unMentionedTuplesNumber:U};w(x,a,y,b,G);}});});};var B=function(a,b,i,x,y,G){i=i||{};var H=(i.type===g.Criticality&&i.subType==="MeasureValues"&&!(i.qualifiedSettings&&i.qualifiedSettings.bMBC));var I=i.type===g.Gradation&&i.subType==="DelineatedMeasures";var J={};if(!y){J.plotArea={dataPointStyle:null};}if(!G){J.legend={title:{text:null,visible:a.indexOf('waterfall')>-1?true:false}};}else{J.legend={};}var K,N=true;if((x&&E(b))||H||I){var O=H||I?i.qualifiedSettings:null;A(b,O,J.plotArea,a);q.extend(true,J.legend,h.getLegendProps(O));}else if(i.ruleGenerator){try{var Q=i.ruleGenerator();q.extend(true,J,Q.properties);K=Q.colorScale;}catch(e){if(e instanceof f){e.display();}else{throw e;}}}if(K){N=false;}return{properties:J,scales:K?[K]:[],replaceColorScales:N};};function E(T){if(T){return T.some(function(a){return a.hasOwnProperty(M.Projected)||a.hasOwnProperty(M.Reference);});}return false;}function F(a,b){var e;var G;if(a){G=a.slice(0);G.sort(function(x,y){return x.index>y.index?1:-1;});}if(b.indexOf('combination')>-1&&a){var I=true;for(var i=0;i<G.length;i++){if(G[i].hasOwnProperty('projected')||G[i].hasOwnProperty('reference')){I=false;break;}}var H=[];var J=[];if(!I){G.forEach(function(T){T.order.forEach(function(x){if(T.hasOwnProperty(x)){if(T.valueAxisID==='valueAxis'){H.push((x==='actual')?"bar":"line");}else{J.push((x==='actual')?"bar":"line");}}});});}else{return;}e={'plotArea':{'dataShape':{'primaryAxis':H,'secondaryAxis':J}}};}return e;}return{getTuples:function(a,i,b){return o(a,n(a,i),b);},getSemanticVizSettings:B,hasSemanticRelation:E,getSemanticSettingsForCombination:F};});
