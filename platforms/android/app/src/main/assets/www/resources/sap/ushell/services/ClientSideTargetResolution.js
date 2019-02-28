// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","sap/ushell/services/_ClientSideTargetResolution/Utils","sap/ushell/services/AppConfiguration","sap/ushell/services/_ClientSideTargetResolution/InboundProvider","sap/ushell/services/_ClientSideTargetResolution/InboundIndex","sap/ushell/services/_ClientSideTargetResolution/VirtualInbounds","sap/ushell/services/_ClientSideTargetResolution/Search","sap/ushell/services/_ClientSideTargetResolution/StagedLogger","sap/ushell/services/_ClientSideTargetResolution/Formatter","sap/ushell/services/_ClientSideTargetResolution/ParameterMapping","sap/ushell/navigationMode","sap/ushell/Config","sap/ushell/ApplicationType","sap/ui/thirdparty/URI","sap/ushell/_ApplicationType/systemAlias","sap/ushell/TechnicalParameters"],function(u,c,a,I,b,V,s,l,f,p,n,C,A,U,S,T){"use strict";function d(o,e,P,g){this._init.apply(this,arguments);}d.prototype._init=function(o,e,P,g){this._iLogId=0;sap.ui.lazyRequire("sap/ui/generic/app/navigation/service/SelectionVariant");if(!this._implementsServiceInterface(o)){jQuery.sap.log.error("Cannot get Inbounds","ClientSideTargetResolutionAdapter should implement getInbounds method","sap.ushell.services.ClientSideTargetResolution");return;}this._oInboundProvider=new I(o.getInbounds.bind(o));this._oHaveEasyAccessSystemsDeferreds={userMenu:null,sapMenu:null};this._oServiceConfiguration=g;this._oAdapter=o;};d.prototype._implementsServiceInterface=function(o){if(typeof o.getInbounds==="function"){return true;}return false;};d.prototype._getURLParsing=function(){if(!this._oURLParsing){this._oURLParsing=sap.ushell.Container.getService("URLParsing");}return this._oURLParsing;};d.prototype._hasRenameTo=function(m){return m.inbound&&m.inbound.signature&&m.inbound.signature.parameters&&Object.keys(m.inbound.signature.parameters).some(function(k){return!!(m.inbound.signature.parameters[k].renameTo);});};d.prototype._removeUnusedComplexParameterValuesFromDefaultList=function(m){m.defaultedParamNames=m.defaultedParamNames.filter(function(N){if(m.intentParamsPlusAllDefaults[N]&&!jQuery.isArray(m.intentParamsPlusAllDefaults[N])){if(!(m.resolutionResult.oNewAppStateMembers&&m.resolutionResult.oNewAppStateMembers[N])){return false;}}return true;});};d.prototype._mapDefaultParameterNames=function(m){var P=jQuery.sap.getObject("inbound.signature.parameters",undefined,m)||{},M={};m.defaultedParamNames.forEach(function(N){var e=(P[N]&&P[N].renameTo)||N;if(M[e]){jQuery.sap.log.error("renaming of defaultedParamNames creates duplicates"+N+"->"+e);}else{M[e]=true;}});m.mappedDefaultedParamNames=Object.keys(M).sort();};d.prototype._mixAppStateIntoResolutionResultAndRename=function(m,o){var D=new jQuery.Deferred(),t=this,N,e,g;var r=m.resolutionResult;function h(w){var x;t._removeUnusedComplexParameterValuesFromDefaultList(w);t._mapDefaultParameterNames(w);x=n.compute(jQuery.sap.getObject("inbound.resolutionResult.applicationType",undefined,w),(w.intentParamsPlusAllDefaults["sap-ushell-next-navmode"]||[])[0],(w.intentParamsPlusAllDefaults["sap-ushell-navmode"]||[])[0],(a.getCurrentApplication()||{}).applicationType,C.last("/core/navigation/enableInPlaceForClassicUIs"));u.shallowMergeObject(w.resolutionResult,x);delete w.resolutionResult.oNewAppStateMembers;D.resolve(w);}function i(r){return(r.oNewAppStateMembers&&!jQuery.isEmptyObject(r.oNewAppStateMembers));}function j(L,P){return jQuery.isArray(L)&&L.some(function(w){return(P.indexOf(w)!==-1);});}function k(w,P){var x,y,z;if(w&&w.selectionVariant){x=new sap.ui.generic.app.navigation.service.SelectionVariant(JSON.stringify(w.selectionVariant));z=x.getSelectOptionsPropertyNames()||[];y=x.getParameterNames()||[];if(j(z,P)||j(y,P)){return true;}}return false;}function q(w,R,P,x){var y=new sap.ui.generic.app.navigation.service.SelectionVariant(),z=w.getParameterNames()||[],B=w.getSelectOptionsPropertyNames()||[],E,F;z.forEach(function(G){E=w.getParameter(G);if(x&&!P[G]){R.deleted=true;return;}if(P[G]&&P[G].renameTo){if((y.getParameter(P[G].renameTo)===undefined)&&(y.getSelectOption(P[G].renameTo)===undefined)){y.addParameter(P[G].renameTo,E);R.changed=true;}else{jQuery.sap.log.error("renaming of appstate creates duplicates "+G+"->"+P[G].renameTo);}}else{if((y.getParameter(G)===undefined)&&(y.getSelectOption(G)===undefined)){y.addParameter(G,E);}}});B.forEach(function(G){F=w.getSelectOption(G);if(x&&!P[G]){R.deleted=true;return;}if(P[G]&&P[G].renameTo){if((y.getSelectOption(P[G].renameTo)===undefined)&&(y.getParameter(P[G].renameTo)===undefined)){y.massAddSelectOption(P[G].renameTo,F);R.changed=true;}else{jQuery.sap.log.error("renaming of appstate creates duplicates "+G+"->"+P[G].renameTo);}}else{if((y.getSelectOption(G)===undefined)&&(y.getParameter(G)===undefined)){y.massAddSelectOption(G,F);}}});z.forEach(function(G){w.removeParameter(G);});B.forEach(function(G){w.removeSelectOption(G);});y.getParameterNames().forEach(function(G){w.addParameter(G,y.getParameter(G));});y.getSelectOptionsPropertyNames().forEach(function(G){w.massAddSelectOption(G,y.getSelectOption(G));});return w;}function v(w){if(w===undefined||jQuery.isPlainObject(w)){return false;}return true;}function M(w){var x=w.getData()||{},y,z={};var B=m.inbound.signature;if(x.selectionVariant){y=new sap.ui.generic.app.navigation.service.SelectionVariant(JSON.stringify(x.selectionVariant));}else{y=new sap.ui.generic.app.navigation.service.SelectionVariant();}if(i(r)){Object.keys(r.oNewAppStateMembers).forEach(function(F){y.massAddSelectOption(F,r.oNewAppStateMembers[F].Ranges);});}var E=B.additionalParameters==="ignored";y=q(y,z,B.parameters,E);if(y.getParameterNames().length!==0||y.getSelectOptionsPropertyNames().length!==0||z.deleted){x.selectionVariant=y.toJSONObject();}if(!z.changed&&!z.deleted&&!i(r)){h(m);return;}w.setData(x);w.save().done(function(){m.intentParamsPlusAllDefaults["sap-xapp-state"]=[w.getKey()];m.mappedIntentParamsPlusSimpleDefaults["sap-xapp-state"]=[w.getKey()];h(m);});}if(!i(r)&&!t._hasRenameTo(m)){h(m);}else{e=m.intentParamsPlusAllDefaults["sap-xapp-state"]&&m.intentParamsPlusAllDefaults["sap-xapp-state"][0];if(e){o.getAppState(e).done(function(w){var P=c.constructParameterDominatorMap(m.inbound.signature.parameters);g=w.getData();if(v(g)){delete r.oNewAppStateMembers;h(m);}if(r.oNewAppStateMembers){Object.keys(r.oNewAppStateMembers).forEach(function(x){var y=P[x].dominatedBy;if(k(g,y)){delete r.oNewAppStateMembers[x];}});}if(!i(r)&&!t._hasRenameTo(m)){h(m);}else{N=o.createEmptyAppState(undefined,true);if(N){N.setData(w.getData());M(N);}}});}else if(i(r)){M(o.createEmptyAppState(undefined,true));}else{h(m);}}return D.promise();};d.prototype._extractInboundFilter=function(o){if(!this._oAdapter.hasSegmentedAccess){return undefined;}if(typeof o!=="string"){return undefined;}var F=o.indexOf("#")===0?o:"#"+o;var e=this._getURLParsing().parseShellHash(F);if(!e||!e.semanticObject||!e.action){return undefined;}return[{semanticObject:e.semanticObject,action:e.action}];};d.prototype.resolveHashFragment=function(h){var t=this,D=new jQuery.Deferred(),B=this._oAdapter.resolveHashFragmentFallback&&this._oAdapter.resolveHashFragmentFallback.bind(this._oAdapter),e=this._extractInboundFilter(h);this._oInboundProvider.getInbounds(e).then(function(i){t._resolveHashFragment(h,B,i).done(function(o){return D.resolve(o);}).fail(D.reject.bind(D));},function(){D.reject.apply(D,arguments);});return D.promise();};d.prototype.resolveTileIntent=function(h){var t=this,D=new jQuery.Deferred(),e=this._extractInboundFilter(h);this._oInboundProvider.getInbounds(e).then(function(i){t._resolveTileIntent(h,undefined,i).done(D.resolve.bind(D)).fail(D.reject.bind(D));},function(){D.reject.apply(D,arguments);});return D.promise();};d.prototype.resolveTileIntentInContext=function(i,h){var o,D=new jQuery.Deferred();o=b.createIndex(i.concat(V.getInbounds()));this._resolveTileIntent(h,undefined,o).done(D.resolve.bind(D)).fail(D.reject.bind(D));return D.promise();};d.prototype._resolveHashFragment=function(h,B,i){var e=this._getURLParsing(),t=this,D=new jQuery.Deferred(),F=h.indexOf("#")===0?h:"#"+h,g=e.parseShellHash(F);if(g===undefined){jQuery.sap.log.error("Could not parse shell hash '"+h+"'","please specify a valid shell hash","sap.ushell.services.ClientSideTargetResolution");return D.reject().promise();}g.formFactor=u.getFormFactor();this._getMatchingInbounds(g,i,{bExcludeTileInbounds:true}).fail(function(E){jQuery.sap.log.error("Could not resolve "+h,"_getMatchingInbounds promise rejected with: "+E,"sap.ushell.services.ClientSideTargetResolution");D.reject(E);}).done(function(m){var M;if(m.length===0){jQuery.sap.log.warning("Could not resolve "+h,"rejecting promise","sap.ushell.services.ClientSideTargetResolution");D.reject("Could not resolve navigation target");return;}M=m[0];c.whenDebugEnabled(function(){function j(K,v){return this[K]===undefined?"<undefined>":v;}function r(o,v){return(o==="_original")?undefined:j.call(this,o,v);}var k=JSON.stringify(M,r,"   ");jQuery.sap.log.debug("The following target will now be resolved",k,"sap.ushell.services.ClientSideTargetResolution");});t._resolveSingleMatchingTarget(M,B,F).done(function(o){D.resolve(o);}).fail(D.reject.bind(D));});return D.promise();};d.prototype._resolveSingleMatchingTarget=function(m,B,F){var t=this,D=new jQuery.Deferred(),o=this._getURLParsing(),i=o.parseShellHash(F),e=[i.semanticObject,i.action].join("-"),g=(m.inbound.resolutionResult||{}).applicationType;var E;if(this._oAdapter.resolveSystemAlias){E=this._oAdapter.resolveSystemAlias.bind(this._oAdapter);}var h=A.getEasyAccessMenuResolver(e);if(h){h(i,m,E).then(function(R){var N=n.compute(jQuery.sap.getObject("inbound.resolutionResult.applicationType",undefined,m),(m.intentParamsPlusAllDefaults["sap-ushell-next-navmode"]||[])[0],(m.intentParamsPlusAllDefaults["sap-ushell-navmode"]||[])[0],(a.getCurrentApplication()||{}).applicationType,C.last("/core/navigation/enableInPlaceForClassicUIs"));u.shallowMergeObject(R,N);D.resolve(R);},function(j){D.reject(j);});return D.promise();}var r=c.extractParameters(T.getParameterNames(),m.intentParamsPlusAllDefaults);p.mapParameterNamesAndRemoveObjects(m);this._mixAppStateIntoResolutionResultAndRename(m,sap.ushell.Container.getService("AppState")).done(function(m){var R=function(){return t._constructFallbackResolutionResult.call(t,m,B,F);};if(A[g]){R=A[g].generateResolutionResult;}delete m.intentParamsPlusAllDefaults["sap-tag"];delete m.mappedIntentParamsPlusSimpleDefaults["sap-tag"];m.mappedDefaultedParamNames=m.mappedDefaultedParamNames.filter(function(P){return P!=="sap-tag";});var j=jQuery.sap.getObject('inbound.resolutionResult.url',undefined,m);R(m,j,E).then(function(k){k.reservedParameters=r;return k;}).then(function(k){jQuery.sap.log.debug("Intent was resolved to the following target",JSON.stringify(m.resolutionResult,null,3),"sap.ushell.services.ClientSideTargetResolution");u.shallowMergeObject(m.resolutionResult,k);D.resolve(m.resolutionResult);},function(M){if(M.indexOf("fallback:")>=0){t._constructFallbackResolutionResult.call(this,m,B,F).then(function(k){u.shallowMergeObject(m.resolutionResult,k);D.resolve(m.resolutionResult);},D.reject.bind(D));}else{D.reject(M);}});});return D.promise();};d.prototype._resolveTileIntent=function(h,B,i){var o=this._getURLParsing(),t=this,D=new jQuery.Deferred(),F=h.indexOf("#")===0?h:"#"+h,e=o.parseShellHash(F);if(e===undefined){jQuery.sap.log.error("Could not parse shell hash '"+h+"'","please specify a valid shell hash","sap.ushell.services.ClientSideTargetResolution");return D.reject("Cannot parse shell hash").promise();}e.formFactor=u.getFormFactor();this._getMatchingInbounds(e,i,{bExcludeTileInbounds:false}).fail(function(E){jQuery.sap.log.error("Could not resolve "+h,"_getMatchingInbounds promise rejected with: "+E,"sap.ushell.services.ClientSideTargetResolution");D.reject(E);}).done(function(m){var M;if(m.length===0){jQuery.sap.log.warning("Could not resolve "+h,"no matching targets were found","sap.ushell.services.ClientSideTargetResolution");D.reject("No matching targets found");return;}M=m[0];t._resolveSingleMatchingTileIntent(M,B,F).done(D.resolve.bind(D)).fail(D.reject.bind(D));});return D.promise();};d.prototype._resolveSingleMatchingTileIntent=function(m,B,F){var D=new jQuery.Deferred(),e=(m.inbound.resolutionResult||{}).applicationType,t=this;var E;if(this._oAdapter.resolveSystemAlias){E=this._oAdapter.resolveSystemAlias.bind(this._oAdapter);}p.mapParameterNamesAndRemoveObjects(m);this._mixAppStateIntoResolutionResultAndRename(m,sap.ushell.Container.getService("AppState")).done(function(m){var r=function(){return t._constructFallbackResolutionResult.call(t,m,B,F);};if(A[e]){r=A[e].generateResolutionResult;}delete m.intentParamsPlusAllDefaults["sap-tag"];delete m.mappedIntentParamsPlusSimpleDefaults["sap-tag"];m.mappedDefaultedParamNames=m.mappedDefaultedParamNames.filter(function(P){return P!=="sap-tag";});var g=jQuery.sap.getObject('inbound.resolutionResult.url',undefined,m);r(m,g,E).then(function(R){u.shallowMergeObject(m.resolutionResult,R);var o=jQuery.extend(true,{},m.inbound.tileResolutionResult);o.startupParameters=m.effectiveParameters;o.navigationMode=m.resolutionResult.navigationMode;if(!o.navigationMode){o.navigationMode=n.getNavigationMode(m.resolutionResult);}D.resolve(o);jQuery.sap.log.debug("Tile Intent was resolved to the following target",JSON.stringify(o,null,3),"sap.ushell.services.ClientSideTargetResolution");},function(M){D.reject(M);});});return D.promise();};d.prototype._constructFallbackResolutionResult=function(m,B,F){var e={},D;Object.keys(m.intentParamsPlusAllDefaults).forEach(function(P){if(jQuery.isArray(m.intentParamsPlusAllDefaults[P])){e[P]=m.intentParamsPlusAllDefaults[P];}});D=m.mappedDefaultedParamNames||m.defaultedParamNames;if(D.length>0){e["sap-ushell-defaultedParameterNames"]=[JSON.stringify(D)];}if(typeof B!=="function"){jQuery.sap.log.error("Cannot resolve hash fragment",F+" has matched an inbound that cannot be resolved client side"+" and no resolveHashFragmentFallback method was implemented in ClientSideTargetResolutionAdapter","sap.ushell.services.ClientSideTargetResolution");return Promise.reject("Cannot resolve hash fragment: no fallback provided.");}jQuery.sap.log.warning("Cannot resolve hash fragment client side",F+" has matched an inbound that cannot be resolved client side. Using fallback logic","sap.ushell.services.ClientSideTargetResolution");return new Promise(function(r,R){B(F,jQuery.extend(true,{},m.inbound),e).done(function(o){var g={};["applicationType","additionalInformation","url","applicationDependencies","text"].forEach(function(P){if(o.hasOwnProperty(P)){g[P]=o[P];}});r(g);}).fail(R.bind(null));});};d.prototype.getDistinctSemanticObjects=function(){var D=new jQuery.Deferred();this._oInboundProvider.getInbounds().then(function(i){var o={};i.getAllInbounds().forEach(function(e){if(typeof e.semanticObject==="string"&&e.semanticObject!=="*"&&!e.hideIntentLink&&e.semanticObject.length>0){o[e.semanticObject]=true;}});D.resolve(Object.keys(o).sort());},function(){D.reject.apply(D,arguments);});return D.promise();};d.prototype.getLinks=function(o){var N,t=this,e,P,i,D=new jQuery.Deferred(),g;if(arguments.length===1&&jQuery.isPlainObject(arguments[0])){N=arguments[0];g=jQuery.extend(true,{},N);["action","semanticObject"].forEach(function(h){if(N.hasOwnProperty(h)){g[h]=N[h];}});if(g.appStateKey){g.params=g.params||{};g.params["sap-xapp-state"]=[g.appStateKey];delete g.appStateKey;}}else if(arguments.length<=3){jQuery.sap.log.warning("Passing positional arguments to getLinks is deprecated","Please use nominal arguments instead","sap.ushell.services.ClientSideTargetResolution");e=arguments[0];P=arguments[1];i=arguments[2];g={semanticObject:e,params:P,ignoreFormFactor:i};}else{return D.reject("invalid arguments for getLinks").promise();}this._oInboundProvider.getInbounds().then(function(h){t._getLinks(g,h).done(D.resolve.bind(D)).fail(D.reject.bind(D));},function(){D.reject.apply(D,arguments);});return D.promise();};d.prototype._validateGetSemanticObjectLinksArgs=function(o){var e=o.semanticObject,g=o.action,i=!o.hasOwnProperty("action");if(typeof e!=="undefined"||i){if(typeof e!=="string"){jQuery.sap.log.error("invalid input for _getLinks","the semantic object must be a string, got "+Object.prototype.toString.call(e)+" instead","sap.ushell.services.ClientSideTargetResolution");return"invalid semantic object";}if(i&&e.match(/^\s+$/)){jQuery.sap.log.error("invalid input for _getLinks","the semantic object must be a non-empty string, got '"+e+"' instead","sap.ushell.services.ClientSideTargetResolution");return"invalid semantic object";}if(!i&&e.length===0){jQuery.sap.log.error("invalid input for _getLinks","the semantic object must not be an empty string, got '"+e+"' instead","sap.ushell.services.ClientSideTargetResolution");return"invalid semantic object";}}if(typeof g!=="undefined"){if(typeof g!=="string"){jQuery.sap.log.error("invalid input for _getLinks","the action must be a string, got "+Object.prototype.toString.call(g)+" instead","sap.ushell.services.ClientSideTargetResolution");return"invalid action";}if(g.length===0){jQuery.sap.log.error("invalid input for _getLinks","the action must not be an empty string, got '"+g+"' instead","sap.ushell.services.ClientSideTargetResolution");return"invalid action";}}return undefined;};d.prototype._getLinks=function(o,i){var e=o.semanticObject,g=o.action,P=o.params,w=!!o.withAtLeastOneUsedParam,t=!!o.treatTechHintAsFilter,h=o.ignoreFormFactor,j=o.hasOwnProperty("sortResultsBy")?o.sortResultsBy:"intent";if(o.hasOwnProperty("sortResultOnTexts")){jQuery.sap.log.warning("the parameter 'sortResultOnTexts' was experimantal and is no longer supported","getLinks results will be sorted by '"+j+"'","sap.ushell.services.ClientsideTargetResolution");}var k={bExcludeTileInbounds:true};var E=this._validateGetSemanticObjectLinksArgs(o);if(o.tags){k.tags=o.tags;}if(E){return new jQuery.Deferred().reject(E).promise();}if(e==="*"){return jQuery.when([]);}function m(q,P){var B=q.paramsToString(P);return B?"?"+B:"";}var q=this._getURLParsing(),D=new jQuery.Deferred(),F=u.getFormFactor(),r=q.parseParameters(m(q,P)),v={semanticObject:(e===""?undefined:e),action:g,formFactor:(h?undefined:F),params:r};if(t){v.treatTechHintAsFilter=true;}this._getMatchingInbounds(v,i,k).done(function(M){var x={},R=M.map(function(z){var B=e||z.inbound.semanticObject,G="#"+B+"-"+z.inbound.action,N;if(B==="*"){return undefined;}if(z.inbound.action==="*"){return undefined;}if(z.inbound&&z.inbound.hasOwnProperty("hideIntentLink")&&z.inbound.hideIntentLink===true){return undefined;}if(!x.hasOwnProperty(G)){x[G]={matchingInbound:z.inbound,count:1};if(z.inbound.signature.additionalParameters==="ignored"){N=c.filterObjectKeys(r,function(Q){return(Q.indexOf("sap-")===0)||z.inbound.signature.parameters.hasOwnProperty(Q);},false);}else{N=r;}if(w){var J=Object.keys(N).some(function(Q){return Q.indexOf("sap-")!==0;});if(!J){x[G].hideReason="getLinks called with 'withAtLeastOneUsedParam = true', but the inbound had no business parameters defined.";return undefined;}}var K=c.inboundSignatureMeetsParameterOptions(z.inbound.signature.parameters,o.paramsOptions||[]);if(!K){x[G].hideReason="inbound signature does not meet the requested parameter filter options";return undefined;}var L={"intent":G+m(q,N),"text":z.inbound.title};if(z.inbound.icon){L.icon=z.inbound.icon;}if(z.inbound.subTitle){L.subTitle=z.inbound.subTitle;}if(z.inbound.shortTitle){L.shortTitle=z.inbound.shortTitle;}var O=jQuery.sap.getObject('inbound.signature.parameters.sap-tag.defaultValue.value',undefined,z);if(O){L.tags=[O];}return L;}else{x[G].count++;}return undefined;}).filter(function(z){return typeof z==="object";});if(j!=="priority"){R.sort(function(G,z){return G[j]<z[j]?-1:1;});}if(R.length===0){jQuery.sap.log.debug("_getLinks returned no results");}else if(jQuery.sap.log.getLevel()>=jQuery.sap.log.Level.DEBUG){if(jQuery.sap.log.getLevel()>=jQuery.sap.log.Level.TRACE){var y=[];var H=[];R.forEach(function(z){var B=z.intent.split("?")[0];if(x[B].hideReason){H.push(["-",B+"("+x[B].hideReason+")\n"," text:",z.text+"\n"," full intent:",z.intent].join(" "));}else{y.push(["-",B,x[B].count>1?"("+(x[B].count-1)+" others matched)\n":"\n","text:",z.text+"\n","full intent:",z.intent].join(" "));}});jQuery.sap.log.debug("_getLinks filtered to the following unique intents:","\n"+y.join("\n"),"sap.ushell.services.ClientSideTargetResolution");jQuery.sap.log.debug("_getLinks would have also returned the following unique intents, but something prevented this:",H.join("\n"),"sap.ushell.services.ClientSideTargetResolution");}else{jQuery.sap.log.debug("_getLinks filtered to unique intents.","Reporting histogram: \n - "+Object.keys(x).join("\n - "),"sap.ushell.services.ClientSideTargetResolution");}}D.resolve(R);}).fail(D.reject.bind(D));return D.promise();};d.prototype._getMatchingInbounds=function(o,i,e){var t=this,g,h,L,j,k,E,P,D=new jQuery.Deferred();if(e){g=e.tags;E=e.bExcludeTileInbounds;}c.whenDebugEnabled(function(){L=++t._iLogId;});l.begin(function(){function m(M){var r=M.action||(typeof M.action==="undefined"?"<any>":"<invalid-value>");var v=M.semanticObject||(typeof M.semanticObject==="undefined"?"<any>":"<invalid-value>");return t._getURLParsing().constructShellHash({semanticObject:v,action:r,params:M.params});}var q=m(o);return{logId:L,title:"Matching Intent '"+q+"' to inbounds (form factor: "+(o.formFactor||'<any>')+")",moduleName:"sap.ushell.services.ClientSideTargetResolution",stages:["STAGE1: Find matching inbounds","STAGE2: Resolve references","STAGE3: Rematch with references","STAGE4: Sort matched targets"]};});k=o.semanticObject;h=o.action;j=g?i.getSegmentByTags(g):i.getSegment(k,h);if(E){P=j.filter(function(m){return!m.tileResolutionResult||!m.tileResolutionResult.isCustomTile;});}else{P=j;}s.match(o,P,{},c.isDebugEnabled()).then(function(m){l.log(function(){return{logId:L,stage:1,prefix:"\u2718",lines:Object.keys(m.noMatchReasons||{}).map(function(q){return q+" "+m.noMatchReasons[q];})};});l.log(function(){var q=m.matchResults.map(function(v){return f.formatInbound(v.inbound);});return{logId:L,stage:1,prefix:q.length>0?"\u2705":"\u2718",lines:q.length>0?q:["No inbound was matched"]};});var M=Object.keys(m.missingReferences||[]);if(M.length===0){l.log(function(){return{logId:L,stage:2,prefix:"\u2705",line:"No need to resolve references"};});return new jQuery.Deferred().resolve({matchResults:m.matchResults,referencesToInclude:null}).promise();}l.log(function(){return{logId:L,stage:2,line:"@ Must resolve the following references:",prefix:"\u2022",lines:M};});var r=new jQuery.Deferred();sap.ushell.Container.getService("ReferenceResolver").resolveReferences(M).done(function(R){l.log(function(){return{logId:L,stage:2,line:"\u2705 resolved references with the following values:",prefix:"\u2022",lines:Object.keys(R).map(function(q){return q+": '"+R[q]+"'";})};});r.resolve({matchResults:m.matchResults,referencesToInclude:R});}).fail(function(q){l.log(function(){return{logId:L,stage:2,prefix:"\u274c",line:"Failed to resolve references: "+q};});D.resolve([]);});return r.promise();}).then(function(m){var M,q,r=m.referencesToInclude;if(!r){l.log(function(){return{logId:L,stage:3,line:"rematch was skipped (no references to resolve)",prefix:"\u2705"};});return new jQuery.Deferred().resolve(m).promise();}q=m.matchResults;M=q.map(function(v){return v.inbound;});return s.match(o,M,r,0).then(function(F){l.log(function(){var q=F.matchResults||[];if(q.length>=1){return{logId:L,stage:3,line:"The following inbounds re-matched:",lines:q.map(function(v){return f.formatInbound(v.inbound);}),prefix:"\u2705"};}return{logId:L,stage:3,line:"No inbounds re-matched",prefix:"-"};});return F;});}).then(function(F){var m=F.matchResults||[];if(m.length<=1){l.log(function(){return{logId:L,stage:4,line:"Nothing to sort"};});D.resolve(m);return;}var q=s.sortMatchingResultsDeterministic(F.matchResults||[]);l.log(function(){var r=q.map(function(M){return f.formatInbound(M.inbound||{})+(M.matchesVirtualInbound?" (virtual)":"")+"\n[ Sort Criteria ] "+"\n * 1 * sap-priority: '"+M["sap-priority"]+"'"+"\n * 2 * Sort string: '"+M.priorityString+"\n * 3 * Deterministic blob: '"+s.serializeMatchingResult(M)+"'";});return{logId:L,stage:4,line:"Sorted inbounds as follows:",lines:r,prefix:".",number:true};});D.resolve(q);});return D.promise().then(function(m){l.end(function(){return{logId:L};});return m;});};d.prototype._isIntentSupportedOne=function(i,o){var D=new jQuery.Deferred(),e=this._getURLParsing().parseShellHash(i);if(i==="#"){D.resolve(true);return D.promise();}if(e===undefined){return D.reject("Could not parse shell hash '"+i+"'").promise();}e.formFactor=u.getFormFactor();this._getMatchingInbounds(e,o,{bExcludeTileInbounds:true}).done(function(t){D.resolve(t.length>0);}).fail(function(){D.reject();});return D.promise();};d.prototype.isIntentSupported=function(i){var t=this,D=new jQuery.Deferred();this._oInboundProvider.getInbounds().then(function(o){t._isIntentSupported(i,o).done(D.resolve.bind(D)).fail(D.reject.bind(D));},function(){D.reject.apply(D,arguments);});return D.promise();};d.prototype._isIntentSupported=function(i,o){var t=this,D=new jQuery.Deferred(),m={};D.resolve();function e(g,h){m[g]={supported:h};}var r=[];i.forEach(function(g){var N=t._isIntentSupportedOne(g,o);N.fail(function(E){r.push(E);});N.done(function(h){e(g,h);});D=jQuery.when(D,N);});var R=new jQuery.Deferred();D.done(function(){R.resolve(m);}).fail(function(){R.reject("One or more input intents contain errors: "+r.join(", "));});return R.promise();};d.prototype.getUserDefaultParameterNames=function(){var t=this,D=new jQuery.Deferred();this._oInboundProvider.getInbounds().then(function(i){var r;try{r=t._getUserDefaultParameterNames(i.getAllInbounds());D.resolve(r);}catch(e){D.reject("Cannot get user default parameters from inbounds: "+e);}},function(){D.reject.apply(D,arguments);});return D.promise();};d.prototype._getUserDefaultParameterNames=function(i){var r={simple:{},extended:{}};i.forEach(function(t){var o=t.signature&&t.signature.parameters||[];Object.keys(o).forEach(function(P){var e=o[P],R,E,g,h;if(e){if(e.filter&&e.filter.format==="reference"){g=e.filter.value;}else if(e.defaultValue&&e.defaultValue.format==="reference"){g=e.defaultValue.value;}if(typeof g==="string"){h=sap.ushell.Container.getService("ReferenceResolver");R=h.extractUserDefaultReferenceName(g);if(typeof R==="string"){r.simple[R]={};}E=h.extractExtendedUserDefaultReferenceName(g);if(typeof E==="string"){r.extended[E]={};}}}});});return r;};d.prototype.getEasyAccessSystems=function(m){var r={},o,v,D;m=m||"sapMenu";if(this._oHaveEasyAccessSystemsDeferreds[m]){return this._oHaveEasyAccessSystemsDeferreds[m].promise();}this._oHaveEasyAccessSystemsDeferreds[m]=new jQuery.Deferred();D=this._oHaveEasyAccessSystemsDeferreds[m];function i(e,g,v){if(!e){return false;}var h=[e.semanticObject,e.action].join("-");return v[m][h]&&e.deviceTypes&&g!==undefined&&e.deviceTypes[g];}o=A.getEasyAccessMenuDefinitions().reduce(function(o,e){var E=e.easyAccessMenu.intent.split("-")[1];o[E]={appType:e.type,priority:e.easyAccessMenu.systemSelectionPriority};return o;},{});v={userMenu:A.getEasyAccessMenuDefinitions().reduce(function(e,E){var g=E.easyAccessMenu.intent;e[g]=E.easyAccessMenu.showSystemSelectionInUserMenu;return e;},{}),sapMenu:A.getEasyAccessMenuDefinitions().reduce(function(e,E){var g=E.easyAccessMenu.intent;e[g]=E.easyAccessMenu.showSystemSelectionInSapMenu;return e;},{})};this._oInboundProvider.getInbounds().then(function(e){var L={};e.getAllInbounds().filter(function(g){return i(g,u.getFormFactor(),v);}).forEach(function(E){var g;if(jQuery.isPlainObject(E.signature.parameters["sap-system"])&&E.signature.parameters["sap-system"].hasOwnProperty("filter")){g=jQuery.sap.getObject("signature.parameters.sap-system.filter.value",undefined,E);}if(typeof g==="string"){var h=o[E.action].priority;var j=o[E.action].appType;if(!r[g]){L[g]=-1;r[g]={appType:{}};}if(L[g]<h){r[g].text=E.title;L[g]=h;}r[g].appType[j]=true;}else{jQuery.sap.log.warning("Cannot extract sap-system from easy access menu inbound: "+f.formatInbound(E),"This parameter is supposed to be a string. Got '"+g+"' instead.","sap.ushell.services.ClientSideTargetResolution");}});D.resolve(r);},function(){D.reject.apply(D,arguments);});return D.promise();};d.hasNoAdapter=false;return d;},true);
