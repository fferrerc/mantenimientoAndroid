/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/EventProvider','sap/ui/core/routing/Target','sap/ui/core/routing/async/Route','sap/ui/core/routing/sync/Route','sap/ui/core/Component',"sap/base/Log","sap/base/assert","sap/ui/thirdparty/jquery"],function(E,T,a,s,C,L,b,q){"use strict";var R=E.extend("sap.ui.core.routing.Route",{metadata:{publicMethods:["getURL","getPattern"]},constructor:function(r,c,p){E.apply(this,arguments);this._validateConfig(c);this._aPattern=[];this._aRoutes=[];this._oParent=p;this._oConfig=c;this._oRouter=r;var t=this,v=c.pattern,S,d,e=r._isAsync();d=e?a:s;for(var f in d){this[f]=d[f];}if(!Array.isArray(v)){v=[v];}if(c.parent){var o=this._getParentRoute(c.parent);if(!o){L.error("No parent route with '"+c.parent+"' could be found",this);}else if(o._aPattern.length>1){L.error("Routes with multiple patterns cannot be used as parent for nested routes",this);return;}else{this._oNestingParent=o;v.forEach(function(h,i){var n=o._aPattern[0];n=n.charAt(n.length)==="/"?n:n+"/";v[i]=n+h;});}}if(Array.isArray(c.subroutes)){S=c.subroutes;c.subroutes={};q.each(S,function(i,h){c.subroutes[h.name]=h;});}if(!c.target){var g=this._convertToTargetOptions(c);g._async=e;this._oTarget=new T(g,r._oViews,p&&p._oTarget);this._oTarget._bUseRawViewId=true;}if(c.subroutes){q.each(c.subroutes,function(h,i){if(i.name===undefined){i.name=h;}r.addRoute(i,t);});}if(c.pattern===undefined){return;}q.each(v,function(i,h){t._aPattern[i]=h;t._aRoutes[i]=r._oRouter.addRoute(h);t._aRoutes[i].greedy=c.greedy;t._aRoutes[i].matched.add(function(){var A={};q.each(arguments,function(j,k){A[t._aRoutes[i]._paramsIds[j]]=k;});t._routeMatched(A,true);});});},destroy:function(){E.prototype.destroy.apply(this);this._aPattern=null;this._aRoutes=null;this._oParent=null;this._oConfig=null;this.bIsDestroyed=true;return this;},getURL:function(p){return this._aRoutes[0].interpolate(p);},getPattern:function(){return this._aPattern[0];},match:function(h){return this._aRoutes.some(function(r){return r.match(h);});},attachMatched:function(d,f,l){return this.attachEvent("matched",d,f,l);},detachMatched:function(f,l){return this.detachEvent("matched",f,l);},attachBeforeMatched:function(d,f,l){return this.attachEvent("beforeMatched",d,f,l);},detachBeforeMatched:function(f,l){return this.detachEvent("beforeMatched",f,l);},fireBeforeMatched:function(A){this.fireEvent("beforeMatched",A);return this;},attachPatternMatched:function(d,f,l){return this.attachEvent("patternMatched",d,f,l);},detachPatternMatched:function(f,l){return this.detachEvent("patternMatched",f,l);},_validateConfig:function(c){if(!c.name){L.error("A name has to be specified for every route",this);}if(c.viewName){L.error("The 'viewName' option shouldn't be used in Route. please use 'view' instead",this);}},_convertToTargetOptions:function(o){return q.extend(true,{},o,{rootView:o.targetParent,controlId:o.targetControl,controlAggregation:o.targetAggregation,clearControlAggregation:o.clearTarget,viewName:o.view,viewType:o.viewType,viewId:o.viewId});},_getParentRoute:function(p){var P=p.split(":");if(P.length===1||(P.length===2&&!P[0])){return this._oRouter.getRoute(P[P.length-1]);}else{b(this._oRouter._oOwner,"No owner component for "+this._oRouter._oOwner.getId());var o=C.getOwnerComponentFor(this._oRouter._oOwner);while(o){if(o.getMetadata().getName()===P[0]){var r=o.getRouter();return r.getRoute(P[1]);}o=C.getOwnerComponentFor(o);}return null;}}});R.M_EVENTS={BeforeMatched:"beforeMatched",Matched:"matched",PatternMatched:"patternMatched"};return R;});
