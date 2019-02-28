/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define("sap/suite/ui/commons/TimelineRenderManager",["sap/ui/thirdparty/jquery","./library","sap/m/Text","sap/ui/core/Icon","sap/m/ViewSettingsDialog","sap/ui/core/ResizeHandler","sap/ui/core/Item","sap/m/ButtonType","sap/m/ToolbarSpacer","sap/m/SearchField","sap/m/OverflowToolbar","sap/m/Select","sap/m/RangeSlider","sap/m/Label","sap/m/Panel","sap/m/FlexBox","sap/m/OverflowToolbarButton","sap/m/MessageStrip","sap/ui/core/CSSSize","sap/m/ViewSettingsFilterItem","sap/m/ViewSettingsCustomItem","sap/m/OverflowToolbarLayoutData","sap/m/OverflowToolbarPriority","sap/m/MessageToast","sap/ui/core/InvisibleText","sap/m/SliderTooltip","sap/suite/ui/commons/TimelineRenderManagerTimestamp","sap/suite/ui/commons/util/StringSliderTooltip","sap/m/ResponsiveScale"],function(q,l,T,I,V,R,a,B,b,S,O,c,d,L,P,F,e,M,C,f,g,h,k,m,n,o,p,r,s){"use strict";var t=l.TimelineGroupType;var u=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");var v=680;var D=Object.freeze({UP:"UP",DOWN:"DOWN",NONE:"NONE"});function w($,i,j){$.removeClass(i).addClass(j);}function _($,A){return parseInt($.css(A).replace("px",""),10);}var x={extendTimeline:function(y){y.prototype._initControls=function(){this._setupMessageStrip();this._setupFilterDialog();this._setupHeaderToolbar();this._setupAccessibilityItems();};y.prototype._registerResizeListener=function(){var i=this.$().parent().get(0);if(i){this.oResizeListener=R.register(i,q.proxy(this._performResizeChanges,this));}};y.prototype._deregisterResizeListener=function(){if(this.oResizeListener){R.deregister(this.oResizeListener);}};y.prototype._performUiChanges=function(i){this._deregisterResizeListener();if(!this.getDomRef()){return;}if(this._isVertical()){this._performUiChangesV(i);}else{this._performUiChangesH();}this._setupScrollers();this._startItemNavigation();this._registerResizeListener();};y.prototype._performDoubleSidedChangesLi=function($,i){var j=$.children().first(),z=this._isLeftAlignment()?"sapSuiteUiCommonsTimelineItemWrapperVLeft":"sapSuiteUiCommonsTimelineItemWrapperVRight";if(this._renderDblSided){if($.hasClass('sapSuiteUiCommonsTimelineItem')){$.removeClass('sapSuiteUiCommonsTimelineItem').addClass(i?"sapSuiteUiCommonsTimelineItemOdd":"sapSuiteUiCommonsTimelineItemEven");if(!i){w(j,"sapSuiteUiCommonsTimelineItemWrapperVLeft","sapSuiteUiCommonsTimelineItemWrapperVRight");}else{w(j,"sapSuiteUiCommonsTimelineItemWrapperVRight","sapSuiteUiCommonsTimelineItemWrapperVLeft");}}}else{$.removeClass("sapSuiteUiCommonsTimelineItemOdd").removeClass("sapSuiteUiCommonsTimelineItemEven").addClass("sapSuiteUiCommonsTimelineItem");j.removeClass("sapSuiteUiCommonsTimelineItemWrapperVLeft").removeClass("sapSuiteUiCommonsTimelineItemWrapperVRight").addClass(z);}};y.prototype._performDoubleSidedChanges=function(){var $=this.$(),z=$.find('.sapSuiteUiCommonsTimelineItemUlWrapper').not(".sapSuiteUiCommonsTimelineShowMoreWrapper"),A=$.find(".sapSuiteUiCommonsTimelineScrollV .sapSuiteUiCommonsTimelineGroupHeader"),E;if(this._renderDblSided){this._$content.addClass("sapSuiteUiCommonsTimelineDblSided");A.addClass("sapSuiteUiCommonsTimelineGroupHeaderDblSided");A.addClass("sapSuiteUiCommonsTimelineItemWrapperVLeft").removeClass("sapSuiteUiCommonsTimelineItemWrapperVRight");}else{this._$content.removeClass("sapSuiteUiCommonsTimelineDblSided");A.removeClass("sapSuiteUiCommonsTimelineGroupHeaderDblSided sapSuiteUiCommonsTimelineItemWrapperVLeft");A.addClass(this._isLeftAlignment()?"sapSuiteUiCommonsTimelineItemWrapperVLeft":"sapSuiteUiCommonsTimelineItemWrapperVRight");}for(var j=0;j<z.length;j++){var G=q(z[j]),H=G.find('> li').not(".sapSuiteUiCommonsTimelineGroupHeader");H.eq(1).css("margin-top",this._renderDblSided?"40px":"auto");for(var i=0;i<H.length;i++){E=q(H[i]);this._performDoubleSidedChangesLi(E,(i%2)===0);}}$.find(".sapSuiteUiCommonsTimelineItemBarV").css("height","");$.find(".sapSuiteUiCommonsTimelineItem").css("margin-bottom","");};y.prototype._performUiChangesH=function(){var $=this.$(),i,j;var z=function(A){return($.width()-(A.position().left+A.outerWidth()));};if(this.getEnableDoubleSided()&&this._isGrouped()){j=$.find(".sapSuiteUiCommonsTimelineHorizontalBottomLine ul");$.find("[firstgroupevenitem = true]:visible").each(function(A,E){var G=function(X){return X+"-"+(this._bRtlMode?"right":"left");}.bind(this),H=q("#"+E.id+"-line"),J=this._bRtlMode?z(H):H.position().left,K=30,N=q(E),Q=_(j,G("padding")),U,W;if(A===0){U=J-K-Q;}else{i=N.prevAll(".sapSuiteUiCommonsTimelineItemLiWrapperV:visible:first");W=this._bRtlMode?z(i):(i.position().left+_(i,G("margin")));U=(J-K)-(W+i.outerWidth());}N.css(G("margin"),U+"px");}.bind(this));}if(!this.getEnableScroll()){$.find(".sapSuiteUiCommonsTimelineContentsH").css("overflow-x","hidden");}this._calculateTextHeight();};y.prototype._performUiChangesV=function(i){var $=this.$(),j=$.outerWidth()+50;if(this.getEnableDoubleSided()){this._renderDblSided=j>=v;if(this._renderDblSided!==this._lastStateDblSided||i){this._performDoubleSidedChanges();}this._lastStateDblSided=this._renderDblSided;}this._calculateTextHeight();this._calculateHeightV();};y.prototype._calculateHeightV=function(){var $=this.$(),j=this.$("headerBar").outerHeight()||0,z=this.$("filterMessage").outerHeight()||0,A=this.$("messageStrip").outerHeight()||0,E=A+z+j,G=function(Q,N){var W,X,Y,Z,a1,b1,c1,d1=Q.length,e1=this.getShowIcons()?".sapSuiteUiCommonsTimelineItemBarIconWrapperV:visible":".sapSuiteUiCommonsTimelineItemNoIcon:visible",f1=N.length>0?N.find(e1+", .sapSuiteUiCommonsTimelineItemBarIconWrapperV:visible").eq(0):q(),g1=8;for(var i=0;i<d1;i++){W=q(Q[i+1]);X=q(Q[i]);Y=i<d1-1?W.find(e1):f1;a1=X.find(e1);if(Y.length>0&&a1.length>0){b1=Y.offset().top;c1=a1.offset().top+a1.height();Z=X.find(".sapSuiteUiCommonsTimelineItemBarV");g1=8;Z.height(b1-c1-g1);}}},H=function(Q){var W,X,Y,Z,a1,b1=40,c1=100,d1=function(){var e1=_(Y,"margin-top")+Y.position().top+Y.height()-W.position().top;X.css("margin-bottom",e1+b1+"px");};for(var i=2;i<Q.length;i++){W=q(Q[i]);X=q(Q[i-1]);Y=q(Q[i-2]);Z=this._bRtlMode?!W.hasClass("sapSuiteUiCommonsTimelineItemOdd"):W.hasClass("sapSuiteUiCommonsTimelineItemOdd");a1=W.position().left;if(!Z&&a1<c1||Z&&a1>c1){d1();}else{var e1=W.position().top-X.position().top,f1=_(Y,"margin-bottom");if(e1<b1){Y.css("margin-bottom",f1+b1-e1);}}}},J=function(){var W=5,X=$.position().top,Y=$.parent().height(),Z=_(this._$content,"padding-bottom"),a1=_(this._$content,"padding-top"),b1=Y-X-E-a1-Z-W;this._$content.height(b1);}.bind(this),U,K,N,Q;if(this.getEnableScroll()){J();}if(this._renderDblSided){U=$.find(".sapSuiteUiCommonsTimelineItemUlWrapper");for(var i=0;i<U.length;i++){K=q(U[i]);N=q(U[i+1]);Q=K.find(" > li:not(.sapSuiteUiCommonsTimelineGroupHeader):visible");Q.css("margin-bottom","");H.call(this,Q,K);G.call(this,Q,N);}}};y.prototype._performResizeChanges=function(){this._performUiChanges();};y.prototype._calculateTextHeight=function(){var $=this.$(),j=this.getTextHeight(),z,A,E=function(K,N){$.find(".sapSuiteUiCommonsTimelineItemTextWrapper:visible").each(function(Q,W){var U=q(W),X=U.children().first(),Y=X.get(0).getClientRects(),Z=0,a1=0,b1,c1=-100000,d1=0,e1=U.attr("expanded");if(!e1){if(Y&&Y.length>0){b1=Y[0].top;d1=0;for(var i=0;i<Y.length-1;i++){if(c1!==Y[i].bottom){c1=Y[i].bottom;d1++;}if(K>0&&(Y[i+1].bottom-b1>K)){a1=d1;Z=Y[i].bottom-b1;break;}if(N>0&&d1===N){Z=Y[i].bottom-Y[0].top;a1=N;break;}}}if(Z>0){U.height(Z);U.css("-webkit-line-clamp",a1.toString());U.next().show();}else if(!U.attr("expandable")){U.next().hide();}}});},G=function(i){E(0,parseInt(i,10));},H=function(i){E(i,0);},J=function(){var i=$.find(".sapSuiteUiCommonsTimelineItemTextWrapper");i.css("height","");i.css("-webkit-line-clamp","");$.css("height","100%");var K=this._$content.height(),N=_(this._$content,"padding-bottom"),Q=this._$content.get(0).scrollHeight,U=Q-K-N,W={height:0},X,Y=20;$.find(".sapSuiteUiCommonsTimelineItemTextWrapper").each(function(Z,a1){var b1=q(a1).height();if(b1>W.height){W.height=b1;W.item=q(this);}});if(W.item){X=W.item.parent().find(".sapSuiteUiCommonsTimelineItemShowMore:hidden").height();return W.height-U-X-Y;}return 1;};if(j){if(this._useAutomaticHeight()){H(J.call(this));}else if(q.isNumeric(j)){G(j);}else{z=/([0-9]*\.?[0-9]+)(px)+/i;A=z.exec(j);if(A&&A.length>1){H(A[1]);}else if(C.isValid(j)){$.find(".sapSuiteUiCommonsTimelineItemTextWrapper").height(j);}}}};y.prototype._fixScrollerPositionH=function(){var $=this.$(),i=$.find(".sapSuiteUiCommonsTimelineHorizontalMiddleLine"),j=$.find(".sapSuiteUiCommonsTimelineHorizontalScroller"),z,A=this._$content.position().top;if(i.get(0)){z=i.position().top;$.find(".sapSuiteUiCommonsTimelineScrollerIconWrapper").css("top",z-5);j.css("top",A+"px");j.height(this._$content.outerHeight()-15);}};y.prototype._setupScrollers=function(){var $=this.$(),i=450,N='rgba(0, 0, 0, 0)',j,z,A,E,G,H,J,K,Q,U,W,X,Y,Z=function(a1){var b1=N;a1.parents().each(function(c1,d1){var z=q(d1).css("background-color"),e1=q(d1).css("background-image");if(e1!=="none"){b1=N;return;}if(z!==N&&z!=="transparent"){b1=z;}});return b1;};if(this._scrollingFadeout()){j=this._isVertical()?$.height():$.width();if(j<i){$.find(".sapSuiteUiCommonsTimelineVerticalScroller",".sapSuiteUiCommonsTimelineHorizontalScroller").hide();this._scrollersSet=false;return;}if(!this._scrollersSet){z=Z(this.$());if(z&&z!==N){A=z.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);if(A&&A.length>=4){E=parseInt(A[1],10);G=parseInt(A[2],10);H=parseInt(A[3],10);J="rgba("+E+","+G+","+H+", 0)";Q="rgba("+E+","+G+","+H+", 0.7)";K="rgba("+E+","+G+","+H+", 1)";U=$.find(".sapSuiteUiCommonsTimelineHorizontalLeftScroller, .sapSuiteUiCommonsTimelineTopScroller ");W=$.find(".sapSuiteUiCommonsTimelineHorizontalRightScroller, .sapSuiteUiCommonsTimelineBottomScroller");X=this._isVertical()?"top":"left";Y=this._isVertical()?"bottom":"right";U.css("background-image","linear-gradient(to "+X+", "+J+", "+K+")");W.css("background-image","linear-gradient(to "+Y+", "+J+", "+K+")");U.css("background-image","-webkit-linear-gradient("+Y+", "+J+", "+Q+" 30%,"+K+")");W.css("background-image","-webkit-linear-gradient("+X+", "+J+", "+Q+" 30%,"+K+")");this._scrollersSet=true;if(this.getContent().length>0){if((!this._isVertical()&&this._$content.get(0).scrollWidth>this._$content.outerWidth())||(this._isVertical()&&this._$content.get(0).scrollHeight>this._$content.outerHeight())){W.show();}}}}else{$.find(".sapSuiteUiCommonsTimelineHorizontalScroller").hide();}}if(!this._isVertical()){this._fixScrollerPositionH();}}};y.prototype._setupScrollEvent=function(){var $=this.$(),i=$.find(".sapSuiteUiCommonsTimelineHorizontalLeftScroller .sapSuiteUiCommonsTimelineScrollerIconWrapper, .sapSuiteUiCommonsTimelineTopScroller .sapSuiteUiCommonsTimelineScrollerIconWrapper"),j=$.find(".sapSuiteUiCommonsTimelineHorizontalRightScroller .sapSuiteUiCommonsTimelineScrollerIconWrapper, .sapSuiteUiCommonsTimelineBottomScroller .sapSuiteUiCommonsTimelineScrollerIconWrapper"),z=$.find(".sapSuiteUiCommonsTimelineHorizontalLeftScroller, .sapSuiteUiCommonsTimelineTopScroller"),A=$.find(".sapSuiteUiCommonsTimelineHorizontalRightScroller, .sapSuiteUiCommonsTimelineBottomScroller"),E=this._$content,G=this;if(G._lazyLoading()||G._scrollingFadeout()){E.on("scroll",function(H){var J=q(H.currentTarget),K=J.get(0).scrollLeft,N=J.get(0).scrollTop,Q=false,U=200,W=5,X=false,Y,Z,a1,b1,E;if(G._isVertical()){Y=J.outerHeight();Z=J.get(0).scrollHeight;X=N+Y>Z-U;Q=N+Y>=Z-W;}else{a1=J.width();b1=J.get(0).scrollWidth;X=K+a1>b1-U;Q=K+a1>=b1-W-185;}if(G._lazyLoading()&&G._scrollMoreEvent){if(X&&!G._isMaxed()){G._scrollMoreEvent=false;G._loadMore();}}if(G._scrollersSet){if(K>50||N>50){z.show();}else{z.hide();G._manualScrolling=false;}if(Q){A.hide();}else{A.show();}var c1;if(G._isVertical()){c1=J.get(0).scrollTop;E=c1>G._lastScrollPosition.y?j:i;G._lastScrollPosition.y=c1;}else{c1=J.get(0).scrollLeft;E=c1>G._lastScrollPosition.x?j:i;G._lastScrollPosition.x=c1;}E.addClass("sapSuiteUiCommonsTimelineScrolling");clearTimeout(q.data(this,'scrollTimer'));q.data(this,'scrollTimer',setTimeout(function(){i.removeClass("sapSuiteUiCommonsTimelineScrolling");j.removeClass("sapSuiteUiCommonsTimelineScrolling");},350));}});this.$().find(".sapSuiteUiCommonsTimelineScrollerIconWrapper").mousedown(function(H){var J=90,K=(q(this).hasClass("sapSuiteUiCommonsTimelineScrollerIconWrapperLeft")||q(this).hasClass("sapSuiteUiCommonsTimelineScrollerIconWrapperTop"))?-J:J;G._manualScrolling=true;G._performScroll(K);});this.$().find(".sapSuiteUiCommonsTimelineScrollerIconWrapper").mouseup(function(){G._manualScrolling=false;}).mouseout(function(){G._manualScrolling=false;});}if(this.getEnableScroll()&&!G._isVertical()){this._$content.on("wheel",function(H){if(H.originalEvent.deltaX){return;}var J=H.originalEvent.deltaY,K=30;if(J<K&&J>K*-1){J=J>0?K:K*-1;}this.scrollLeft+=J*2;});$.find(".sapSuiteUiCommonsTimelineHorizontalScroller, .sapSuiteUiCommonsTimelineVerticalScroller").on("wheel",function(H){var J=H.originalEvent.deltaY;if(G._isVertical()){G._$content.get(0).scrollTop+=J*2;}else{G._$content.get(0).scrollLeft+=J*2;}});}};y.prototype._setupMessageStrip=function(){var i=this;this._objects.register("messageStrip",function(){return new M(i.getId()+"-messageStrip",{close:function(){i.setCustomMessage("");i.fireCustomMessageClosed();},showCloseButton:true});});this._objects.register("filterMessageText",function(){return new T(i.getId()+"-filterMessageText",{});});this._objects.register("filterMessage",function(){var j=i._objects.getFilterMessageText(),z,A;A=new I(i.getId()+"filterMessageIcon",{src:"sap-icon://decline",press:[i._clearFilter,i]});z=new O(i.getId()+"-filterMessage",{design:"Info",content:[j,new b(),A]});z.addStyleClass("sapSuiteUiCommonsTimelineFilterInfoBar");z.setHeight("auto");return z;});};y.prototype._setMessageBars=function(i){var j=this._getFilterMessage();if(j){i.addChild(this._objects.getFilterMessage());this._objects.getFilterMessageText().setText(j);}};y.prototype._setupRangeFilterPage=function(){var i=this;this._rangeFilterType=null;this._objects.register("timestampFilterPicker",function(){return new p(i.getId(),undefined,undefined,u);});this._objects.register("timeFilterSelect",function(){var j=new c(i.getId()+"-timeFilterSelect",{change:function(z){i._rangeFilterType=z.getParameter("selectedItem").getProperty("key");i.toggleGroupTypeSelector(i._rangeFilterType);i._setRangeFilter();},items:[new a({text:u.getText("TIMELINE_YEAR"),key:t.Year}),new a({text:u.getText("TIMELINE_QUARTER"),key:t.Quarter}),new a({text:u.getText("TIMELINE_MONTH"),key:t.Month}),new a({text:u.getText("TIMELINE_DAY"),key:t.Day}),new a({text:u.getText("TIMELINE_CUSTOM_RANGE"),key:t.None})]});j.addStyleClass("sapSuiteUiCommonsTimelineRangeSelect");return j;});this._objects.register("timeRangeSlider",function(){var j=function(E){if(typeof E==="string"){E=Number(E);}var G=i._fnAddDate(E);return i._formatGroupBy(G,i._rangeFilterType).title;};var z=new s();z.getLabel=j;var A=new d(i.getId()+"-timeRangeSlider",{enableTickmarks:true,visible:false,showAdvancedTooltip:true,step:1,change:function(E){var G=A.getMin(),H=A.getMax(),J=A.getRange();i._filterDialogRangePage.setFilterCount(+(J[0]!==G||J[1]!==H));},customTooltips:[new r({mapFunction:j}),new r({mapFunction:j,fetchValue2:true})],scale:z});A.addStyleClass("sapSuiteUiCommonsTimelineRangeFilter");return A;});this._objects.register("rangeTypeLbl",function(){return new L(i.getId()+"-rangeTypeLbl",{text:u.getText("TIMELINE_GROUP_BY_PERIOD")+":"});});this._objects.register("rangeTypePanel",function(){var j=new P(i.getId()+"-rangeTypePanel",{content:[i._objects.getRangeTypeLbl(),i._objects.getTimeFilterSelect()]});j.addStyleClass("sapSuiteUiCommonsTimelineRangeFilterPanel");j.addStyleClass("sapSuiteUiCommonsTimelineRangeFilterPanelShadowed");return j;});this._objects.register("rangePanel",function(){return new F(i.getId()+"rangePanel",{direction:"Column",items:[i._objects.getRangeTypePanel(),i._objects.getTimeRangeSlider(),i._objects.getTimestampFilterPicker().getTimestampPanelRadio(),i._objects.getTimestampFilterPicker().getTimestampPanelPicker()]});});};y.prototype._setupFilterFirstPage=function(i){if(i){i.removeAllAggregation("filterItems");if(this.getShowItemFilter()){i.addAggregation("filterItems",new f({key:"items",text:this._getFilterTitle()}));}if(this.getShowTimeFilter()){this._filterDialogRangePage=new g({key:"range",text:u.getText("TIMELINE_RANGE_SELECTION"),customControl:[this._objects.getRangePanel()]});i.addAggregation("filterItems",this._filterDialogRangePage);}}};y.prototype._setupFilterDialog=function(){var i=this;this._setupRangeFilterPage();this._objects.register("filterContent",function(){var j,z,A=function(J){if(!i._filterState.data){i._setFilterList();J.removeAllItems();i._aFilterList.forEach(function(K){var N=q.grep(i._currentFilterKeys,function(Q){return K.key===Q.key;}).length>0;J.addItem(new f({key:K.key,text:K.text,selected:N}));});}i._filterState.data=true;},E=function(){m.show(u.getText("TIMELINE_NO_LIMIT_DATA"));},G=function(){if(!i._filterState.range){H.setBusy(true);i._getTimeFilterData().then(function(){H.setBusy(false);if((!i._minDate||!i._maxDate)||(!(i._minDate instanceof Date)||!(i._maxDate instanceof Date))){E();return;}if(!i._rangeFilterType){i._rangeFilterType=i._calculateRangeTypeFilter();}if(!i._startDate&&!i._endDate){i._setRangeFilter();}else{var J=i._objects.getTimeRangeSlider(),K=i._fnDateDiff(i._rangeFilterType),N=J.getMin(),Q=J.getMax();if(Q-N!==K){i._setRangeFilter();}j=i._fnDateDiff(i._rangeFilterType,i._minDate,i._startDate);z=i._fnDateDiff(i._rangeFilterType,i._minDate,i._endDate);J.setRange([j,z]);}i.toggleGroupTypeSelector(i._rangeFilterType);i._objects.getTimeFilterSelect().setSelectedKey(i._rangeFilterType);i._objects.getTimeRangeSlider().setVisible(true);i._objects.getTimeRangeSlider().invalidate();}).catch(function(){H.setBusy(false);E();});i._filterState.range=true;}},H=new V(i.getId()+"-filterContent",{confirm:function(J){var K=J.getParameter("filterItems"),N,Q,U,W,X;i._currentFilterKeys=K.map(function(Y){return{key:Y.getProperty("key"),text:Y.getProperty("text")};});if(i._objects.getTimestampFilterPicker().getVisible()){i._startDate=i._objects.getTimestampFilterPicker().getStartDate();i._endDate=i._objects.getTimestampFilterPicker().getEndDate();X=true;}else{N=i._objects.getTimeRangeSlider();W=N.getRange();Q=N.getMin();U=N.getMax();i._startDate=null;i._endDate=null;if(W[0]!==Q||W[1]!==U){i._startDate=i._fnAddDate(Math.min.apply(null,W),D.DOWN);i._endDate=i._fnAddDate(Math.max.apply(null,W),D.UP);X=true;}}i._filterData(X);},resetFilters:function(J){var K=i._objects.getTimeRangeSlider();K.setValue(K.getMin());K.setValue2(K.getMax());i._filterDialogRangePage.setFilterCount(0);},filterDetailPageOpened:function(J){var K=J.getParameter("parentFilterItem").getProperty("key");if(K==="items"){A(J.getParameter("parentFilterItem"));}if(K==="range"){G();}}});i._setupFilterFirstPage(H);return H;});};y.prototype._setupHeaderToolbar=function(){var i=this,j=function(A){i._objects.register(A.name,function(){var E=new e(i.getId()+"-"+A.name,{type:B.Transparent,icon:A.icon,tooltip:A.tooltip,press:A.fnPress});E.setLayoutData(new h({priority:A.priority}));return E;});};j({name:"filterIcon",icon:"sap-icon://add-filter",tooltip:u.getText("TIMELINE_FILTER_BY"),fnPress:[i._openFilterDialog,i],priority:k.NeverOverflow,visible:i.getShowItemFilter()||i.getShowTimeFilter()});j({name:"sortIcon",icon:"sap-icon://arrow-bottom",tooltip:u.getText("TIMELINE_SORT"),fnPress:[i._sortClick,i],priority:k.High,visible:i.getSort()&&i.getShowSort()});var z=new b();this._objects.register("searchFieldLabel",function(){return new n(i.getId()+"-searchFieldLabel",{text:u.getText("TIMELINE_ACCESSIBILITY_SEARCH")});});this._objects.register("searchField",function(){var A=new S(i.getId()+"-searchField",{width:"14rem",ariaLabelledBy:i._objects.getSearchFieldLabel().getId(),search:function(E){i._search(E.getSource().getValue());},visible:i.getShowSearch()});A.setLayoutData(new h({priority:k.Low}));return A;});this._objects.register("headerBar",function(){var A=[];if(i._isVertical()){A=[z,i._objects.getSearchFieldLabel(),i._objects.getSearchField(),i._objects.getSortIcon(),i._objects.getFilterIcon()];}else{A=[i._objects.getSortIcon(),i._objects.getFilterIcon(),i._objects.getSearchFieldLabel(),i._objects.getSearchField()];}var H=new O(i.getId()+"-headerBar",{content:A,visible:i.getShowHeaderBar()});H.addStyleClass("sapSuiteUiCommonsTimelineHeaderBar");H.setParent(i);return H;});};y.prototype._setupAccessibilityItems=function(){var i=this;this._objects.register("accessibilityTitle",function(){return new n(i.getId()+"-accessibilityTitle",{text:u.getText("TIMELINE_ACCESSIBILITY_TITLE")});});};y.prototype.toggleGroupTypeSelector=function(i){var j=i!==t.None;this._objects.getTimestampFilterPicker().setVisible(!j);this._objects.getTimeRangeSlider().setVisible(j);};}};return x;},true);