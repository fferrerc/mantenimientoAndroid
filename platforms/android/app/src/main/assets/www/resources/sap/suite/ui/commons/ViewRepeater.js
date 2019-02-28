/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'./library','sap/ui/commons/library','sap/ui/commons/RowRepeater','sap/ui/commons/SegmentedButton','sap/ui/commons/SearchField','sap/ui/commons/Button','sap/ui/base/ManagedObject','sap/ui/core/ResizeHandler'],function(q,l,C,R,S,a,B,M,b){"use strict";var V=R.extend("sap.suite.ui.commons.ViewRepeater",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{itemMinWidth:{type:"int",group:"Misc",defaultValue:null},responsive:{type:"boolean",group:"Misc",defaultValue:false},defaultViewIndex:{type:"int",group:"Misc",defaultValue:0},showSearchField:{type:"boolean",group:"Misc",defaultValue:true},showViews:{type:"boolean",group:"Misc",defaultValue:true},external:{type:"boolean",group:"Misc",defaultValue:false},itemHeight:{type:"int",group:"Misc",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:'100%'}},aggregations:{views:{type:"sap.suite.ui.commons.RepeaterViewConfiguration",multiple:true,singularName:"view"}},associations:{externalRepresentation:{type:"sap.ui.core.Control",multiple:false}},events:{search:{parameters:{query:{type:"string"}}},changeView:{parameters:{oldViewIndex:{type:"int"},newViewIndex:{type:"int"},filterId:{type:"string"},sorterId:{type:"string"},page:{type:"int"}}}}}});V.prototype.init=function(){this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");this.addStyleClass("suiteUiVr");R.prototype.init.call(this);this._oSegBtn=new S({id:this.getId()+"-segBtn"});this._repopulateViewSelector();this._oSearchField=new a({id:this.getId()+"-searchFld",enableFilterMode:true,enableListSuggest:false,search:function(e){this.fireSearch({query:e.getParameter("query")});}.bind(this)});this.attachFilter(function(e){this._currentFilterId=e.getParameter("filterId");});this.attachSort(function(e){this._currentSorterId=e.getParameter("sorterId");});};V.prototype.setDefaultViewIndex=function(v){this.setProperty("defaultViewIndex",v);this._selectDefaultView();return this;};V.prototype._selectDefaultView=function(){var v=this.getDefaultViewIndex();if(v===this._currentViewIndex){return;}var c=this.getViews()||[];if(c.length>0){if(v>=c.length){v=c.length-1;}this.selectView(v);var d=this.getId()+"-"+c[v].getId()+"-triggerBtn";this._oSegBtn.setSelectedButton(d);}};V.prototype._repopulateViewSelector=function(){var t=this;var r=t._oSegBtn.removeAllAggregation("buttons",true);q.each(r,function(i,d){d.destroy();});var v=this.getViews()||[];for(var i=0;i<v.length;i++){var o=v[i];if(o.getExternal()){var e=o.getExternalRepresentation();if(!e.getModel()){e.setModel(this.getModel());}}var c=new B({id:this.getId()+"-"+o.getId()+"-triggerBtn",text:o.getTitle()||(o.getIcon()?undefined:this._rb.getText("VIEWREPEATER_TAB_DEFAULT_NAME",[(i+1)])),icon:o.getIcon(),iconHovered:o.getIconHovered(),iconSelected:o.getIconSelected(),tooltip:o.getTooltip(),lite:true});t._oSegBtn.addButton(c);c.attachPress(o,function(d,f){t.selectView(f);t._oSegBtn.rerender();});}this._selectDefaultView();};V.prototype.setModel=function(m,n){M.prototype.setModel.call(this,m,n);this._repopulateViewSelector();return this;};V.prototype.addView=function(r){this.addAggregation("views",r);this._repopulateViewSelector();return this;};V.prototype.removeAllViews=function(){var r=this.removeAllAggregation("views");this._repopulateViewSelector();return r;};V.prototype.insertView=function(v,i){this.insertAggregation("views",v,i);this._repopulateViewSelector();return this;};V.prototype.removeView=function(v){var r=this.removeAggregation("views",v);this._repopulateViewSelector();return r;};V.prototype.selectView=function(v){var o,c=0;switch(typeof v){case"number":{o=this.getViews()[v];c=v;break;}case"object":{var d=this.getViews().length;for(var i=0;i<d;i++){if(v.getId()===this.getViews()[i].getId()){o=v;c=i;break;}}}default:break;}if(!o){return;}var r=o.getResponsive();if(typeof r==="boolean"){this.setResponsive(r);}var I=o.getItemMinWidth();if(typeof I==="number"&&I>0&&I!==this.setItemMinWidth()){this.setItemMinWidth(I);}var e=o.getItemHeight();if(e!==this.getItemHeight()&&e>0){this.setItemHeight(e);}if(o.getNumberOfTiles()>0&&o.getNumberOfTiles()!==this.setNumberOfRows()){this.setNumberOfRows(o.getNumberOfTiles());}var E=o.getExternal();if(E===true){this.setExternal(true);this.setExternalRepresentation(o.getExternalRepresentation());}else{this.setExternal(false);this.setExternalRepresentation(null);}var f=this.getCurrentPage();var p=o.getPath();var t=o.getTemplate();if(p&&t){this.bindRows(p,t);this._applyFilter(this._currentFilterId);this._applySorter(this._currentSorterId);}if(this._currentViewIndex||c!==this._currentViewIndex){this.fireChangeView({newViewIndex:c,oldViewIndex:this._currentViewIndex,filterId:this._currentFilterId,sorterId:this._currentSorterId,page:f});}this._currentViewIndex=c;this._oView=o;};V.prototype._applyFilter=function(f,L){if(f){if(!L){L=this.getBinding("rows");}var F=this.getFilters();var o;var i=F.length;for(var n=0;n<i;n++){if(F[n].getId()===f){o=F[n];break;}}if(o){L.filter(o.getFilters());}}};V.prototype._applySorter=function(s,L){if(s){if(!L){L=this.getBinding("rows");}var o;var c=this.getSorters();var i=c.length;for(var n=0;n<i;n++){if(c[n].getId()===s){o=c[n];break;}}if(o){L.sort(o.getSorter());}}};V.prototype.onBeforeRendering=function(){if(this.getResponsive()&&this.getShowMoreSteps()===0){if(!this._bInit){this.setNumberOfRows(0);}}else if(this._oView&&this._oView.getNumberOfTiles()>0&&this._oView.getNumberOfTiles()!==this.getNumberOfRows()&&!this.getResponsive()){this.setNumberOfRows(this._oView.getNumberOfTiles());}this._bInit=false;};V.prototype._updateBodyPosition=function(){var v=q("#"+this.getId()+">div.suiteUiVrViewSwHolder").outerHeight();var p=q("#"+this.getId()+">div.sapUiRrPtb").outerHeight();var s=q("#"+this.getId()+">div.sapUiRrStb").outerHeight();var f=q("#"+this.getId()+">div.sapUiRrFtr").outerHeight();var o=q(document.getElementById(this.getId()+"-body"));o.css("top",v+p+s+3);o.css("bottom",f);};V.prototype.onAfterRendering=function(){this._computeWidths(true);b.deregister(this._sResizeListenerId);if(this.getResponsive()){if(this.getShowMoreSteps()===0){q("#"+this.getId()+">div.sapUiRrFtr").hide();}setTimeout(function(){this._sResizeListenerId=b.register(this.getId()+"-body"?window.document.getElementById(this.getId()+"-body"):null,q.proxy(this._handleResize,this));if(this.getShowMoreSteps()===0){this._updateBodyPosition();}}.bind(this),100);}};V.prototype._handleResize=function(){if(!this.getDomRef()){return;}this._computeWidths();if(this.getResponsive()&&this.getShowMoreSteps()===0){var o=q(document.getElementById(this.getId()+"-body"));var i=o.height();var n=this._itemsPerRow;var N=Math.floor(i/(this.getItemHeight()+3));var c=N*n;if(c!==this.getNumberOfRows()){this._bInit=true;this.setNumberOfRows(c);}else{q("#"+this.getId()+">div.sapUiRrFtr").show();}}};V.prototype._computeWidths=function(i){var t=this;var T=this.$();var I=t.getItemMinWidth();var n=(this.getResponsive()===true)?Math.floor(T.width()/I):1;var p=Math.floor(100/n);if(T.width()*p/100<I){n--;p=Math.floor(100/n);}if(i||t._height!==T.height()||t._itemsPerRow!==n){q("#"+this.getId()+" .sapUiRrBody").css("width","100%");var o=100-(n*p);var w;q("#"+this.getId()+" .sapUiRrBody li").each(function(c){w=p;if(c%n<o){w++;}q(this).css("width",w+"%");q(this).css("margin","0");});t._height=T.height();t._itemsPerRow=n;t._percentWidth=p;}};V.prototype.startPagingAnimation=function(){b.deregister(this._sResizeListenerId);var c=sap.ui.getCore(),r=c.getRenderManager(),I=this.getId(),p=this.iPreviousPage,P=this.getCurrentPage(),N=this.getNumberOfRows(),s=(P-1)*N,d=this.getRows(),e=this._getRowCount()>N*P?N:this._getRowCount()-N*(P-1),n,i,w,o=this.getBinding("rows");var D,j=q(I+"-page_"+p?window.document.getElementById(I+"-page_"+p):null),f=I+"-body"?window.document.getElementById(I+"-body"):null,J=q(f);J.css("height",J.outerHeight());var g;if(sap.ui.getCore()&&sap.ui.getCore().getConfiguration()&&sap.ui.getCore().getConfiguration().getRTL()){g=(P<p)?"left":"right";}else{g=(P<p)?"right":"left";}if(o){this._bSecondPage=!this._bSecondPage;this.updateRows(true);d=this.getRows();s=(this._bSecondPage?1:0)*N;}var h="\"top:-"+j.outerHeight(true)+"px;"+g+":"+j.outerWidth(true)+"px;\"";q("<ul id=\""+I+"-page_"+P+"\" class=\"sapUiRrPage\" style="+h+"/>").appendTo(f);var k=f.lastChild;var m=q(k);var O=100-(this._itemsPerRow*this._percentWidth);for(n=s,i=0;n<s+e;n++,i++){w=this._percentWidth;if(i%this._itemsPerRow<O){w++;}q("<li id=\""+I+"-row_"+n+"\" style=\"width:"+w+"%\" class=\"sapUiRrRow\"/>").appendTo(k);D=k.lastChild;r.render(d[n],D);}if(g==="right"){j.animate({right:-j.outerWidth(true)},"slow");m.animate({right:0},"slow");}else{j.animate({left:-j.outerWidth(true)},"slow");m.animate({left:0},"slow");}J.animate({height:m.outerHeight(true)},"slow",q.proxy(this.endPagingAnimation,this));};V.prototype.endPagingAnimation=function(){R.prototype.endPagingAnimation.call(this);this._sResizeListenerId=b.register(this.getId()+"-body"?window.document.getElementById(this.getId()+"-body"):null,q.proxy(this._handleResize,this));};V.prototype.exit=function(){this._oSegBtn.destroy();this._oSearchField.destroy();b.deregister(this._sResizeListenerId);};return V;});
