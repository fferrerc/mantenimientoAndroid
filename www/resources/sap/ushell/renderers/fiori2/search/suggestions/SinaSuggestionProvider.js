sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchHelper','sap/ushell/renderers/fiori2/search/suggestions/SinaBaseSuggestionProvider','sap/ushell/renderers/fiori2/search/suggestions/SuggestionType','sap/ushell/renderers/fiori2/search/suggestions/SinaObjectSuggestionFormatter'],function(S,a,b,c){"use strict";jQuery.sap.declare('sap.ushell.renderers.fiori2.search.suggestions.SinaSuggestionProvider');var m=sap.ushell.renderers.fiori2.search.suggestions.SinaSuggestionProvider=function(){this.init.apply(this,arguments);};m.prototype=jQuery.extend(new a(),{suggestionLimit:jQuery.device.is.phone?5:7,init:function(p){a.prototype.init.apply(this,arguments);this.dataSourceDeferred=null;this.suggestionQuery=this.sinaNext.createSuggestionQuery();this.sinaObjectSuggestionFormatter=new c(this);},abortSuggestions:function(){this.suggestionQuery.abort();},getSuggestions:function(f){var t=this;this.suggestions=[];this.firstObjectDataSuggestion=true;this.numberSuggestionsByType={};for(var i=0;i<b.types.length;++i){var s=b.types[i];this.numberSuggestionsByType[s]=0;}var d=f.searchTerm;if(this.suggestionTypes.length===1&&this.suggestionTypes.indexOf(b.SearchTermData)>=0&&d.length<3){return jQuery.when(this.suggestions);}if(this.suggestionTypes.length===1&&this.suggestionTypes.indexOf(b.Object)>=0&&d.length<3){return jQuery.when(this.suggestions);}if(this.suggestionTypes.length===1&&this.suggestionTypes.indexOf(b.DataSource)>=0&&t.model.getDataSource()!==t.model.sinaNext.allDataSource){return jQuery.when(this.suggestions);}t.createAllAndAppDsSuggestions();if(!t.model.config.searchBusinessObjects){return jQuery.when(this.suggestions);}if(t.model.getDataSource()===t.model.appDataSource){return jQuery.when(this.suggestions);}t.prepareSuggestionQuery(f);return t.suggestionQuery.getResultSetAsync().then(function(r){var e=r.items;t.formatSinaSuggestions(e);return t.suggestions;});},createAllAndAppDsSuggestions:function(){if(this.suggestionTypes.indexOf(b.DataSource)<0){return;}if(this.model.getDataSource()!==this.model.allDataSource){return;}var d=[];d.unshift(this.model.appDataSource);d.unshift(this.model.allDataSource);var s=this.model.getProperty('/uiFilter/searchTerm');var e=s.replace(/\*/g,'');var t=new S.Tester(e);for(var i=0;i<d.length;++i){var f=d[i];if(f.id===this.model.getDataSource().id){continue;}var T=t.test(f.label);if(T.bMatch===true){if(this.isSuggestionLimitReached(b.DataSource)){return;}var g={};g.label='<i>'+sap.ushell.resources.i18n.getText("searchInPlaceholder",[""])+'</i> '+T.sHighlightedText;g.dataSource=f;g.position=b.properties.DataSource.position;g.type=this.sinaNext.SuggestionType.DataSource;g.calculationMode=this.sinaNext.SuggestionCalculationMode.Data;g.uiSuggestionType=b.DataSource;g.uiSuggestionType=b.DataSource;this.addSuggestion(g);}}},isSuggestionLimitReached:function(s){var l=this.suggestionHandler.getSuggestionLimit(s);var n=this.numberSuggestionsByType[s];if(n>=l){return true;}return false;},preFormatSuggestions:function(s){for(var i=0;i<s.length;++i){var d=s[i];d.uiSuggestionType=this.getSuggestionType(d);d.position=b.properties[d.uiSuggestionType].position;this.assembleKey(d);if(d.childSuggestions){this.preFormatSuggestions(d.childSuggestions);}}},assembleKey:function(s){switch(s.uiSuggestionType){case b.DataSource:s.key=b.DataSource+s.dataSource.id;break;case b.SearchTermData:s.key=b.SearchTermData+s.searchTerm;if(s.dataSource){s.key+=s.dataSource.id;}break;case b.SearchTermHistory:s.key=b.SearchTermData+s.searchTerm;if(s.dataSource){s.key+=s.dataSource.id;}break;case b.Object:s.key=b.Object+s.object.title;break;}},formatSinaSuggestions:function(s){this.preFormatSuggestions(s);for(var i=0;i<s.length;++i){var d=s[i];if(this.isSuggestionLimitReached(d.uiSuggestionType)){continue;}switch(d.uiSuggestionType){case b.DataSource:if(this.model.getDataSource()!==this.model.allDataSource){continue;}d.label=d.label;this.addSuggestion(d);break;case b.SearchTermData:this.formatSearchTermDataSuggestion(d);break;case b.SearchTermHistory:this.addSuggestion(d);break;case b.Object:this.sinaObjectSuggestionFormatter.format(this,d);break;default:break;}}return this.suggestions;},addSuggestion:function(s){this.suggestions.push(s);this.numberSuggestionsByType[s.uiSuggestionType]+=1;},formatSearchTermDataSuggestion:function(s){if(this.model.getDataSource()===this.model.allDataSource){if(this.firstObjectDataSuggestion){this.firstObjectDataSuggestion=false;if(s.childSuggestions.length>0){s.label=this.assembleSearchInSuggestionLabel(s);s.grouped=true;this.addSuggestion(s);this.addChildSuggestions(s);}else{this.addSuggestion(s);}}else{this.addSuggestion(s);}}else{this.addSuggestion(s);}},addChildSuggestions:function(s){for(var i=0;i<Math.min(2,s.childSuggestions.length);++i){if(this.isSuggestionLimitReached(b.SearchTermData)){return;}var d=s.childSuggestions[i];d.label=this.assembleSearchInSuggestionLabel(d);d.grouped=true;this.addSuggestion(d);}},assembleSearchInSuggestionLabel:function(s){return sap.ushell.resources.i18n.getText("resultsIn",['<span>'+s.label+'</span>',s.filter.dataSource.labelPlural]);},getSuggestionType:function(s){switch(s.type){case this.sinaNext.SuggestionType.SearchTerm:if(s.calculationMode===this.sinaNext.SuggestionCalculationMode.History){return b.SearchTermHistory;}return b.SearchTermData;case this.sinaNext.SuggestionType.SearchTermAndDataSource:if(s.calculationMode===this.sinaNext.SuggestionCalculationMode.History){return b.SearchTermHistory;}return b.SearchTermData;case this.sinaNext.SuggestionType.DataSource:return b.DataSource;case this.sinaNext.SuggestionType.Object:return b.Object;}}});return m;});
