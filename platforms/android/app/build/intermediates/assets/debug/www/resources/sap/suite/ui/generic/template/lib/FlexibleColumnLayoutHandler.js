sap.ui.define(["jquery.sap.global","sap/ui/base/Object","sap/f/FlexibleColumnLayoutSemanticHelper","sap/f/LayoutType"],function(q,B,F,L){"use strict";function o(O){sap.ui.require(["sap/suite/ui/generic/template/lib/routingHelper"],O);}var r=Promise.resolve();var d=2;var c=["begin","mid","end"];var m=["messagePageBeginColumn","messagePageMidColumn","messagePageEndColumn"];function t(v){return c[v]?v:d;}function a(v){return t(v)===v;}function g(v){return c[t(v)]+"ColumnPages";}function b(C){for(var i=0;i<c.length;i++){C(m[i],g(i));}}function e(v){return m[t(v)];}function f(v){return c[t(v)];}function h(R){return R.name.length>5&&R.name.lastIndexOf("query")===R.name.length-"query".length;}function j(T){var i;if(T instanceof sap.ui.table.Table){i=T.getRows();}else if(T instanceof sap.m.Table){i=T.getItems();}return i;}function k(T){var i=j(T);var R=i?i[0]:false;return R;}function l(n,N){var M=N.oTemplateContract.oAppComponent.getConfig();var p=M.settings.flexibleColumnLayout;var s=F.getInstanceFor(n,p);var D=s.getDefaultLayouts();var R;var u;var U;var C;var S;var v=-1;var T=N.oTemplateContract,w=N.oRouter;var x=p.maxColumnCountInFCL||3;var y=p.initialColumnsCount===2;var z=p.displayNextObjectAfterDelete===true;function A(i){if(i>=x||sap.ui.Device.system.phone){return 1;}var A1=p.initialColumnsCount||1;var B1=Math.max(i+1,A1);if(sap.ui.Device.system.tablet&&B1>2){return 2;}return B1;}function E(i,A1,B1){var C1=i.viewLevel;var D1=A(C1);i.showBeginColumn=C1===0||D1>1;i.showMidColumn=C1===1||D1>1;i.showEndColumn=C1>1;if(D1===1){i.target=A1;}else if(C1===0){i.target=[A1,i.pages[0].entitySet];}else{i.target=B1.concat([A1]);}return g(C1);}function G(i,A1){if(i==="OneColumn"&&y){return false;}var B1=A1&&T.mRoutingTree[I(A1)];var C1=B1&&B1.defaultLayoutType;if(C1){return i===C1;}return i===D.defaultLayoutType||i===D.defaultTwoColumnLayoutType||i===D.defaultThreeColumnLayoutType;}function H(i,A1,B1){var C1=T.mRouteToTemplateComponentPromise[B1];if(C1){return C1.then(function(D1){return N.activateOneComponent(A1,i,D1);});}return r;}function I(i){var A1=i.substring(i.length-5,i.length);if(A1==="query"){return i.substring(0,i.length-5);}return i;}function J(i){return Promise.all(i).then(N.afterActivation);}function K(i,A1){var B1=G(i,u&&u.name);if(u&&h(u)){u.arguments.query=u.arguments["?query"];if(B1){delete u.arguments.query.FCLLayout;if(q.isEmptyObject(u.arguments.query)){delete u.arguments.query;u.name=I(u.name);}}else{u.arguments.query.FCLLayout=i;}}else if(!B1){u.name=u.name+"query";u.arguments.query={FCLLayout:i};}var C1=w.getURL(u.name,u.arguments);C1=C1.replace("/?","?");N.navigate(C1,A1);}function O(i,A1,B1){var C1=N.getAncestralRoute(A1,1);var D1=T.mRoutingTree[C1.name];if(B1&&D1.noOData){return Promise.resolve();}return new Promise(function(E1){o(function(F1){E1(F1.determinePath(i,A1,C1.pattern));});});}function P(){var i=function(A1,B1){var C1={};if(!u){B1();return;}var D1=u.event.getParameter("config").viewLevel;if(D1<3){C1.begin={route:"root",path:"",isVisible:U.columnsVisibility.beginColumn};if(D1===0){A1(C1);return;}}var E1=I(u.name);if(D1>0){var F1=f(D1);C1[F1]={route:E1,path:u.path,isVisible:D1>2||(D1===1&&U.columnsVisibility.midColumn)||(D1===2&&U.columnsVisibility.endColumn)};}if(D1===2){O(u.routeConfig,u.event,true).then(function(G1){var H1=N.getAncestralRoute(u.event,1);C1.mid={route:H1.name,path:G1,isVisible:U.columnsVisibility.midColumn};A1(C1);});}else{A1(C1);}};return new Promise(i);}function Q(i){var A1=P();A1.then(function(B1){var C1=[];var D1=[B1.begin,B1.mid,B1.end];var E1=N.performPseudoHashChange(D1);for(var F1 in i){if(i[F1]){var G1=B1[F1];if(G1){C1.push(H(E1,G1.path,G1.route));}}}J(C1);},q.noop);}function V(){return!(U.columnsVisibility.beginColumn?U.columnsVisibility.midColumn:U.columnsVisibility.midColumn&&U.columnsVisibility.endColumn);}function W(i){var A1=s.getCurrentUIState();var B1={};B1.end=U&&(U.columnsVisibility.endColumn!==A1.columnsVisibility.endColumn);B1.mid=U&&(U.columnsVisibility.midColumn!==A1.columnsVisibility.midColumn);B1.begin=U&&(U.columnsVisibility.beginColumn!==A1.columnsVisibility.beginColumn);U=A1;T.oTemplatePrivateGlobalModel.setProperty("/generic/FCL/midActionButtons",{fullScreen:U.actionButtonsInfo.midColumn.fullScreen!==null,exitFullScreen:U.actionButtonsInfo.midColumn.exitFullScreen!==null,closeColumn:U.actionButtonsInfo.midColumn.closeColumn!==null});T.oTemplatePrivateGlobalModel.setProperty("/generic/FCL/endActionButtons",{fullScreen:U.actionButtonsInfo.endColumn.fullScreen!==null,exitFullScreen:U.actionButtonsInfo.endColumn.exitFullScreen!==null,closeColumn:U.actionButtonsInfo.endColumn.closeColumn!==null});T.oTemplatePrivateGlobalModel.setProperty("/generic/FCL/isVisuallyFullScreen",V());var C1;if(U.columnsVisibility.endColumn){C1=T.oTemplatePrivateGlobalModel.getProperty("/generic/routeLevel");}else if(U.columnsVisibility.midColumn){C1=1;}else{C1=0;}T.oTemplatePrivateGlobalModel.setProperty("/generic/FCL/highestViewLevel",C1);var D1;if(U.columnsVisibility.midColumn){D1=1;}else{D1=T.oTemplatePrivateGlobalModel.getProperty("/generic/routeLevel");}T.oTemplatePrivateGlobalModel.setProperty("/generic/FCL/lowestDetailViewLevel",D1);if(u&&C!==U.layout){K(U.layout,true);}else if((B1.begin||B1.mid||B1.end)&&!i){Q(B1);}}function X(i,A1,B1,C1){return new Promise(function(D1,E1){W(true);var F1=P();F1.then(function(G1){var H1=[];for(var I1 in G1){var J1=G1[I1];if(J1.isVisible){H1.push(H(C1,J1.path,J1.route));}}J(H1).then(D1,E1);});});}function Y(i){i=q.extend({},i);u={name:i.getParameter("name"),arguments:i.getParameter("arguments"),event:i};var A1=i.getParameter("config");var B1=A1.viewLevel;var C1=u.arguments["?query"];if(a(B1)){C=(C1&&C1.FCLLayout)||A1.defaultLayoutType;if(!C){switch(B1){case 0:var D1=s.getNextUIState(0).columnsVisibility;if(D1.midColumn){C=D.defaultTwoColumnLayoutType;}else{C=D.defaultLayoutType;if(A(B1)>1){K(D.defaultLayoutType,true);}}break;case 1:C=D.defaultTwoColumnLayoutType;break;case 2:C=D.defaultThreeColumnLayoutType;}}}else{C=L.EndColumnFullScreen;}n.setLayout(C);}function Z(i,A1,B1,C1){v=-1;var D1=T.oTemplatePrivateGlobalModel.getProperty("/generic/routeLevel");R=D1===2?i:null;u.path=B1;u.routeConfig=A1;return C1&&X(i,A1,B1,C1);}function $(i,A1){return G(i,A1)?{}:{FCLLayout:[i]};}function _(i){return i===L.EndColumnFullScreen||i===L.MidColumnFullScreen;}function a1(i,A1,B1){if(!a(A1)){return N.getParStringPromise(B1,false);}var C1=S||T.mRoutingTree[I(i)].defaultLayoutType||s.getNextUIState(A1).layout;q.extend(B1,$(C1,i));S=null;if(_(C1)){return N.getParStringPromise(B1,false);}var D1;if(A1===2){var E1=T.mRoutingTree[i];var F1=E1.parentRoute;D1=N.addUrlParameterInfoForRoute(F1,B1);}else{D1=Promise.resolve();}return new Promise(function(G1){D1.then(function(){N.getParStringPromise(B1,true).then(G1);});});}function b1(){S=U.actionButtonsInfo.midColumn.closeColumn;N.navigateToRoot(true);}function c1(){S=U.actionButtonsInfo.endColumn.closeColumn;var i=R.getParameter("config");O(i,R).then(function(A1){N.navigateToContext(A1,null,true,0);});}function d1(i,A1){var B1=N.oHashChanger.getHash()||"";B1=B1.split("?")[0];var C1=N.getParStringPromise(i,A1);N.navigateToParStringPromise(B1,C1,null,false,null,true);}function e1(i){if(i===0){return L.OneColumn;}else if(i===1){return L.MidColumnFullScreen;}else if(i===2){return L.EndColumnFullScreen;}else{return"";}}function f1(){var A1=U.actionButtonsInfo.midColumn.fullScreen;var B1;if(A1===null){A1=U.actionButtonsInfo.endColumn.fullScreen;B1=2;}else{B1=1;}var C1=$(A1,u&&u.name);var D1=N.getActiveComponents();for(var i=0;i<D1.length;i++){var E1=T.componentRegistry[D1[i]];if(E1.viewLevel===B1){N.getApplicableStateForComponentAddedPromise(D1[i],null,C1).then(d1.bind(null,C1,false));return;}}}function g1(){var i=U.actionButtonsInfo.midColumn.exitFullScreen||U.actionButtonsInfo.endColumn.exitFullScreen;var A1=$(i,u&&u.name);var B1;var C1;if(i===U.actionButtonsInfo.endColumn.exitFullScreen){var D1=N.getActiveComponents();var E1=D1[0];B1=N.getApplicableStateForComponentAddedPromise(E1,null,A1);C1=O(u.routeConfig,u.event);}(B1||r).then(function(){(C1||r).then(function(F1){var G1=N.getAncestralRoute(u.event,1);var H1=N.addUrlParameterInfoForRoute(G1.name,A1,F1);H1.then(function(){d1(A1,true);});});});}function h1(i){return a(i)&&{onCloseColumnPressed:i===1?b1:c1,onFullscreenColumnPressed:f1,onExitFullscreenColumnPressed:g1};}function i1(i){return T.oApplicationProxy.getDraftSiblingPromise(i);}function j1(i){if(i.routingSpec&&i.routingSpec.noOData){var A1=i.pattern.replace("{?query}","").split("/")[1];var B1=N.getCurrentKeys(2)[2];return A1.replace("{keys2}",B1);}}function k1(i){if(T.oTemplatePrivateGlobalModel.getProperty("/generic/FCL/highestViewLevel")===2){var A1=function(C1){var F1=i.getPath()+"/"+C1;S=U.layout;N.navigateToContext(F1,null,true,2,true);};var B1=R.getParameter("config");var C1=j1(B1);if(C1){A1(C1);return;}var D1=T.mRouteToTemplateComponentPromise[I(B1.name)];var E1=new Promise(function(F1,G1){D1.then(function(H1){var I1=H1.getBindingContext();var J1=i1(I1,true);J1.then(function(K1){o(function(L1){var M1=B1.navigationProperty;A1(L1.determineNavigationPath(K1,M1).path);F1();});},G1);},G1);});T.oBusyHelper.setBusy(E1);}else{N.navigateToContext(i,null,true,2,true);}}function l1(i){if(T.oTemplatePrivateGlobalModel.getProperty("/generic/FCL/highestViewLevel")!==2){return Promise.resolve(i);}var A1=R.getParameter("config");var B1=j1(A1);if(B1){return Promise.resolve(i.getPath()+"/"+B1);}var C1=new Promise(function(D1){var E1=T.mRouteToTemplateComponentPromise[I(A1.name)];E1.then(function(F1){var G1=F1.getBindingContext();var H1=i1(G1,true);H1.then(function(I1){if(!I1){D1(i);return;}o(function(J1){var K1=A1.navigationProperty;var L1=i.getPath()+"/"+J1.determineNavigationPath(I1,K1).path;D1(L1);});});});});T.oBusyHelper.setBusy(C1);return C1;}T.oTemplatePrivateGlobalModel.setProperty("/generic/FCL",{});function m1(i){var A1=N.getTargetLevel(i);switch(A1){case 1:return!U.columnsVisibility.midColumn;case 2:return!U.columnsVisibility.endColumn;default:return true;}}function n1(i){C=s.getNextUIState(i).layout;n.setLayout(C);}function o1(){return!V();}function p1(A1){v=t(A1.viewLevel);n1(A1.viewLevel);var B1=N.oRouter.getTargets();var C1=e(A1.viewLevel);B1.display(C1);var D1;if(A1.viewLevel===v){D1=[];for(var i=0;i<A1.viewLevel;i++){D1.push(true);}}return D1;}function q1(i){if(i<v||v<0){return U.columnsVisibility[f(i)+"Column"];}return false;}function r1(i,A1){if(!a(A1.level)){return;}var B1=e1(A1.level);if(G(B1,A1.sRouteName)){return;}i.FCLLayout=[B1];}function s1(){return x;}function t1(i,A1){if(!y){return;}var B1=false;var C1=s.getNextUIState(0).columnsVisibility;if(C1.midColumn){var D1=u.event.getParameter("config").viewLevel;if(D1===0){B1=true;if(h(u)){u.arguments.query=u.arguments["?query"];if(u.arguments.query.FCLLayout==="OneColumn"){B1=false;}}}}if(B1){if(i){A1(i);}else{N.navigateToRoot(true);}}else{return;}}function u1(){return z;}function v1(){return y;}function w1(i,A1,B1){var C1;C1=k(i);T.oApplicationProxy.setListReportTable(i);if(v1&&v1()){t1(C1,function(){setTimeout(function(){B1.oCommonEventHandlers.onListNavigate(C1,A1);},0);});}}function x1(){S=L.OneColumn;}function y1(i){if(i>2){S="";}else{S=e1(i);}}function z1(i){return{oActionButtonHandlers:h1(i),navigateToDraft:k1,getMaxColumnCountInFCL:s1,handleListReceived:t1,handleDataReceived:w1,isListAndFirstEntryLoadedOnStartup:v1};}n.attachStateChange(W.bind(null,false));return{adaptRoutingInfo:E,createMessagePageTargets:b,displayMessagePage:p1,isLevelActive:q1,handleBeforeRouteMatched:Y,handleRouteMatched:Z,getAppStateParStringForNavigation:a1,getActionButtonHandlers:h1,getTargetAfterCancelPromise:l1,isNewHistoryEntryRequired:m1,adaptBreadCrumbUrlParameters:r1,isAppTitlePrefered:o1,getFullscreenLayout:e1,getMaxColumnCountInFCL:s1,isNextObjectLoadedAfterDelete:u1,getFclProxyForView:z1,setStoredTargetLayoutToOneColumn:x1,isListAndFirstEntryLoadedOnStartup:v1,setStoredTargetLayoutToFullscreen:y1};}return B.extend("sap.suite.ui.generic.template.lib.FlexibleColumnLayoutHandler",{constructor:function(i,n){q.extend(this,l(i,n));}});});