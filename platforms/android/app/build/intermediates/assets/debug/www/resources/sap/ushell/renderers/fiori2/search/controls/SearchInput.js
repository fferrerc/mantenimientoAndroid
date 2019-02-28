sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchHelper','sap/ushell/renderers/fiori2/search/SearchConfiguration','sap/m/Input','sap/ushell/renderers/fiori2/search/suggestions/SuggestionType','sap/ui/layout/HorizontalLayout','sap/ui/layout/VerticalLayout','sap/base/Log','sap/ushell/renderers/fiori2/search/controls/SearchObjectSuggestionImage'],function(S,a,I,b,H,V,L,c){"use strict";sap.m.Input.extend('sap.ushell.renderers.fiori2.search.controls.SearchInput',{constructor:function(i,o){var t=this;o=jQuery.extend({},{width:'100%',showValueStateMessage:false,showTableSuggestionValueHelp:false,enableSuggestionsHighlighting:false,showSuggestion:true,filterSuggests:false,suggestionColumns:[new sap.m.Column({})],placeholder:{path:'/searchTermPlaceholder',mode:sap.ui.model.BindingMode.OneWay},liveChange:this.handleLiveChange.bind(this),suggestionItemSelected:this.handleSuggestionItemSelected.bind(this),enabled:{parts:[{path:"/initializingObjSearch"}],formatter:function(d){return!d;}}},o);var p=sap.ui.Device.system.phone;sap.ui.Device.system.phone=false;sap.m.Input.prototype.constructor.apply(this,[i,o]);sap.ui.Device.system.phone=p;this.bindAggregation("suggestionRows","/suggestions",function(i,C){return t.suggestionItemFactory(i,C);});this.addStyleClass('searchInput');this._bUseDialog=false;this._bFullScreen=false;this._ariaDescriptionIdNoResults=i+"-No-Results-Description";this._isSuggestionItemSelectable=function(d){var s=d.getBindingContext().getObject();if(s.uiSuggestionType===b.Header||s.uiSuggestionType===b.BusyIndicator){return false;}return true;};},renderer:'sap.m.InputRenderer',onsapenter:function(e){if(!(this._oSuggestionPopup&&this._oSuggestionPopup.isOpen()&&this._iPopupListSelectedIndex>=0)){this.getModel().invalidateQuery();this.triggerSearch(e);}sap.m.Input.prototype.onsapenter.apply(this,arguments);},triggerSearch:function(e){var t=this;S.subscribeOnlyOnce('triggerSearch','allSearchFinished',function(){t.getModel().autoStartApp();},t);var s=t.getValue();if(s.trim()===''){s='*';}t.getModel().setSearchBoxTerm(s,false);t.navigateToSearchApp();t.destroySuggestionRows();t.getModel().abortSuggestions();},handleLiveChange:function(e){var s=this.getValue();var m=this.getModel();m.setSearchBoxTerm(s,false);if(m.getSearchBoxTerm().length>0){m.doSuggestion();}else{this.destroySuggestionRows();m.abortSuggestions();}},handleSuggestionItemSelected:function(e){var m=this.getModel();var s=m.getSearchBoxTerm();var d=e.getParameter('selectedRow').getBindingContext().getObject();var f=d.searchTerm||'';var g=d.dataSource||m.getDataSource();var t=d.url;var h=d.uiSuggestionType;m.eventLogger.logEvent({type:m.eventLogger.SUGGESTION_SELECT,suggestionType:h,suggestionTerm:f,searchTerm:s,targetUrl:t,dataSourceKey:g?g.id:''});this.selectText(0,0);switch(h){case b.App:this.destroySuggestionRows();m.abortSuggestions();this.logRecentActivity(d);if(t[0]==='#'){if(t.indexOf('#Action-search')===0&&t===decodeURIComponent(S.getHashFromUrl())){m.setSearchBoxTerm(m.getLastSearchTerm(),false);sap.ui.getCore().getEventBus().publish("allSearchFinished");return;}if(window.hasher){window.hasher.setHash(t);}else{window.location.href=t;}}else{window.open(t,'_blank');m.setSearchBoxTerm('',false);this.setValue('');this.focus();}if(t.indexOf('#Action-search')!==0){sap.ui.require("sap/ushell/renderers/fiori2/search/SearchShellHelper").setSearchState('COL');}break;case b.DataSource:m.setDataSource(g,false);m.setSearchBoxTerm('',false);this.setValue('');this.focus();break;case b.SearchTermData:m.setDataSource(g,false);m.setSearchBoxTerm(f,false);this.getModel().invalidateQuery();this.navigateToSearchApp();this.setValue(f);break;case b.SearchTermHistory:m.setDataSource(g,false);m.setSearchBoxTerm(f,false);this.getModel().invalidateQuery();this.navigateToSearchApp();this.setValue(f);break;case b.Object:if(d.titleNavigation){d.titleNavigation.performNavigation();}break;default:break;}},logRecentActivity:function(s){try{var r={title:s.title,appType:'App',url:s.url,appId:s.url};var d=sap.ushell.Container.getRenderer('fiori2');d.logRecentActivity(r);}catch(e){L.warning('user recent activity logging failed:'+e);}},suggestionItemFactory:function(i,C){var s=C.getObject();switch(s.uiSuggestionType){case b.Object:return this.objectSuggestionItemFactory(i,C);case b.Header:return this.headerSuggestionItemFactory(i,C);case b.BusyIndicator:return this.busyIndicatorItemFactory(i,C);default:return this.regularSuggestionItemFactory(i,C);}},busyIndicatorItemFactory:function(i,C){var d=new V({content:[new sap.m.BusyIndicator({size:'0.6rem'})]});d.getText=function(){return this.getValue();}.bind(this);var l=new sap.m.ColumnListItem({cells:[d],type:"Active"});l.addStyleClass('searchSuggestion');l.addStyleClass('searchBusyIndicatorSuggestion');return l;},headerSuggestionItemFactory:function(i,C){var l=new sap.m.Label({text:'{label}'});var d=new V({content:[l]});d.getText=function(){return this.getValue();}.bind(this);var e=new sap.m.ColumnListItem({cells:[d],type:"Active"});e.addStyleClass('searchSuggestion');e.addStyleClass('searchHeaderSuggestion');return e;},assembleObjectSuggestionLabels:function(s){var l=[];var d=new sap.m.Label({text:"{label1}"});d.addEventDelegate({onAfterRendering:function(){S.boldTagUnescaper(this.getDomRef());}},d);d.addStyleClass('sapUshellSearchObjectSuggestion-Label1');l.push(d);if(s.label2){var e=new sap.m.Label({text:"{label2}"});e.addEventDelegate({onAfterRendering:function(){S.boldTagUnescaper(this.getDomRef());}},e);e.addStyleClass('sapUshellSearchObjectSuggestion-Label2');l.push(e);}var v=new V({content:l});v.addStyleClass('sapUshellSearchObjectSuggestion-Labels');return v;},objectSuggestionItemFactory:function(i,C){var s=C.getObject();var d=[];if(s.imageExists){d.push(new c({src:"{imageUrl}",isCircular:"{imageIsCircular}"}));}d.push(this.assembleObjectSuggestionLabels(s));var e=new H({content:d});e.addStyleClass('sapUshellSearchObjectSuggestion-Container');e.getText=function(){return this.getValue();}.bind(this);var l=new sap.m.ColumnListItem({cells:[e],type:"Active"});l.addStyleClass('searchSuggestion');l.addStyleClass('searchObjectSuggestion');return l;},regularSuggestionItemFactory:function(i,C){var t=this;var d=new sap.m.Label({text:{path:"icon",formatter:function(v){if(v){return"<i>"+sap.ushell.resources.i18n.getText("label_app")+"</i>";}return"";}}}).addStyleClass('suggestText').addStyleClass('suggestNavItem').addStyleClass('suggestListItemCell');d.addEventDelegate({onAfterRendering:function(){S.boldTagUnescaper(this.getDomRef());}},d);var f=new sap.ui.core.Icon({src:"{icon}"}).addStyleClass('suggestIcon').addStyleClass('sapUshellSearchSuggestAppIcon').addStyleClass('suggestListItemCell');var l=new sap.m.Text({text:"{label}",layoutData:new sap.m.FlexItemData({shrinkFactor:1,minWidth:"4rem"}),wrapping:false}).addStyleClass('suggestText').addStyleClass('suggestNavItem').addStyleClass('suggestListItemCell');l.addEventDelegate({onAfterRendering:function(){S.boldTagUnescaper(this.getDomRef());}},l);var g=new sap.m.CustomListItem({type:sap.m.ListType.Active,content:new sap.m.FlexBox({items:[d,f,l]})});var s=C.oModel.getProperty(C.sPath);g.getText=function(){return(typeof s.searchTerm)==='string'?s.searchTerm:t.getValue();};var h=new sap.m.ColumnListItem({cells:[g],type:"Active"});if(s.uiSuggestionType===b.App){if(s.title&&s.title.indexOf("combinedAppSuggestion")>=0){h.addStyleClass('searchCombinedAppSuggestion');}else{h.addStyleClass('searchAppSuggestion');}}if(s.uiSuggestionType===b.DataSource){h.addStyleClass('searchDataSourceSuggestion');}if(s.uiSuggestionType===b.SearchTermData){h.addStyleClass('searchBOSuggestion');}if(s.uiSuggestionType===b.SearchTermHistory){h.addStyleClass('searchHistorySuggestion');}h.addStyleClass('searchSuggestion');h.addEventDelegate({onAfterRendering:function(e){var j=h.$().find('.suggestListItemCell');var k=0;j.each(function(m){k+=$(this).outerWidth(true);});if(k>h.$().find('li').get(0).scrollWidth){h.setTooltip($(j[0]).text()+" "+$(j[2]).text());}}});return h;},navigateToSearchApp:function(){if(S.isSearchAppActive()){this.getModel()._firePerspectiveQuery();}else{var h=this.getModel().renderSearchURL();window.location.hash=h;}},getAriaDescriptionIdForNoResults:function(){return this._ariaDescriptionIdNoResults;},onAfterRendering:function(e){var d=$(this.getDomRef()).find("#searchFieldInShell-input-inner");$(this.getDomRef()).find('input').attr('autocomplete','off');$(this.getDomRef()).find('input').attr('autocorrect','off');$(this.getDomRef()).find('input').attr('type','search');$(this.getDomRef()).find('input').attr('name','search');var f=jQuery('<form action=""></form>').on("submit",function(){return false;});$(this.getDomRef()).children('input').parent().append(f);$(this.getDomRef()).children('input').detach().appendTo(f);d.attr("aria-describedby",d.attr("aria-describedby")+" "+this._ariaDescriptionIdNoResults);},onValueRevertedByEscape:function(v){if(S.isSearchAppActive()){return;}this.setValue(" ");}});});
