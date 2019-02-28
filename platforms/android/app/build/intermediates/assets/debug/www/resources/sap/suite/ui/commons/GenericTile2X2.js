/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'./library','sap/m/Text','sap/m/Image','sap/ui/core/Control','sap/ui/core/IconPool','sap/ui/core/Icon','sap/ui/core/HTML','sap/ui/Device',"sap/ui/events/KeyCodes","sap/base/util/deepEqual"],function(q,l,T,I,C,a,b,H,D,K,d){"use strict";var G=C.extend("sap.suite.ui.commons.GenericTile2X2",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{header:{type:"string",group:"Appearance",defaultValue:null},subheader:{type:"string",group:"Appearance",defaultValue:null},failedText:{type:"string",group:"Appearance",defaultValue:null},size:{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:"Auto"},backgroundImage:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},headerImage:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},frameType:{type:"sap.suite.ui.commons.FrameType",group:"Misc",defaultValue:"OneByOne"},state:{type:"sap.suite.ui.commons.LoadState",group:"Misc",defaultValue:"Loaded"},imageDescription:{type:"string",group:"Misc",defaultValue:null}},aggregations:{tileContent:{type:"sap.suite.ui.commons.TileContent2X2",multiple:true,singularName:"tileContent"},icon:{type:"sap.ui.core.Control",multiple:false},titleText:{type:"sap.m.Text",multiple:false,visibility:"hidden"},failedMessageText:{type:"sap.m.Text",multiple:false,visibility:"hidden"}},events:{press:{}}}});G.prototype.init=function(){this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");this._oTitle=new T(this.getId()+"-title",{maxLines:2});this._oTitle.addStyleClass("sapSuiteGTTitle");this._oTitle.cacheLineHeight=false;this.setAggregation("titleText",this._oTitle);this._sFailedToLoad=this._rb.getText("INFOTILE_CANNOT_LOAD_TILE");this._oFailed=new T(this.getId()+"-failed-txt",{maxLines:2});this._oFailed.cacheLineHeight=false;this._oFailed.addStyleClass("sapSuiteGTFailed");this.setAggregation("failedMessageText",this._oFailed);this._oWarningIcon=new b(this.getId()+"-warn-icon",{src:"sap-icon://notification",size:"1.37rem"});this._oWarningIcon.addStyleClass("sapSuiteGTFtrFldIcnMrk");this._oBusy=new H(this.getId()+"-overlay");this._oBusy.addStyleClass("sapSuiteGenericTile2X2Loading");this._oBusy.setBusyIndicatorDelay(0);};G.prototype.ontap=function(e){if(D.browser.internet_explorer){this.$().focus();}this.firePress();};G.prototype.onkeydown=function(e){if(e.which==K.SPACE){e.preventDefault();}};G.prototype.onkeyup=function(e){if(e.which==K.ENTER||e.which==K.SPACE){this.firePress();e.preventDefault();}};G.prototype._handleOvrlClick=function(e){e.stopPropagation();};G.prototype.onBeforeRendering=function(){var t=this.getTileContent().length;for(var i=0;i<t;i++){this.getTileContent()[i].setDisabled(this.getState()==="Disabled",true);}var c=this.getFailedText();var f=c?c:this._sFailedToLoad;this._oFailed.setText(f);this._oFailed.setTooltip(f);};G.prototype.onAfterRendering=function(){this._checkFooter(this.getState());if(this.getState()==="Disabled"){this._oBusy.$().bind("tap",q.proxy(this._handleOvrlClick,this));}else{this._oBusy.$().unbind("tap",this._handleOvrlClick);}};G.prototype.getHeader=function(){return this._oTitle.getText();};G.prototype.setHeader=function(t){this._oTitle.setProperty("text",t,true);this.invalidate();return this;};G.prototype.exit=function(){this._oWarningIcon.destroy();if(this._oImage){this._oImage.destroy();}this._oBusy.destroy();};G.prototype.setHeaderImage=function(i){var v=!d(this.getHeaderImage(),i);if(v){if(this._oImage){this._oImage.destroy();this._oImage=undefined;}if(i){this._oImage=a.createControlByURI({id:this.getId()+"-icon-image",src:i},I);this._oImage.addStyleClass("sapSuiteGTHdrIconImage");}}return this.setProperty("headerImage",i);};G.prototype.attachEvent=function(e,o,f,L){C.prototype.attachEvent.call(this,e,o,f,L);if(this.hasListeners("press")&&this.getState()!="Disabled"){this.$().attr("tabindex",0).addClass("sapSuiteUiCommonsPointer");}return this;};G.prototype.setState=function(s,i){this._checkFooter(s);this.setProperty("state",s,i);return this;};G.prototype._checkFooter=function(s){var t=q(document.getElementById(this.getId())).find(".sapSuiteTileCntFtrTxt");if(s==="Failed"&&t.is(":visible")){t.hide();}else if(t.is(":hidden")){t.show();}};G.prototype.detachEvent=function(e,f,L){C.prototype.detachEvent.call(this,e,f,L);if(!this.hasListeners("press")){this.$().removeAttr("tabindex").removeClass("sapSuiteUiCommonsPointer");}return this;};G.prototype.onsaptouchstart=function(e){this.addStyleClass("sapSuiteGTHvrOutln");};G.prototype.onsaptouchend=function(e){this.removeStyleClass("sapSuiteGTHvrOutln");};G.prototype.ontouchstart=function(e){this.addStyleClass("sapSuiteGTHvrOutln");};G.prototype.ontouchend=function(e){this.removeStyleClass("sapSuiteGTHvrOutln");};G.prototype.getHeaderAltText=function(){var A="";var i=true;if(this.getHeader()){A+=this.getHeader();i=false;}if(this.getSubheader()){A+=(i?"":"\n")+this.getSubheader();i=false;}if(this.getImageDescription()){A+=(i?"":"\n")+this.getImageDescription();}return A;};G.prototype.getBodyAltText=function(){var A="";var c=true;var t=this.getTileContent();for(var i=0;i<t.length;i++){if(t[i].getAltText){A+=(c?"":"\n")+t[i].getAltText();c=false;}else if(t[i].getTooltip_AsString()){A+=(c?"":"\n")+t[i].getTooltip_AsString();c=false;}}return A;};G.prototype.getAltText=function(){return this.getHeaderAltText()+"\n"+this.getBodyAltText();};return G;});
