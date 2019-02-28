/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./TableExtension","./TableUtils","./library"],function(T,a,l){"use strict";var S=l.SelectionMode;var _=function(r,p,i,t,c){c=c||[];c.push("sapUiInvisibleText");r.write("<span");r.writeAttribute("id",p+"-"+i);r.writeAttribute("class",c.join(" "));r.writeAttribute("aria-hidden","true");r.write(">");if(t){r.writeEscaped(t);}r.write("</span>");};var A=T.extend("sap.ui.table.TableAccRenderExtension",{_init:function(t,s,m){return"AccRenderExtension";},writeHiddenAccTexts:function(r,t){if(!t._getAccExtension().getAccMode()){return;}var s=t.getId();r.write("<div class='sapUiTableHiddenTexts' style='display:none;' aria-hidden='true'>");var d=t.getTitle()&&t.getTitle().getText&&t.getTitle().getText()!=""?t.getTitle().getText():"";_(r,s,"ariadesc",d);_(r,s,"ariacount");_(r,s,"toggleedit",a.getResourceText("TBL_TOGGLE_EDIT_KEY"));_(r,s,"ariaselectall",a.getResourceText("TBL_SELECT_ALL"));_(r,s,"ariarowheaderlabel",a.getResourceText("TBL_ROW_HEADER_LABEL"));_(r,s,"ariarowgrouplabel",a.getResourceText("TBL_ROW_GROUP_LABEL"));_(r,s,"ariagrandtotallabel",a.getResourceText("TBL_GRAND_TOTAL_ROW"));_(r,s,"ariagrouptotallabel",a.getResourceText("TBL_GROUP_TOTAL_ROW"));_(r,s,"ariacolrowheaderlabel",a.getResourceText("TBL_ROW_COL_HEADER_LABEL"));_(r,s,"rownumberofrows");_(r,s,"colnumberofcols");_(r,s,"cellacc");_(r,s,"ariarowselected",a.getResourceText("TBL_ROW_DESC_SELECTED"));_(r,s,"ariacolmenu",a.getResourceText("TBL_COL_DESC_MENU"));_(r,s,"ariacolspan");_(r,s,"ariacolfiltered",a.getResourceText("TBL_COL_DESC_FILTERED"));_(r,s,"ariacolsortedasc",a.getResourceText("TBL_COL_DESC_SORTED_ASC"));_(r,s,"ariacolsorteddes",a.getResourceText("TBL_COL_DESC_SORTED_DES"));_(r,s,"ariainvalid",a.getResourceText("TBL_TABLE_INVALID"));_(r,s,"ariashowcolmenu",a.getResourceText("TBL_COL_VISBILITY_MENUITEM_SHOW"));_(r,s,"ariahidecolmenu",a.getResourceText("TBL_COL_VISBILITY_MENUITEM_HIDE"));_(r,s,"rowexpandtext",a.getResourceText("TBL_ROW_EXPAND_KEY"));_(r,s,"rowcollapsetext",a.getResourceText("TBL_ROW_COLLAPSE_KEY"));var o=t.getSelectionMode();if(o!==S.None){_(r,s,"ariaselection",a.getResourceText(o==S.MultiToggle?"TBL_TABLE_SELECTION_MULTI":"TBL_TABLE_SELECTION_SINGLE"));}if(t.getComputedFixedColumnCount()>0){_(r,s,"ariafixedcolumn",a.getResourceText("TBL_FIXED_COLUMN"));}r.write("</div>");},writeAriaAttributesFor:function(r,t,s,p){var e=t._getAccExtension();if(!e.getAccMode()){return;}var m=e.getAriaAttributesFor(s,p);var v,k;for(k in m){v=m[k];if(Array.isArray(v)){v=v.join(" ");}if(v){r.writeAttributeEscaped(k,v);}}},writeAccRowSelectorText:function(r,t,R,i){if(!t._getAccExtension().getAccMode()){return;}var I=t.isIndexSelected(i);var m=t._getAccExtension().getAriaTextsForSelectionMode(true);var s=m.keyboard[I?"rowDeselect":"rowSelect"];_(r,R.getId(),"rowselecttext",R._bHidden?"":s,["sapUiTableAriaRowSel"]);},writeAccRowHighlightText:function(r,t,R,i){if(!t._getAccExtension().getAccMode()){return;}var o=R.getAggregation("_settings");var h=o._getHighlightText();_(r,R.getId(),"highlighttext",h);}});return A;});
