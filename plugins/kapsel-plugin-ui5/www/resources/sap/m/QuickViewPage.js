/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/IconPool','sap/ui/layout/form/SimpleForm','sap/ui/layout/VerticalLayout','sap/ui/layout/HorizontalLayout','./Page','./Button','./Bar','./Title','./Image','./Link','./Text','./Label','./HBox','sap/ui/core/Icon','sap/ui/core/Title','sap/ui/core/CustomData','sap/ui/core/library','sap/ui/layout/library','sap/ui/Device','sap/ui/layout/form/ResponsiveGridLayout'],function(q,l,C,I,S,V,H,P,B,a,T,b,L,c,d,f,g,h,i,m,n,D,R){"use strict";var U=l.URLHelper;var o=n.form.SimpleFormLayout;var p=m.TitleLevel;var Q=l.QuickViewGroupElementType;var r=l.ButtonType;var s=C.extend("sap.m.QuickViewPage",{metadata:{library:"sap.m",properties:{pageId:{type:"string",group:"Misc",defaultValue:""},header:{type:"string",group:"Misc",defaultValue:""},title:{type:"string",group:"Misc",defaultValue:""},titleUrl:{type:"string",group:"Misc",defaultValue:""},crossAppNavCallback:{type:"object",group:"Misc"},description:{type:"string",group:"Misc",defaultValue:""},icon:{type:"string",group:"Misc",defaultValue:""}},defaultAggregation:"groups",aggregations:{groups:{type:"sap.m.QuickViewGroup",multiple:true,singularName:"group",bindable:"bindable"}}}});s.prototype.init=function(){this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle('sap.m');var G=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService;if(G){this.oCrossAppNavigator=G("CrossApplicationNavigation");}};s.prototype.onBeforeRendering=function(){this._destroyPageContent();this._createPageContent();};s.prototype.getPageContent=function(){return this._mPageContent;};s.prototype.setNavContext=function(e){this._mNavContext=e;};s.prototype.getNavContext=function(){return this._mNavContext;};s.prototype.setPageTitleControl=function(t){this._oPageTitle=t;};s.prototype.getPageTitleControl=function(){return this._oPageTitle;};s.prototype._createPage=function(){var e=this._createPageContent();var N=this.getNavContext();var j;if(this._oPage){j=this._oPage;j.destroyContent();j.setCustomHeader(new a());}else{j=this._oPage=new P(N.quickViewId+'-'+this.getPageId(),{customHeader:new a()});j.addEventDelegate({onAfterRendering:this.onAfterRenderingPage},this);}if(this.getHeader()===""&&N.quickView.getPages().length===1&&!D.system.phone){j.setShowHeader(false);j.addStyleClass('sapMQuickViewPageWithoutHeader');}if(e.header){j.addContent(e.header);}j.addContent(e.form);var k=j.getCustomHeader();k.addContentMiddle(new T({text:this.getHeader()}).addStyleClass("sapMQuickViewTitle"));if(N.hasBackButton){k.addContentLeft(new B({type:r.Back,tooltip:this._oResourceBundle.getText("PAGE_NAVBUTTON_TEXT"),press:function(){if(N.navContainer){N.quickView._setNavOrigin(null);N.navContainer.back();}}}));}if(N.popover&&D.system.phone){k.addContentRight(new B({icon:I.getIconURI("decline"),press:function(){N.popover.close();}}));}j.addStyleClass('sapMQuickViewPage');return j;};s.prototype.onAfterRenderingPage=function(){if(this._bItemsChanged){var N=this.getNavContext();if(N){N.quickView._restoreFocus();}this._bItemsChanged=false;}};s.prototype._createPageContent=function(){var F=this._createForm();var e=this._getPageHeaderContent();var j=this.getPageTitleControl();if(e&&j){F.addAriaLabelledBy(j);}this._mPageContent={form:F,header:e};return this._mPageContent;};s.prototype._createForm=function(){var G=this.getAggregation("groups"),F=new S({maxContainerCols:1,editable:false,layout:o.ResponsiveGridLayout});if(G){for(var j=0;j<G.length;j++){if(G[j].getVisible()){this._renderGroup(G[j],F);}}}return F;};s.prototype._getPageHeaderContent=function(){var e,v=new V(),j=new H(),k=this.getIcon(),t=this.getTitle(),u=this.getDescription(),w=this.getTitleUrl();if(!k&&!t&&!u){return null;}if(k){if(this.getIcon().indexOf("sap-icon")==0){e=new g({src:k,decorative:!w,useIconTooltip:false,tooltip:t});}else{e=new b({src:k,decorative:false,tooltip:t}).addStyleClass("sapUiIcon");}e.addStyleClass("sapMQuickViewThumbnail");if(w){e.attachPress(this._crossApplicationNavigation(this));}j.addContent(e);}var x;if(w){x=new L({text:t,href:w,target:"_blank"});}else if(this.getCrossAppNavCallback()){x=new L({text:t});x.attachPress(this._crossApplicationNavigation(this));}else{x=new T({text:t,level:p.H1});}this.setPageTitleControl(x);var y=new c({text:u});v.addContent(x);v.addContent(y);j.addContent(v);return j;};s.prototype._renderGroup=function(G,F){var e=G.getAggregation("elements");var j,t,u;if(G.getHeading()){F.addContent(new h({text:G.getHeading(),level:p.H2}));}if(!e){return;}var N=this.getNavContext();for(var k=0;k<e.length;k++){j=e[k];if(!j.getVisible()){continue;}u=new d({text:j.getLabel()});var v;if(N){v=N.quickViewId;}t=j._getGroupElementValue(v);F.addContent(u);if(!t){F.addContent(new c({text:""}));continue;}u.setLabelFor(t.getId());if(j.getType()==Q.pageLink){t.attachPress(this._attachPressLink(this));}if(j.getType()==Q.mobile&&!D.system.desktop){var w=new g({src:I.getIconURI("post"),tooltip:this._oResourceBundle.getText("QUICKVIEW_SEND_SMS"),decorative:false,customData:[new i({key:"phoneNumber",value:j.getValue()})],press:this._mobilePress});var x=new f({items:[t,w]});F.addContent(x);}else{F.addContent(t);}}};s.prototype._crossApplicationNavigation=function(t){return function(){if(t.getCrossAppNavCallback()&&t.oCrossAppNavigator){var e=t.getCrossAppNavCallback();if(typeof e=="function"){var j=e();var k=t.oCrossAppNavigator.hrefForExternal({target:{semanticObject:j.target.semanticObject,action:j.target.action},params:j.params});U.redirect(k);}}else if(t.getTitleUrl()){window.open(t.getTitleUrl(),"_blank");}};};s.prototype._destroyPageContent=function(){if(!this._mPageContent){return;}if(this._mPageContent.form){this._mPageContent.form.destroy();}if(this._mPageContent.header){this._mPageContent.header.destroy();}this._mPageContent=null;};s.prototype.exit=function(){this._oResourceBundle=null;if(this._oPage){this._oPage.destroy();this._oPage=null;}else{this._destroyPageContent();}this._mNavContext=null;};s.prototype._attachPressLink=function(t){var N=t.getNavContext();return function(e){e.preventDefault();var j=this.getCustomData()[0].getValue();if(N.navContainer&&j){N.quickView._setNavOrigin(this);N.navContainer.to(j);}};};s.prototype._mobilePress=function(){var e="sms://"+q.sap.encodeURL(this.getCustomData()[0].getValue());window.location.replace(e);};s.prototype._updatePage=function(){var N=this.getNavContext();if(N&&N.quickView._bRendered){this._bItemsChanged=true;N.popover.focus();if(N.quickView.indexOfPage(this)==0){N.quickView._clearContainerHeight();}this._createPage();N.popover.$().css('display','block');N.quickView._adjustContainerHeight();N.quickView._restoreFocus();}};["setModel","bindAggregation","setAggregation","insertAggregation","addAggregation","removeAggregation","removeAllAggregation","destroyAggregation"].forEach(function(F){s.prototype["_"+F+"Old"]=s.prototype[F];s.prototype[F]=function(){var e=s.prototype["_"+F+"Old"].apply(this,arguments);this._updatePage();if(["removeAggregation","removeAllAggregation"].indexOf(F)!==-1){return e;}return this;};});s.prototype.setProperty=function(){C.prototype.setProperty.apply(this,arguments);this._updatePage();};return s;});
