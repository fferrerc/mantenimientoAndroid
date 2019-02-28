/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/Control","sap/m/Text","sap/m/Toolbar","sap/m/ToolbarDesign","sap/m/Link","sap/m/TextArea","sap/m/Popover","sap/m/PlacementType","sap/m/ToolbarSpacer","sap/m/Button","sap/ui/Device","sap/suite/ui/commons/util/ManagedObjectRegister","sap/suite/ui/commons/util/DateUtils","sap/ui/core/Icon","sap/m/library","sap/ui/core/format/DateFormat","sap/ui/model/odata/v4/ODataModel","sap/ui/dom/containsOrEquals","sap/base/security/encodeXML"],function(q,C,T,a,b,L,c,P,d,e,B,D,M,f,I,g,h,O,j,k){"use strict";var l=C.extend("sap.suite.ui.commons.TimelineItem",{metadata:{library:"sap.suite.ui.commons",properties:{dateTime:{type:"any",group:"Misc",defaultValue:null},filterValue:{type:"string",group:"Misc",defaultValue:null},icon:{type:"string",group:"Misc",defaultValue:null},iconTooltip:{type:"string",group:"Misc",defaultValue:null},useIconTooltip:{type:"boolean",group:"Accessibility",defaultValue:true},maxCharacters:{type:"int",group:"Behavior",defaultValue:null},replyCount:{type:"int",group:"Misc",defaultValue:null},status:{type:"string",group:"Misc",defaultValue:null},title:{type:"string",group:"Misc",defaultValue:null},text:{type:"string",group:"Misc",defaultValue:null},userName:{type:"string",group:"Misc",defaultValue:null},userNameClickable:{type:"boolean",group:"Misc",defaultValue:false},userPicture:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null}},defaultAggregation:"embeddedControl",aggregations:{customAction:{type:"sap.ui.core.CustomData",multiple:true,singularName:"customAction"},customReply:{type:"sap.ui.core.Control",multiple:false},embeddedControl:{type:"sap.ui.core.Control",multiple:false},replyList:{type:"sap.m.List",multiple:false},suggestionItems:{type:"sap.m.StandardListItem",multiple:true,singularName:"suggestionItem",deprecated:true}},events:{userNameClicked:{parameters:{uiElement:{type:"sap.ui.core.Control"}}},replyPost:{parameters:{value:{type:"string"}}},replyListOpen:{},customActionClicked:{parameters:{value:{type:"string"},key:{type:"string"},linkObj:{type:"sap.m.Link"}}},suggest:{deprecated:true,parameters:{suggestValue:{type:"string"}}},suggestionItemSelected:{deprecated:true,parameters:{selectedItem:{type:"sap.ui.core.Item"}}}}}});var r=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons"),S={"Warning":"sapSuiteUiCommonsTimelineStatusWarning","Error":"sapSuiteUiCommonsTimelineStatusError","Success":"sapSuiteUiCommonsTimelineStatusSuccess","Information":"sapSuiteUiCommonsTimelineStatusInformation"};l.prototype.init=function(){this._customReply=false;this._objects=new M();this._nMaxCharactersMobile=500;this._nMaxCharactersDesktop=800;this._sTextShowMore=r.getText("TIMELINE_TEXT_SHOW_MORE");this._registerControls();this._registerPopup();this._orientation="V";};l.prototype.setCustomMessage=function(m){this._objects.getInfoText().setText(m);this._objects.getInfoBar().setVisible(m&&m.length>0);this.invalidate();};l.prototype.setDateTime=function(o){if(o&&this.getBinding("dateTime")&&(this.getModel()instanceof O)){var i=h.getDateTimeInstance({pattern:"yyyy-MM-dd'T'HH:mm:ss.SSSZ"});var p=i.parse(o);if(p instanceof Date){o=p;}}this.setProperty("dateTime",o);};l.prototype.applyFocusInfo=function(){this.focus();this.getParent()._moveScrollBar(true);};l.prototype.getFocusDomRef=function(){return this.$("outline")[0];};l.prototype._replyPost=function(){var i=this._objects.getReplyInputArea().getValue();this.fireReplyPost({value:i});};l.prototype._registerPopup=function(){var t=this;this._objects.register("fullText",function(){var o=new T(t.getId()+"-fullText",{text:t.getText()});o.addStyleClass("sapSuiteUiCommonsTimelineItemPopoverText");return o;});this._objects.register("fullTextPopover",function(){var p=new P({placement:d.Bottom,showArrow:false,showHeader:false,contentMinWidth:'300px',contentWidth:'450px',resizable:true,content:[t._objects.getFullText()]});p.addStyleClass("sapSuiteUiCommonsTimelineItemShowMorePopover");return p;});};l.prototype._openReplyDialog=function(){if(this._customReply){this.getCustomReply().openBy(this._objects.getReplyLink());this.fireReplyListOpen();}else{this.fireReplyListOpen();this._objects.getReplyInputArea().setValue('');this._oldReplyInputArea='';this._list=this.getReplyList();if(this._list!==null){this.setAggregation("replyList",null,true);this._objects.getReplyPop().addContent(this._list);}this._objects.getReplyPop().addContent(this._objects.getReplyInputArea());this._objects.getReplyPop().openBy(this._objects.getReplyLink());}};l.prototype._callParentFn=function(){var i=Array.prototype.slice.call(arguments),n=i.shift(),p=this.getParent();if(p&&(typeof p[n]==="function")){return p[n].apply(p,i);}};l.prototype._getCorrectGroupIcon=function(){var i="",m=function(){return this.getParent()&&this.getParent()._renderDblSided;}.bind(this),n=this._isGroupCollapsed();if(this._orientation==="H"){i="sap-icon://navigation-right-arrow";if(!n){i=this._callParentFn("_isLeftAlignment")||m()?"sap-icon://navigation-down-arrow":"sap-icon://navigation-up-arrow";}}else{i="sap-icon://navigation-down-arrow";if(n){i=this._callParentFn("_isLeftAlignment")||m()?"sap-icon://navigation-right-arrow":"sap-icon://navigation-left-arrow";}}return i;};l.prototype.onclick=function(E){var t=this;if(j(this.$("outline").get(0),E.target)){if(this._isGroupHeader){t._performExpandCollapse(t._groupID);}}};l.prototype._performExpandCollapse=function(G){var i=false,E=this._isGroupCollapsed(G);var s=function(y,z){var A=y.find(".sapSuiteUiCommonsTimelineItemBarV"),F,H;if(z.get(0)){F=z.attr("groupId");H=!this._isGroupCollapsed(F);if(H){A.addClass("sapSuiteUiCommonsTimelineGroupNextExpanded");}else{A.removeClass("sapSuiteUiCommonsTimelineGroupNextExpanded");}}}.bind(this),m=function(){var y,z,A;if(!i){y=this._objects.getGroupCollapseIcon&&this._objects.getGroupCollapseIcon();z=this.$();A=this._isGroupCollapsed();if(!A){z.removeClass("sapSuiteUiCommonsTimelineGroupCollapsed");z.addClass("sapSuiteUiCommonsTimelineGroupExpanded");}else{z.addClass("sapSuiteUiCommonsTimelineGroupCollapsed");z.removeClass("sapSuiteUiCommonsTimelineGroupExpanded");}y.setSrc(this._getCorrectGroupIcon());i=true;}}.bind(this),n=function(){if(this.getParent()){this.getParent()._collapsedGroups[G]=!E;}}.bind(this),$=this.$(),t=this,o=$.parent(),p,u,v,w,x;n();if(this._orientation==="H"){p=this.$("line");}else{p=$.find(".sapSuiteUiCommonsTimelineGroupHeaderBarWrapper");u=o.next().children("li").first();v=o.prev().children(":visible:last");if(v.get(0)){s(v,$);}if(E){w=o.children().last();s(w,u);}else{s($,u);}}if(E){p.hide();}else{p.show();}$.attr("aria-expanded",!!E);if(this._orientation!=="H"||E){m();}x=this._callParentFn("_performExpandCollapse",G,E,this);if(x){return new Promise(function(y,z){x.then(function(){m();t._callParentFn("_performUiChanges");y();});});}};l.prototype._getStatusColorClass=function(){var s=this.getStatus();return S[s]||"";};l.prototype._getLineIcon=function(){var t=this,i;this._objects.register("imageControl",function(){var s="sap-icon://circle-task-2",m=t.getText()==="GroupHeader";if(!m){s=t.getIcon()?t.getIcon():"sap-icon://activity-items";}i=new I(t.getId()+'-icon',{src:s,tooltip:t.getIconTooltip(),useIconTooltip:t.getUseIconTooltip()});i.addStyleClass("sapSuiteUiCommonsTimelineBarIcon");return i;});return this._objects.getImageControl();};l.prototype._isGroupCollapsed=function(i){var p=this.getParent();i=i||this._groupID;return p&&p._collapsedGroups&&p._collapsedGroups[i];};l.prototype._getCollapsedText=function(){var s=this.getText().substring(0,this._nMaxCollapsedLength);var n=s.lastIndexOf(" ");if(n>0){this._sShortText=s.substr(0,n);}else{this._sShortText=s;}return this._sShortText;};l.prototype._toggleTextExpanded=function(s){var t=this,$=s.oSource.$(),i=q("#"+this.getId()+"-realtext"),m=$.height(),n=$.position().top,o=i.parent().position().top,p=$.parent().prev(),u,v,N=this.getParent()&&this.getParent()._noAnimation,w=8,x=function(){return t.getParent()&&t.getParent()._renderDblSided;},y=function(V,E,F){p.css("-webkit-line-clamp",F);if(x()||N){p.css("height",V);t._callParentFn("_performUiChanges");}else{p.animate({height:E},250,t._callParentFn("_performUiChanges"));}};if(this._orientation==="V"){v=this.$("threeDots");u=p.children().first();if(!this._expanded){this._textProperties={height:p.css("height"),clamp:p.css("-webkit-line-clamp"),text:u.html()};p.attr("expanded",true);v.hide();u.html(this._encodeHTMLAndLineBreak(this.getText()));s.oSource.setText(r.getText("TIMELINE_TEXT_SHOW_LESS"));y("",u.height(),"");}else{p.attr("expanded",false);s.oSource.setText(this._sTextShowMore);v.show();u.html(this._textProperties.text);y(this._textProperties.height,this._textProperties.height,this._textProperties.clamp);}t._expanded=!t._expanded;}else{var z=o-n-m-w,W=q(window).height()-$.offset().top,A=200;if(W<A){z-=(A-W);}this._objects.getFullText().setText(this.getText());this._objects.getFullTextPopover().setOffsetY(Math.floor(z));this._objects.getFullTextPopover().openBy(this._objects.getExpandButton());}};l.prototype._getButtonExpandCollapse=function(){var t=this;this._objects.register("expandButton",function(){return new L(t.getId()+"-fullTextBtn",{text:t._sTextShowMore,press:t._toggleTextExpanded.bind(t)});});return this._objects.getExpandButton();};l.prototype._checkTextIsExpandable=function(){this._nMaxCollapsedLength=this.getMaxCharacters();if(this._nMaxCollapsedLength===0){this._nMaxCollapsedLength=D.system.phone?this._nMaxCharactersMobile:this._nMaxCharactersDesktop;}return this.getText().length>this._nMaxCollapsedLength;};l.prototype.onBeforeRendering=function(){var t=this;if(!this._list){this._list=this.getReplyList();}if(this.getReplyCount()>0){this._objects.getReplyLink().setText(r.getText("TIMELINE_REPLY")+" ("+this.getReplyCount()+")");}else if(this._list&&this._list.getItems().length>0){this._objects.getReplyLink().setText(r.getText("TIMELINE_REPLY")+" ("+this._list.getItems().length+")");}this._objects.getSocialBar().removeAllContent();if(this._callParentFn("getEnableSocial")){this._objects.getSocialBar().addContent(this._objects.getReplyLink());}this._actionList=this.getCustomAction();function F(E,o){t.fireCustomActionClicked({"value":o.value,"key":o.key,"linkObj":this});}for(var i=0;i<this._actionList.length;i++){var m=this._actionList[i].getKey();var v=this._actionList[i].getValue();var n=new L({text:v,tooltip:m});n.addStyleClass("sapSuiteUiCommonsTimelineItemActionLink");n.attachPress({"value":v,"key":m},F);this._objects.getSocialBar().addContent(n);}};l.prototype._encodeHTMLAndLineBreak=function(t){return k(t).replace(/&#xa;/g,"<br>");};l.prototype._getUserPictureControl=function(){var u=this.getUserPicture(),s="2rem",t=this;if(!u){return null;}this._objects.register("userPictureControl",function(){var i=g.ImageHelper.getImageControl(t.getId()+"-userPictureControl",null,t,{height:s,width:s,src:u,tooltip:r.getText("TIMELINE_USER_PICTURE")});i.setDensityAware(false);return i;});this._objects.getUserPictureControl().setSrc(u);return this._objects.getUserPictureControl();};l.prototype._getUserNameLinkControl=function(){var t=this;if(this.getUserNameClickable()){this._objects.register("userNameLink",function(){var i=new L(t.getId()+"-userNameLink",{text:t.getUserName(),press:function(E){t.fireUserNameClicked({uiElement:this});}});i.addStyleClass("sapUiSelectable");return i;});return this._objects.getUserNameLink();}};l.prototype.onAfterRendering=function(){this._expanded=false;this._callParentFn("_itemRendered");};l.prototype._registerControls=function(){var t=this;this._objects.register("infoText",new T(this.getId()+"-infoText",{maxLines:1,width:"100%"}));this._objects.register("infoBar",new a(this.getId()+"-infoBar",{id:this.getId()+"-customMessageInfoBar",content:[this._objects.getInfoText()],design:b.Info,visible:false}));this._objects.register("replyLink",function(){var i=new L(t.getId()+"-replyLink",{text:r.getText("TIMELINE_REPLY"),press:[t._openReplyDialog,t]});i.addStyleClass("sapSuiteUiCommonsTimelineItemActionLink");return i;});this._objects.register("socialBar",function(){var s=new a(t.getId()+"-socialBar",{});s.data("sap-ui-fastnavgroup",null);return s;});this._objects.register("replyInputArea",new c(this.getId()+"-replyInputArea",{height:"4rem",width:"100%"}));this._objects.register("replyPop",function(){return new P(t.getId()+"-replyPop",{initialFocus:t._objects.getReplyInputArea(),title:r.getText("TIMELINE_REPLIES"),placement:d.Vertical,footer:new a({content:[new e(),new B(t.getId()+"-replyButton",{text:r.getText("TIMELINE_REPLY"),press:function(){t._replyPost();t._objects.getReplyPop().close();}})]}),contentHeight:"15rem",contentWidth:"20rem"});});};l.prototype.exit=function(){this._objects.destroyAll();};l.prototype.getDateTimeWithoutStringParse=function(){var o=this.getProperty("dateTime");return f.parseDate(o,false)||"";};l.prototype.setCustomReply=function(R){if(R){this._customReply=true;this.setAggregation("customReply",R,true);}else{this._customReply=false;}};l.prototype.setReplyList=function(i){if(i===null){return;}this.setAggregation("replyList",i,true);var t=this;this.getReplyList().attachUpdateFinished(function(E){var F=t._objects.getReplyInputArea().getDomRef("inner");if(F){q(F.id).focus();}});};l.prototype.getDateTime=function(){var o=this.getProperty("dateTime");o=f.parseDate(o);if(typeof(o)==="string"&&this instanceof sap.suite.ui.commons.TimelineItem&&this.getBindingPath("dateTime")&&this.getBindingContext()){var p=this.getBindingPath("dateTime");var i=this.getBindingContext().getProperty(p);if(i instanceof Date){return i;}else{return o;}}else{return o;}};return l;});
