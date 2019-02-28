/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2018 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'./library','sap/m/library','sap/ui/core/Control','sap/suite/ui/microchart/InteractiveLineChartPoint','sap/ui/Device','sap/ui/core/ResizeHandler','sap/m/FlexBox',"sap/base/Log"],function(q,l,M,C,I,D,R,F,L){"use strict";var a=C.extend("sap.suite.ui.microchart.InteractiveLineChart",{metadata:{library:"sap.suite.ui.microchart",properties:{displayedPoints:{type:"int",group:"Appearance",defaultValue:6},precedingPoint:{type:"float",group:"Data",defaultValue:0},succeedingPoint:{type:"float",group:"Data",defaultValue:0},selectionEnabled:{type:"boolean",group:"Behavior",defaultValue:true}},defaultAggregation:"points",aggregations:{points:{type:"sap.suite.ui.microchart.InteractiveLineChartPoint",multiple:true,bindable:"bindable"}},events:{selectionChanged:{parameters:{selectedPoints:{type:"sap.suite.ui.microchart.InteractiveLineChartPoint[]"},point:{type:"sap.suite.ui.microchart.InteractiveLineChartPoint"},selected:{type:"boolean"}}},press:{}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}}}});a.MAX_SCALED_CANVAS_VALUE=99;a.MIN_SCALED_CANVAS_VALUE=1;a.AREA_WIDTH_INTERACTIVE_MINVALUE=48;a.AREA_WIDTH_INTERACTIVE_MINVALUE_COMPACT=32;a.CHART_HEIGHT_MINVALUE=106;a.AREA_WIDTH_MINVALUE=24;a.LABEL_WIDTH_MINVALUE=32;a.AREA_WIDTH_SMALLFONT=36;a.prototype.init=function(){this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart");this._aNormalizedValues=[];this._iAreaWidthInteractiveMinValue=a.AREA_WIDTH_INTERACTIVE_MINVALUE;this._bInteractiveMode=true;this._fNormalizedZero=0;this._bThemeApplied=true;if(!sap.ui.getCore().isInitialized()){this._bThemeApplied=false;sap.ui.getCore().attachInit(this._handleCoreInitialized.bind(this));}else{this._handleCoreInitialized();}};a.prototype._handleCoreInitialized=function(){this._bThemeApplied=sap.ui.getCore().isThemeApplied();sap.ui.getCore().attachThemeChanged(this._handleThemeApplied,this);};a.prototype.onBeforeRendering=function(){this._bCompact=this._isCompact();this._bInteractiveMode=true;var p=this.getPoints();this._iVisiblePointsCount=Math.min(this.getDisplayedPoints(),p.length);this._setResponsivenessData();if(!this.data("_parentRenderingContext")&&q.isFunction(this.getParent)){this.data("_parentRenderingContext",this.getParent());}this._updateNormalizedValues();this._deregisterResizeHandler();this._bSemanticTooltip=false;for(var i=0;i<this._iVisiblePointsCount;i++){if(p[i].getColor()!==M.ValueColor.Neutral){this._bSemanticTooltip=true;break;}}};a.prototype.onAfterRendering=function(){this._adjustToParent();l._checkControlIsVisible(this,this._onControlIsVisible);};a.prototype._onControlIsVisible=function(){this._sResizeHandlerId=R.register(this,this._onResize.bind(this));this._onResize();};a.prototype.exit=function(){this._deregisterResizeHandler();};a.prototype.onclick=function(e){if(!this.getSelectionEnabled()){return;}if(this._bInteractiveMode){var i=q(e.target).parent();var h,f=this.$().find(".sapSuiteILCInteractionArea");var b=this.$().find(".sapSuiteILCSection").index(i);if(b>=0){this._toggleSelected(b);h=f.index(this.$().find(".sapSuiteILCInteractionArea[tabindex='0']"));this._switchTabindex(h,b,f);}}else{this.firePress();if(D.browser.msie){this.$().focus();e.preventDefault();}}};a.prototype.onsapleft=function(e){var f=this.$().find(".sapSuiteILCInteractionArea");var i=f.index(e.target);if(f.length>0){this._switchTabindex(i,i-1,f);}e.preventDefault();e.stopImmediatePropagation();};a.prototype.onsapright=function(e){var f=this.$().find(".sapSuiteILCInteractionArea");var i=f.index(e.target);if(f.length>0){this._switchTabindex(i,i+1,f);}e.preventDefault();e.stopImmediatePropagation();};a.prototype.onsapup=a.prototype.onsapleft;a.prototype.onsapdown=a.prototype.onsapright;a.prototype.onsapenter=function(e){if(this._bInteractiveMode){var i=this.$().find(".sapSuiteILCInteractionArea").index(e.target);if(i!==-1){this._toggleSelected(i);}e.preventDefault();e.stopImmediatePropagation();}else{this.firePress();}};a.prototype.onsapspace=a.prototype.onsapenter;a.prototype.onsaphome=function(e){var f=this.$().find(".sapSuiteILCInteractionArea");var i=f.index(e.target);if(i!==0&&f.length>0){this._switchTabindex(i,0,f);}e.preventDefault();e.stopImmediatePropagation();};a.prototype.onsapend=function(e){var f=this.$().find(".sapSuiteILCInteractionArea");var i=f.index(e.target),b=f.length;if(i!==b-1&&b>0){this._switchTabindex(i,b-1,f);}e.preventDefault();e.stopImmediatePropagation();};a.prototype.getTooltip_AsString=function(){var t=this.getTooltip_Text();if(!t){t=this._createTooltipText();}else if(l._isTooltipSuppressed(t)){t=null;}return t;};a.prototype.getSelectedPoints=function(){var s=[],p=this.getAggregation("points");for(var i=0;i<p.length;i++){if(p[i].getSelected()){s.push(p[i]);}}return s;};a.prototype.setSelectedPoints=function(s){var p=this.getAggregation("points"),b;this._deselectAllSelectedPoints();if(!s){return this;}if(s instanceof I){s=[s];}if(Array.isArray(s)){for(var i=0;i<s.length;i++){b=this.indexOfAggregation("points",s[i]);if(b>=0){p[b].setProperty("selected",true,true);}else{L.warning("setSelectedPoints method called with invalid InteractiveLineChartPoint element");}}}this.invalidate();return this;};a.prototype._fnIsNumber=function(v){return typeof v==='number'&&!isNaN(v)&&isFinite(v);};a.prototype._isCompact=function(){return q("body").hasClass("sapUiSizeCompact")||this.$().is(".sapUiSizeCompact")||this.$().closest(".sapUiSizeCompact").length>0;};a.prototype._setResponsivenessData=function(){if(this._bCompact){this._iAreaWidthInteractiveMinValue=a.AREA_WIDTH_INTERACTIVE_MINVALUE_COMPACT;}else{this._iAreaWidthInteractiveMinValue=a.AREA_WIDTH_INTERACTIVE_MINVALUE;}};a.prototype._handleThemeApplied=function(){this._bThemeApplied=true;this._bCompact=this._isCompact();this.invalidate();};a.prototype._deselectAllSelectedPoints=function(){var p=this.getPoints();for(var i=0;i<p.length;i++){if(p[i].getSelected()){p[i].setProperty("selected",false,true);}}};a.prototype._switchTabindex=function(o,n,f){if(o>=0&&o<f.length&&n>=0&&n<f.length){f.eq(o).removeAttr("tabindex");f.eq(n).attr("tabindex","0");f.eq(n).focus();}};a.prototype._toggleSelected=function(i){var p=this.getPoints()[i],s=this.$("point-area-"+i),P=this.$("point-"+i);if(p.getSelected()){s.add(P).removeClass("sapSuiteILCSelected");p.setProperty("selected",false,true);}else{s.add(P).addClass("sapSuiteILCSelected");p.setProperty("selected",true,true);}s.find(".sapSuiteILCInteractionArea").attr("aria-selected",p.getSelected());this.fireSelectionChanged({selectedPoints:this.getSelectedPoints(),point:p,selected:p.getSelected()});};a.prototype._updateNormalizedValues=function(){var p=this.getPoints(),n=p.length,i=0;this.nMax=-Number.MAX_VALUE;this.nMin=Number.MAX_VALUE;this._aNormalizedValues=[];for(i=0;i<n;i++){if(!p[i]._bNullValue){var v=p[i].getValue();this.nMax=Math.max(this.nMax,v);this.nMin=Math.min(this.nMin,v);}}var b=(this.nMax!=-Number.MAX_VALUE&&this.nMin!==Number.MAX_VALUE)?this.nMax-this.nMin:0;var s=function(v){if(typeof v!=="undefined"){var c=(v-this.nMin)/b;return a.MIN_SCALED_CANVAS_VALUE+c*(a.MAX_SCALED_CANVAS_VALUE-a.MIN_SCALED_CANVAS_VALUE);}return null;}.bind(this);for(i=0;i<n;i++){if(p[i]._bNullValue){this._aNormalizedValues.push(0);}else{this._aNormalizedValues.push(b?s(p[i].getValue()):50);}}if(p.length>0){this._fNormalizedPrecedingPoint=this._bIsPrecedingPointSet&&!p[0]._bNullValue?s(this.getPrecedingPoint()):null;this._fNormalizedSucceedingPoint=this._bIsSucceedingPointSet&&!p[p.length-1]._bNullValue?s(this.getSucceedingPoint()):null;}if(this.nMin<0&&this.nMax>0){this._fNormalizedZero=(Math.max(0-this.nMin,0)/b)*100;}else{this._fNormalizedZero=null;}};a.prototype._adjustToParent=function(){if(this.data("_parentRenderingContext")&&this.data("_parentRenderingContext")instanceof F){var p=this.data("_parentRenderingContext").$();var P=parseFloat(p.width())-2;var i=parseFloat(p.height())-2;this.$().outerWidth(P);this.$().outerHeight(i);}};a.prototype._isChartEnabled=function(){return this.getSelectionEnabled()&&this._bInteractiveMode;};a.prototype._switchModeInteractive=function(b){var $=this.$(),s=false;if(b<this._iAreaWidthInteractiveMinValue){if(this._bInteractiveMode){this._bInteractiveMode=false;s=true;$.addClass("sapSuiteILCNonInteractive");if(this.getSelectionEnabled()){var A=$.find(".sapSuiteILCInteractionArea[tabindex='0']");this._iActiveElement=$.find(".sapSuiteILCInteractionArea").index(A);A.removeAttr("tabindex");$.attr("tabindex","0");}$.attr({"role":"button","aria-multiselectable":"false","aria-disabled":!this._isChartEnabled()});}}else if(!this._bInteractiveMode){this._bInteractiveMode=true;s=true;$.removeClass("sapSuiteILCNonInteractive");if(this.getSelectionEnabled()){$.removeAttr("tabindex");if(!this._iActiveElement||this._iActiveElement<0){this._iActiveElement=0;}$.find(".sapSuiteILCInteractionArea").eq(this._iActiveElement).attr("tabindex","0");}$.attr({"role":"listbox","aria-multiselectable":"true","aria-disabled":!this._isChartEnabled()});}if(s){if(this._isChartEnabled()){$.removeAttr("title");this._addInteractionAreaTooltip();}else{$.find(".sapSuiteILCInteractionArea").removeAttr("title");$.attr("title",this.getTooltip_AsString());}}};a.prototype._addInteractionAreaTooltip=function(){var i=this.$().find(".sapSuiteILCInteractionArea"),p=this.getPoints();i.each(function(b,e){q(e).attr("title",p[b].getTooltip_AsString());});};a.prototype._onResize=function(){var b,B=false,$=this.$(),t=$.find(".sapSuiteILCToplabel"),c=$.find(".sapSuiteILCBottomText"),d=$.find(".sapSuiteILCInteractionArea"),e=$.height(),f=$.width(),n=this.getPoints().length,g=$.find(".sapSuiteILCSection:first-child .sapSuiteILCBottomText"),h=$.find(".sapSuiteILCSection:last-child .sapSuiteILCBottomText");if(d.length>0){b=d[0].getBoundingClientRect().width;}if(b<a.AREA_WIDTH_MINVALUE||e<a.CHART_HEIGHT_MINVALUE){$.css("visibility","hidden");return;}else{$.css("visibility","");}this._switchModeInteractive(b);if(b<=a.AREA_WIDTH_SMALLFONT){$.addClass("sapSuiteILCSmallFont");}else{$.removeClass("sapSuiteILCSmallFont");}$.removeClass("sapSuiteILCExpandedLabels");g.add(h).css("width","");for(var i=0;i<n;i++){if(t.eq(i).prop("offsetWidth")<t.eq(i).prop("scrollWidth")){t.eq(i).css("visibility","hidden");}else{t.eq(i).css("visibility","");}if(c.eq(i).prop("offsetWidth")<c.eq(i).prop("scrollWidth")){B=true;}}if(b<a.LABEL_WIDTH_MINVALUE&&B){$.addClass("sapSuiteILCExpandedLabels");g.add(h).css("width",(f/2)-4+"px");}else{$.removeClass("sapSuiteILCExpandedLabels");g.add(h).css("width","");}};a.prototype._deregisterResizeHandler=function(){if(this._sResizeHandlerId){R.deregister(this._sResizeHandlerId);this._sResizeHandlerId=null;}};a.prototype._createTooltipText=function(){var b=true,A,t="",p=this.getPoints();for(var i=0;i<this._iVisiblePointsCount;i++){A=p[i]._getAreaTooltip();if(A){t+=(b?"":"\n")+A;b=false;}}return t;};a.prototype.setPrecedingPoint=function(v){this._bIsPrecedingPointSet=this._fnIsNumber(v);return this.setProperty("precedingPoint",this._bIsPrecedingPointSet?v:NaN);};a.prototype.setSucceedingPoint=function(v){this._bIsSucceedingPointSet=this._fnIsNumber(v);return this.setProperty("succeedingPoint",this._bIsSucceedingPointSet?v:NaN);};return a;});
