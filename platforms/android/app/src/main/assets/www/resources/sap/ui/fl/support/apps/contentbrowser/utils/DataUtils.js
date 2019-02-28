/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/GroupHeaderListItem","sap/ui/thirdparty/jquery"],function(G,q){"use strict";var D={aBlacklist:[{category:"NS",name:"LREP_HOME_CONTENT",ns:"UIF/"},{category:"NS",name:"virtual~",ns:"/"}],formatData:function(d,f){if((f==="js")||(f==="properties")){return d;}try{d=JSON.parse(d);return JSON.stringify(d,null,'\t');}catch(e){var E=sap.ui.require("sap/ui/fl/support/apps/contentbrowser/utils/ErrorUtils");E.displayError("Error",e.name,e.message);return d;}},getGroupHeader:function(g){var t="{i18n>systemData}";if(g.key==="custom"){t="{i18n>externalReferences}";}return new G({title:t,upperCase:false});},isNotOnBlacklist:function(c){var n=true;q.each(this.aBlacklist,function(i,b){var a=true;q.each(b,function(p,v){a=a&&c[p]===v;});if(a){n=false;return false;}});return n;},cleanLeadingAndTrailingSlashes:function(n){if(!n){return"";}if(n[0]==="/"){var N=n.substring(1,n.length);return this.cleanLeadingAndTrailingSlashes(N);}if(n[n.length-1]==="/"){var s=n.substring(0,n.length-1);return this.cleanLeadingAndTrailingSlashes(s);}return n;},formatItemTitle:function(m){return m.namespace+m.fileName+"."+m.fileType;},endsStringWith:function(s,S){return s.indexOf(S,s.length-S.length)!==-1;}};return D;},true);
