/**
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/HTML"],function(H){"use strict";var F={};F.render=function(r,f){r.write("<div");r.writeControlData(f);r.write(">");if(f._shouldTextBeRendered()){var i=f.getId();r.write("<div id='"+i+"'>");if(f._sText.length>f.nMaxCollapsedLength){f.getCollapsedText();r.write("<div id='"+i+"-collapsed-text'");r.addClass("sapUiTinyMarginBottom sapCollaborationEmbeddedText");r.writeClasses();r.write(">");this._renderText(r,f,f._sCollapsedTextWithPlaceholders);r.write("<span");r.addClass("sapCollaborationEmbeddedTextSpace");r.writeClasses();r.write("></span>");if(f.oExpandLink===undefined){f.oExpandLink=f.createExpandCollapseLink("TE_MORE");r.renderControl(f.oExpandLink);}else{r.renderControl(f.oExpandLink);}r.write("</div>");r.write("<div id='"+i+"-expanded-text'");r.addClass("sapUiTinyMarginBottom sapCollaborationEmbeddedText");r.writeClasses();r.write(">");this._renderText(r,f,f._sTextWithPlaceholders);r.write("<span");r.addClass("sapCollaborationEmbeddedTextSpace");r.writeClasses();r.write("></span>");if(f.oCollapseLink===undefined){f.oCollapseLink=f.createExpandCollapseLink("TE_LESS");r.renderControl(f.oCollapseLink);}else{r.renderControl(f.oCollapseLink);}r.write("</div>");}else{r.write("<div id='"+i+"-expanded-text'");r.addClass("sapUiTinyMarginBottom sapCollaborationEmbeddedText");r.writeClasses();r.write(">");this._renderText(r,f,f._sTextWithPlaceholders);r.write("</div>");}r.write("</div>");}if(f._shouldContentBeRendered()){r.renderControl(f._oTimelineItemContent);}r.write("</div>");};F._renderText=function(r,f,t){var T=f._splitByPlaceholders(t);for(var i=0;i<T.length;i++){var a=/@@.\{\d+\}/;if(a.test(T[i])){r.renderControl(f._mAtMentionsLinks[T[i]]);}else if(f.getProperty("feedEntry").ContentType==="text/html"){var h="<span>"+T[i]+"</span>";var d=jQuery.parseHTML(h)[0];var $=jQuery(d).find("a");if($.length!==0){$.attr("target","_blank");h=d.outerHTML;}r.renderControl(new H({content:h,sanitizeContent:true}));}else{r.writeEscaped(T[i],true);}}};return F;},true);
