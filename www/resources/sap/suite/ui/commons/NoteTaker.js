/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'sap/ui/commons/library','sap/ui/commons/Carousel','sap/ui/commons/Button','sap/ui/commons/ListBox','sap/ui/commons/SearchField','sap/ui/core/Control','sap/suite/ui/commons/NoteTakerCard','sap/suite/ui/commons/NoteTakerFeeder','sap/ui/core/ListItem','sap/ui/model/Filter','sap/ui/model/FilterOperator','sap/ui/model/Sorter',"sap/ui/events/KeyCodes"],function(q,C,a,B,L,S,b,N,c,d,F,f,g,K){"use strict";var h=b.extend("sap.suite.ui.commons.NoteTaker",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{visibleNotes:{type:"int",group:"Misc",defaultValue:2},cardViewAllTrigger:{type:"int",group:"Misc",defaultValue:1800},filterCriteria:{type:"object",group:"Misc",defaultValue:null},attachmentUploadUrl:{type:"string",group:"Misc",defaultValue:null},attachmentName:{type:"string",group:"Misc",defaultValue:'attachment'}},aggregations:{cards:{type:"sap.suite.ui.commons.NoteTakerCard",multiple:true,singularName:"card"},carousel:{type:"sap.ui.commons.Carousel",multiple:false,visibility:"hidden"}},events:{addCard:{parameters:{title:{type:"string"},body:{type:"string"},timestamp:{type:"object"},viewAllTrigger:{type:"int"},thumbUp:{type:"boolean"},thumbDown:{type:"boolean"},attachmentFilename:{type:"string"},uid:{type:"string"},attachmentUrl:{type:"string"},card:{type:"sap.suite.ui.commons.NoteTakerCard"}}},deleteCard:{parameters:{title:{type:"string"},body:{type:"string"},timestamp:{type:"string"},uid:{type:"string"},thumbUp:{type:"boolean"},thumbDown:{type:"boolean"}}},editCard:{parameters:{title:{type:"string"},body:{type:"string"},timestamp:{type:"string"},uid:{type:"string"},thumbUp:{type:"boolean"},thumbDown:{type:"boolean"},tags:{type:"object"}}},attachmentSelect:{parameters:{filename:{type:"string"}}},attachmentUploadComplete:{parameters:{response:{type:"string"},uid:{type:"string"}}},attachmentDelete:{parameters:{filename:{type:"string"},uid:{type:"string"}}},attachmentClick:{parameters:{uid:{type:"string"},isCardAttachment:{type:"string"},filename:{type:"string"}}}}}});h.prototype.init=function(){this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");this._bFilterTagPopupOpen=false;this._bSearchPopupOpen=false;this._carousel=new a({id:this.getId()+"-carousel",height:"540px"});this.setAggregation("carousel",this._carousel);this._carousel.addContent(this._createFeederAndAddToThis());this._notFilteredCards=[];this._oHomeButton=new B({id:this.getId()+"-home-button",tooltip:this._rb.getText("NOTETAKER_BUTTON_HOME_TOOLTIP"),press:[this._handleHomeButton,this]});this._oHomeButton.addStyleClass("sapSuiteUiCommonsNoteTakerHomeButton");this._oFilterTagButton=new B({id:this.getId()+"-filterTag-button",tooltip:this._rb.getText("NOTETAKER_BUTTON_FILTER_TAG_TOOLTIP"),press:[this._toggleFilterTagPopup,this]});this._oFilterTagButton.addStyleClass("sapSuiteUiCommonsNoteTakerFilterTagButton");this._oFilterThumbUpButton=new B({id:this.getId()+"-filter-thumb-up-button",tooltip:this._rb.getText("NOTETAKER_BUTTON_FILTER_THUMB_UP_TOOLTIP"),press:[this._handleFilteringByThumbUp,this]});this._oFilterThumbUpButton.addStyleClass("sapSuiteUiCommonsNoteTakerFilterThumbUpButton");this._oFilterThumbDownButton=new B({id:this.getId()+"-filter-thumb-down-button",tooltip:this._rb.getText("NOTETAKER_BUTTON_FILTER_THUMB_DOWN_TOOLTIP"),press:[this._handleFilteringByThumbDown,this]});this._oFilterThumbDownButton.addStyleClass("sapSuiteUiCommonsNoteTakerFilterThumbDownButton");this._oFilterAllButton=new B({id:this.getId()+"-filterAll-button",text:this._rb.getText("NOTETAKER_BUTTON_FILTER_ALL_TEXT"),tooltip:this._rb.getText("NOTETAKER_BUTTON_FILTER_ALL_TOOLTIP"),press:[this._handleResetFilters,this]});this._oFilterAllButton.addStyleClass("sapSuiteUiCommonsNoteTakerFilterAllButton");this._oSearchButton=new B({id:this.getId()+"-filter-search-button",tooltip:this._rb.getText("NOTETAKER_BUTTON_SEARCH_TOOLTIP"),press:[this._handleSearchPopup,this]});this._oSearchButton.addStyleClass("sapSuiteUiCommonsNoteTakerSearchBtn");this._oFilterSearchField=new S({id:this.getId()+"-filter-searchField",tooltip:this._rb.getText("NOTETAKER_BUTTON_SEARCH_TOOLTIP"),showListExpander:false,enableFilterMode:true,enableListSuggest:false,search:[this._handleSearchingByText,this]});this._oFilterSearchField.addStyleClass("suiteUiNtFilterSearchField");this._oFilterTagList=new L({id:this.getId()+"-filterTag-listBox",allowMultiSelect:true,visibleItems:10,width:"100%",height:"194px"});this._oCancelFilterTagButton=new B({id:this.getId()+"-cancel-filterTags-button",text:this._rb.getText("NOTETAKERFEEDER_BUTTON_CANCEL_TAGS"),tooltip:this._rb.getText("NOTETAKERFEEDER_BUTTON_CANCEL_TAGS_TOOLTIP"),press:[this._toggleFilterTagPopup,this]});this._oCancelFilterTagButton.addStyleClass("sapSuiteUiCommonsNoteTakerCancelFilterTagButton");this._oCancelFilterTagButton.onfocusout=function(e){this._oFilterTagList.focus();}.bind(this);this._oApplyFilterTagButton=new B({id:this.getId()+"-apply-filterTags-button",text:this._rb.getText("NOTETAKER_BUTTON_FILTER_TAG_APPLY_TEXT"),tooltip:this._rb.getText("NOTETAKER_BUTTON_FILTER_TAG_APPLY_TOOLTIP"),press:[this._toggleFilterTagPopup,this]});};h.prototype.onBeforeRendering=function(){this._carousel.setVisibleItems(this.getVisibleNotes());this._adjustFilteringButtonsStyle();this._feeder.setAttachmentName(this.getAttachmentName());};h.prototype.onAfterRendering=function(){this._adjustPopupState();if(!this.getAttachmentUploadUrl()){q(document.getElementById(this._feeder._oAddAttachButton.getId())).hide();}q(document.getElementById(this._oFilterThumbUpButton.getId())).attr("aria-pressed",this.getFilterCriteria()&&this.getFilterCriteria().thumbUp);q(document.getElementById(this._oFilterThumbDownButton.getId())).attr("aria-pressed",this.getFilterCriteria()&&this.getFilterCriteria().thumbDown);};h.prototype.exit=function(){this.destroyAggregation("carousel",true);this._carousel=null;this._oHomeButton.destroy();this._oHomeButton=null;this._oFilterTagButton.destroy();this._oFilterTagButton=null;this._oFilterThumbUpButton.destroy();this._oFilterThumbUpButton=null;this._oFilterThumbDownButton.destroy();this._oFilterThumbDownButton=null;this._oFilterAllButton.destroy();this._oFilterAllButton=null;this._oFilterTagList.destroy();this._oFilterTagList=null;this._oCancelFilterTagButton.destroy();this._oCancelFilterTagButton=null;this._oApplyFilterTagButton.destroy();this._oApplyFilterTagButton=null;this._oFilterSearchField.destroy();this._oFilterSearchField=null;this._oSearchButton.destroy();this._oSearchButton=null;};h.prototype._handleAddNote=function(e){var t=e.getParameter("title");var i=e.getParameter("body");var j=e.getParameter("timestamp");var k=e.getParameter("tags");var l=e.getParameter("thumbUp");var m=e.getParameter("thumbDown");var n=e.getParameter("attachmentFilename");var o={};o.title=t;o.body=i;o.timestamp=j;o.viewAllTrigger=this.getCardViewAllTrigger();o.tags=k;o.thumbUp=l;o.thumbDown=m;o.attachmentFilename=n;o.uid=this._nextCardUid;o.attachmentUrl=this._nextCardAttachmentUrl;var p=this.getBinding("cards");if(p){this.fireAddCard(o);var T=new g("timestamp",true);p.sort(T);}else{var r=new N();r.setBody(i);r.setHeader(t);r.setTimestamp(j);r.setViewAllTrigger(this.getCardViewAllTrigger());r.setTags(k);r.setThumbUp(l);r.setThumbDown(m);r.setAttachmentFilename(n);r.setUid(this._nextCardUid);r.setAttachmentUrl(this._nextCardAttachmentUrl);this.insertCard(r,0);o.card=r;this.fireAddCard(o);}this._nextCardUid=null;this._nextCardAttachmentUrl=null;this._filter();};h.prototype.addCard=function(o){this._addDeleteDelegate(o);this._addEditDelegate(o);this._addAttachmentDelegate(o);this.getNotFilteredCards().push(o);this._carousel.addContent(o);this._sortIfNeeded();this._spreadTagList();return this;};h.prototype.getCards=function(){return this._carousel.getContent().slice(1);};h.prototype.insertCard=function(o,i){this._addDeleteDelegate(o);this._addEditDelegate(o);this._addAttachmentDelegate(o);this.getNotFilteredCards().push(o);this._carousel.insertContent(o,++i);this._spreadTagList();return this;};h.prototype.removeCard=function(o){this._spreadTagList();return this._carousel.removeContent(o);};h.prototype.removeAllCards=function(){var e=this._carousel.removeAllContent();this._feeder.setTags([]);this._carousel.addContent(this._feeder);return e.slice(1);};h.prototype.indexOfCard=function(o){var i=this._carousel.indexOfContent(o);return(i>0)?--i:-1;};h.prototype.destroyCards=function(){this._carousel.destroyContent();this._carousel.addContent(this._createFeederAndAddToThis());return this;};h.prototype._createFeederAndAddToThis=function(){var t=this;this._feeder=new c({id:this.getId()+"-feeder",attachmentName:this.getAttachmentName(),addNote:[this._handleAddNote,this],attachmentUploadUrl:this.getAttachmentUploadUrl(),attachmentSelect:function(e){var i={filename:e.getParameter("filename")};this.fireAttachmentSelect(i);}.bind(this),attachmentUploadComplete:function(e){var i={response:e.getParameter("response"),uid:t._nextCardUid};t.fireAttachmentUploadComplete(i);this._oAttachmentLink.setHref(t._nextCardAttachmentUrl);this._oAttachmentLink.rerender();},attachmentDelete:function(e){var i={filename:e.getParameter("filename"),uid:this._nextCardUid};this.fireAttachmentDelete(i);}.bind(this),attachmentClick:function(e){var i={filename:e.getParameter("filename"),uid:this._nextCardUid,isCardAttachment:false};this.fireAttachmentClick(i);}.bind(this)});this._spreadTagList();return this._feeder;};h.prototype._sortIfNeeded=function(){var o=this.getBinding();if(o===undefined){var e=this.getCards();e.sort(function(j,k){return k.getTimestamp().getTime()-j.getTimestamp().getTime();});this.removeAllCards();for(var i=0;i<e.length;i++){this._carousel.addContent(e[i]);}}};h.prototype.getAllTags=function(){var o=this.getBinding("cards");var e=o?this.getCards():this.getNotFilteredCards();var t={};var r=[];for(var i=0;i<e.length;i++){var T=e[i].getTags();for(var j=0;j<T.length;j++){if(T[j]!==""){t[T[j]]=true;}}}for(var k in t){r.push(k);}return r.sort();};h.prototype._handleDeleteNote=function(e){var o=this.getBinding("cards");var j={};j.title=e.getParameter("title");j.timestamp=e.getParameter("timestamp");j.body=e.getParameter("body");j.uid=e.getParameter("uid");j.thumbUp=e.getParameter("thumbUp");j.thumbDown=e.getParameter("thumbDown");if(o){this.fireDeleteCard(j);}else{var k=e.getParameter("cardId");var l=this.getNotFilteredCards();for(var i=0;i<l.length;i++){if(l[i].getId()===k){l.splice(i,1);}}this.removeCard(k);this.fireDeleteCard(j);}};h.prototype._handleEditNote=function(e){var i={};i.title=e.getParameter("title");i.timestamp=e.getParameter("timestamp");i.body=e.getParameter("body");i.uid=e.getParameter("uid");i.thumbUp=e.getParameter("thumbUp");i.thumbDown=e.getParameter("thumbDown");i.tags=e.getParameter("tags");this.fireEditCard(i);this._sortIfNeeded();this._spreadTagList();};h.prototype._addDeleteDelegate=function(o){o.attachDeleteNote(function(e){this._handleDeleteNote(e);},this);};h.prototype._addEditDelegate=function(o){o.attachEditNote(function(e){this._handleEditNote(e);},this);};h.prototype._handleHomeButton=function(){this._carousel.setFirstVisibleIndex(0);this._feeder._focusDefaultControl();};h.prototype.setFilterCriteria=function(o){this.setProperty("filterCriteria",o);this._filter();return this;};h.prototype._toggleFilterTagPopup=function(){if(this._bFilterTagPopupOpen){q(document.getElementById(this.getId()+"-filterTag-panel")).slideToggle();this._bFilterTagPopupOpen=false;}else{this._addTagsToFilterListBox(this.getAllTags());q(document.getElementById(this.getId()+"-filterTag-panel")).slideToggle();this._oFilterTagList.focus();this._bFilterTagPopupOpen=true;}setTimeout(function(){this._handleFilteringByTags();}.bind(this),400);};h.prototype._addTagsToFilterListBox=function(t){var s=[];var e=this._getFilterTags();var l=q.map(t,function(v,i){if(e.indexOf){if(e.indexOf(v)>=0){s.push(i);}}else{for(var k in e){if(e[k]===v){s.push(i);break;}}}return new d({text:v});});this._oFilterTagList.setItems(l,true);this._oFilterTagList.setSelectedIndices(s);this._oFilterTagList.rerender();};h.prototype._cloneFilterCriteria=function(){var o=this.getFilterCriteria();var n={};if(o){for(var p in o){n[p]=o[p];}}return n;};h.prototype._handleFilteringByTags=function(){var o=this._cloneFilterCriteria();var s=this._oFilterTagList.getSelectedItems();var t=[];for(var i in s){t.push(s[i].getText());}o.tags=t;this.setFilterCriteria(o);};h.prototype._handleFilteringByThumbUp=function(){var o=this._cloneFilterCriteria();o.thumbUp=!o.thumbUp;this.setFilterCriteria(o);};h.prototype._handleFilteringByThumbDown=function(){var o=this._cloneFilterCriteria();o.thumbDown=!o.thumbDown;this.setFilterCriteria(o);};h.prototype._handleResetFilters=function(){var o=this.getFilterCriteria();var n=null;if(o&&o.search&&o.search.length>0){n={};n.search=o.search;}this.setFilterCriteria(n);};h.prototype._handleSearchingByText=function(e){var s=e.getParameter("query");var o=this._cloneFilterCriteria();var j=[];var n=s.split(new RegExp("\\s+"));for(var i=0;i<n.length;i++){if(n[i].length>0){j.push(n[i]);}}o.search=j;this.setFilterCriteria(o);};h.prototype._adjustFilterTagButton=function(){var e=this._getFilterTags();if(e.length){this._oFilterTagButton.setTooltip(this._rb.getText("NOTETAKER_BUTTON_FILTER_TAG_APPLY_SELECTED_TOOLTIP")+": "+e.join(" "));this._oFilterTagButton.addStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected");}else{this._oFilterTagButton.setTooltip(this._rb.getText("NOTETAKER_BUTTON_FILTER_TAG_TOOLTIP"));this._oFilterTagButton.removeStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected");}};h.prototype._handleSearchPopup=function(){if(this._bSearchPopupOpen){q(document.getElementById(this.getId()+"-search-panel")).slideToggle();this._bSearchPopupOpen=false;}else{var p=q(document.getElementById(this.getId()+"-filter-search-button")).position();q(document.getElementById(this.getId()+"-search-panel")).css("right",p.right-20).slideToggle();this._oFilterSearchField.focus();this._bSearchPopupOpen=true;}};h.prototype._adjustSearchButton=function(){var s=this._oFilterSearchField.getValue();if(s.length){this._oSearchButton.setTooltip(this._rb.getText("NOTETAKER_BUTTON_SEARCHED_BY_TOOLTIP")+": "+s);this._oFilterSearchField.setTooltip(this._rb.getText("NOTETAKER_BUTTON_SEARCHED_BY_TOOLTIP")+": "+s);this._oSearchButton.addStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected");}else{this._oSearchButton.setTooltip(this._rb.getText("NOTETAKER_BUTTON_SEARCH_TOOLTIP"));this._oFilterSearchField.setTooltip(this._rb.getText("NOTETAKER_BUTTON_SEARCH_TOOLTIP"));this._oSearchButton.removeStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected");}};h.prototype._getFilterTags=function(){var o=this.getFilterCriteria();if(o&&o.tags&&o.tags.length){return o.tags;}else{return[];}};h.prototype._adjustPopupState=function(){var t=q(document.getElementById(this.getId()+"-filterTag-button")).position();q(document.getElementById(this.getId()+"-filterTag-panel")).css("left",t.left-20);if(this._bFilterTagPopupOpen){q(document.getElementById(this.getId()+"-filterTag-panel")).show();}if(this._bSearchPopupOpen){q(document.getElementById(this.getId()+"-search-panel")).show();}};h.prototype._adjustFilteringButtonsStyle=function(){this._adjustFilterTagButton();this._adjustFilteringByThumbUpButtonStyle();this._adjustFilteringByThumbDownButtonStyle();this._adjustSearchButton();};h.prototype._adjustFilteringByThumbUpButtonStyle=function(){if(this.getFilterCriteria()&&this.getFilterCriteria().thumbUp){this._oFilterThumbUpButton.addStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected");}else{this._oFilterThumbUpButton.removeStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected");}};h.prototype._adjustFilteringByThumbDownButtonStyle=function(){if(this.getFilterCriteria()&&this.getFilterCriteria().thumbDown){this._oFilterThumbDownButton.addStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected");}else{this._oFilterThumbDownButton.removeStyleClass("sapSuiteUiCommonsNoteTakerFilterButtonSelected");}};h.prototype.getNotFilteredCards=function(){if(!this._notFilteredCards){this._notFilteredCards=[];}return this._notFilteredCards;};h.prototype._spreadTagList=function(){var A=this.getAllTags();this._feeder.setTags(A);var e=this.getCards();for(var i=0;i<e.length;i++){e[i].setAllTags(A);}};h.prototype._filter=function(){var o=this.getBinding("cards");var e;var i;if(o){var m=this.getModel().oData['cards'];for(i=0;i<m.length;i++){e=m[i];e.isFiltered=this._applyFilters(e);}this.getModel().updateBindings();o.filter([new F("isFiltered",f.EQ,false)]);}else{var n=this.getNotFilteredCards();var v=this.getCards();if(n.length===0&&v.length>0){this.setNotFilteredCards(v);n=v;}for(i=0;i<n.length;i++){e=n[i];e.setIsFiltered(this._applyFilters(e));if(e.getIsFiltered()){this.removeCard(e);}else if(this.indexOfCard(e)<0){this.addCard(e);}}}};h.prototype._applyFilters=function(o){var e=true;if(this.getFilterCriteria()){for(var i=0;(i<this._filters.length)&&e;i++){var j=this._filters[i];e=j.call(this,o);}}return!e;};h.prototype._validateCardByThumbsFilter=function(o){if(o.getThumbUp&&o.getThumbDown){return this._applyThumbsFilter(o.getThumbUp(),o.getThumbDown());}else{return this._applyThumbsFilter(o.thumbUp,o.thumbDown);}};h.prototype._validateCardByTagsFilter=function(o){if(o.getTags){return this._applyTagsFilter(o.getTags());}else{return this._applyTagsFilter(o.tags);}};h.prototype._validateCardByTextSearch=function(o){if(o.getBody){return this._applyTextSearch(o.getBody(),o.getHeader());}else{return this._applyTextSearch(o.body,o.header);}};h.prototype._applyThumbsFilter=function(t,T){var r=true;var o=this.getFilterCriteria();if(o.thumbUp&&o.thumbDown){r=t||T;}else if(o.thumbUp){r=t;}else if(o.thumbDown){r=T;}return r;};h.prototype._applyTagsFilter=function(t){var r=true;var o=this.getFilterCriteria();if(o.tags&&o.tags.length>0){var i,j;var T=o.tags;r=false;for(i=0;i<T.length&&!r;i++){for(j=0;t&&(j<t.length);j++){if(T[i]===t[j]){r=true;break;}}}}return r;};h.prototype._applyTextSearch=function(s,H){var r=true;var o=this.getFilterCriteria();if(o.search&&o.search.length>0){var e=o.search;r=false;s=s.toLowerCase();H=H?H.toLowerCase():null;for(var i=0;i<e.length;i++){var w=e[i].toLowerCase();if((s.indexOf(w)>=0)||(H&&H.indexOf(w)>=0)){r=true;break;}}}return r;};h.prototype.setAttachmentUploadUrl=function(u){this.setProperty("attachmentUploadUrl",u,true);this._feeder.setAttachmentUploadUrl(u);return this;};h.prototype._filters=[h.prototype._validateCardByThumbsFilter,h.prototype._validateCardByTagsFilter,h.prototype._validateCardByTextSearch];h.prototype.setNextCardUid=function(u){this._nextCardUid=u;return this;};h.prototype._addAttachmentDelegate=function(o){o.attachAttachmentClick(function(e){this._handleCardAttachmentClick(e);},this);};h.prototype._handleCardAttachmentClick=function(e){var i={filename:e.getParameter("filename"),uid:e.getParameter("uid"),isCardAttachment:true};this.fireAttachmentClick(i);};h.prototype.uploadAttachment=function(){this._feeder._oFileUploader.upload();};h.prototype.setAttachmentData=function(A){this._feeder._oFileUploader.setAdditionalData(A);return this;};h.prototype.handleAttachmentUploadFail=function(){this._feeder._handleDeleteAttachUI();return this;};h.prototype.setNextCardAttachmentUrl=function(u){this._nextCardAttachmentUrl=u;return this;};h.prototype.onkeyup=function(e){if(e.which===K.ESCAPE){if(this._feeder._bTagPopupOpen){this._feeder._toggleTagPopup();this._feeder._oTagButton.focus();}if(this._bFilterTagPopupOpen){this._toggleFilterTagPopup();this._oFilterTagButton.focus();}}};return h;});