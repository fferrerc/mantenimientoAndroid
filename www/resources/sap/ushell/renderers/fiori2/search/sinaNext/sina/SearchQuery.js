sinaDefine(['../core/core','./Query'],function(c,Q){"use strict";return Q.derive({_meta:{properties:{calculateFacets:{required:false,default:false,setter:true},multiSelectFacets:{required:false,default:false,setter:true},nlq:{required:false,default:false,setter:true},facetTop:{required:false,default:5,setter:true}}},_initClone:function(o){this.calculateFacets=o.calculateFacets;this.multiSelectFacets=o.multiSelectFacets;this.nlq=o.nlq;this.facetTop=o.facetTop;},_equals:function(o,m){if(this.nlq!==o.nlq){return false;}if(this.multiSelectFacets!==o.multiSelectFacets){return false;}if(this.facetTop!==o.facetTop){return false;}switch(m){case this.sina.EqualsMode.CheckFireQuery:if(o.calculateFacets&&!this.calculateFacets){return true;}return this.calculateFacets===o.calculateFacets;default:return this.calculateFacets===o.calculateFacets;}},_execute:function(q){var f;var a=[];if(this.multiSelectFacets){f=this._collectAttributesWithFilter(q);a=this._createChartQueries(q,f);}var r=[];r.push(this.sina.provider.executeSearchQuery(q));for(var i=0;i<a.length;++i){var b=a[i];r.push(b.getResultSetAsync());}return Promise.all(r).then(function(d){var s=d[0];var e=d.slice(1);this._addChartResultSetsToSearchResultSet(s,e);return s;}.bind(this));},_formatResultSetAsync:function(r){return c.executeSequentialAsync(this.sina.searchResultSetFormatters,function(f){return f.formatAsync(r);});},_collectAttributesWithFilter:function(q){var a={};this._doCollectAttributes(a,q.filter.rootCondition);return Object.keys(a);},_doCollectAttributes:function(a,b){switch(b.type){case this.sina.ConditionType.Simple:a[b.attribute]=true;break;case this.sina.ConditionType.Complex:for(var i=0;i<b.conditions.length;++i){var s=b.conditions[i];this._doCollectAttributes(a,s);}break;}},_createChartQuery:function(q,f){var a=this.sina.createChartQuery({dimension:f,top:this.facetTop});a.setFilter(q.filter.clone());a.filter.rootCondition.removeAttributeConditions(f);return a;},_createChartQueries:function(q,f){var a=[];for(var i=0;i<f.length;++i){var b=f[i];var d=this._createChartQuery(q,b);a.push(d);}return a;},_addChartResultSetsToSearchResultSet:function(s,a){for(var i=0;i<a.length;++i){var b=a[i];this._addChartResultSetToSearchResultSet(s,b);}},_addChartResultSetToSearchResultSet:function(s,a){if(a.items.length===0){return;}var d=a.query.dimension;var m=null;var i;for(i=0;i<s.facets.length;++i){var f=s.facets[i];if(f.query.dimension===d){m=f;break;}}if(m){s.facets.splice(i,1,a);}else{s.facets.push(a);}}});});