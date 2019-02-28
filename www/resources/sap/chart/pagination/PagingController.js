/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2018 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/model/Sorter',"sap/ui/thirdparty/jquery"],function(S,q){"use strict";var P=500;function i(b,s,l){var c=b.getContexts(s,l),n;if(c.length===0||c.dataRequested){n=true;}else{n=c.some(function(C){return C===undefined;});}return!n;}var a=function(c){this._mMeasureRange={};this._iRenderedPageNo=-1;this._bUnderPaging=false;this._iMaxPageNo=-1;this._iRemainingRecords=-1;this._iOffset=null;this._oChart=c;this._bInitialized=false;this._aPagingSorters=null;this._bMinMaxQueried=false;this._oColorTracker=c._oColorTracker;var d=this._oChart._getDataset();if(d){d.setRange(0,P*2);}var v=this._oChart._getVizFrame();v.attachEvent("_scroll",a.prototype._scrollHandler.bind(this));};a.prototype.bindingChanged=function(){if(!this._bInitialized||!this._bMinMaxQueried){this.init(true);}else if(this.isUnderPaging()){this.paging(this._scrollRatio);}};a.prototype.reset=function(){this._bInitialized=false;this._iRenderedPageNo=0;this._mMeasureRange={};this._bMinMaxQueried=false;this._oColorTracker.clear();var b=this._oChart.getBinding("data");var d=this._oChart._getDataset();if(!d||!b){return;}var f=this._oChart._prepareFeeds();f._order=f._order.filter(function(F){return F!=="MND"&&this._oChart.getDimensions().map(function(v){return v.getName();}).indexOf(F)>-1;}.bind(this));this._aPagingSorters=null;this._oChart._getVizFrame()._runtimeScales(this._oColorTracker.get(),true);this._oChart._getVizFrame()._readyToRender(false);var l;if(this._oChart.getBindingInfo("data").length){l=Math.min(P*2,this._oChart.getBindingInfo("data").length);}else{l=P*2;}d.setRange(0,l);if(f._order.length){var s=this._oChart._aFeeds._order.map(function(p){return new S(p);});b.sort(s);this._aPagingSorters=s;}d.setPagingOption({bEnabled:false});};a.prototype.getPagingSorters=function(){return this._aPagingSorters;};a.prototype.isUnderPaging=function(){return!!this._bUnderPaging;};a.prototype.init=function(n){this._bInitialized=true;this._bUnderPaging=false;var v=this._oChart._getVizFrame();var d=v.getDataset();var b=d.getBinding("data");if(!b){return;}var t=b instanceof sap.ui.model.analytics.AnalyticalBinding?b.getTotalSize():b.getLength();var p;if(t>=0){if(this._oChart.getBindingInfo("data").length){this._iTotalSize=Math.min(this._oChart.getBindingInfo("data").length,t);}else{this._iTotalSize=t;}if(this._iTotalSize>P*2){this._bUnderPaging=true;this._iMaxPageNo=Math.floor(this._iTotalSize/P)-1;this._iRemainingRecords=this._iTotalSize%P;this._iOffset=null;this._iRenderedPageNo=0;var c=P/this._iTotalSize;p={bEnabled:true,sMode:"reset",thumbRatio:c};d.setRange(0,P);if(n){this._bMinMaxQueried=true;this._queryMinMax(this._oChart,b,function(Q){var m={};q.each(Q,function(M,r){m[M]={min:r.min.value,max:r.max.value};});this._mMeasureRange=m;this._oChart._invalidateBy({source:this._oChart,keys:{vizFrame:true}});this._oChart.setBusy(false);v._readyToRender(i(b,0,P));}.bind(this));}else{v._readyToRender(i(b,0,P));}this._bUnderPaging=true;}else{this._mMeasureRange={};p={bEnabled:false};this._bUnderPaging=false;d.setRange(0,this._iTotalSize);v._readyToRender(i(b,0,this._iTotalSize));}d.setPagingOption(p);}};a.prototype.paging=function(r){var c=Math.floor(this._iTotalSize*r/P);var v=this._oChart._getVizFrame();c=Math.min(c,this._iMaxPageNo);this._iOffset=null;var s=Math.max((c-1)*P,0);var l,d;if(c===0){l=P;d=P;}else if(c===this._iMaxPageNo){l=P*2+this._iRemainingRecords;d=P+this._iRemainingRecords;}else{l=P*2;d=P;}this._iOffset=(this._iTotalSize*r-c*P)/d;if(this._iRenderedPageNo===c){var t={plot:{transform:{translate:{translateByPage:{context:this._middleCtx,offset:this._iOffset}}}}};v._states(t);}else{if(this._pagingTimer){clearTimeout(this._pagingTimer);}var D=v.getDataset();var b=D.getBinding("data");this._pagingTimer=setTimeout(function(){D.setRange(s,l);D.setPagingOption({bEnabled:true,sMode:"update",thumbRatio:null});var e=i(b,s,l);if(e){this._iRenderedPageNo=c;D.invalidate();v._readyToRender(true);v.invalidate();this._oColorTracker.add(v._runtimeScales());v._runtimeScales(this._oColorTracker.get(),true);}else{v._readyToRender(false);}}.bind(this),50);this._sLoadingTimer=this._sLoadingTimer||setTimeout(function(){this._oChart._showLoading(true);}.bind(this),200);}};a.prototype.vizFrameRenderCompleted=function(){if(this._sLoadingTimer){clearTimeout(this._sLoadingTimer);this._sLoadingTimer=null;}this._oChart._showLoading(false);if(!this._bUnderPaging){return;}var v=this._oChart._getVizFrame();var d=v.getDataset();var b=d.getBinding("data");var r=this._iRenderedPageNo;if(r!==0){var m=r*P-1;this._middleCtx=b.getContexts(m,1)[0].getObject();}else{this._middleCtx=null;}if(this._middleCtx||this._iOffset){var t={plot:{transform:{translate:{translateByPage:{context:this._middleCtx,offset:this._iOffset}}}}};v._states(t);}};a.prototype._scrollHandler=function(e){if(this._oChart._isEnablePaging()){this._scrollRatio=e.getParameters().position;this.paging(this._scrollRatio);}};a.prototype._queryMinMax=function(c,b,C){var d=c._getRequiredDimensions().map(function(D){return D.getName();}),m=c._getRequiredMeasures().map(function(g){return g.getName();});var r=m.reduce(function(r,s){r[s]={min:{},max:{}};return r;},{});function e(){var A=m.every(function(s){return r[s].min.requested&&r[s].max.requested;});if(A){C(r);}}function o(s,k,D){r[s][k].requested=true;r[s][k].value=parseFloat(D&&D.results[0][s]);e();}function f(s,k,D){r[s][k].requested=true;r[s][k].error=D;e();}var Q=m.reduce(function(Q,s){return Q.concat({urlParameters:{"$select":d.concat(s).join(","),"$top":1,"$orderby":s+" asc"},success:o.bind(null,s,"min"),error:f.bind(null,s,"min")},{urlParameters:{"$select":d.concat(s).join(","),"$top":1,"$orderby":s+" desc"},success:o.bind(null,s,"max"),error:f.bind(null,s,"max")});},[]);var p=b.getPath(),M=b.getModel();Q.forEach(function(g){M.read(p,g);});return Q;};a.prototype.getMeasureRange=function(){return this._mMeasureRange;};return a;});
