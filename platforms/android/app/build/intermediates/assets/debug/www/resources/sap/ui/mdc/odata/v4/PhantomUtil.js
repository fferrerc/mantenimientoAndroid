/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/model/json/JSONModel','sap/ui/base/ManagedObject'],function(J,M){"use strict";function r(n,v){var f=this,N="this",c={},A=new J(n),m=n.getAttribute("metadataContexts"),o;return v.visitAttributes(n).then(function(){A._getObject=function(p,b){return n.getAttribute(p);};A.getContextName=function(){return N;};if(m){o=m?M.bindingParser(m):{parts:[]};if(!o.parts){o={parts:[o]};}for(var j=0;j<o.parts.length;j++){a(c,v,o.parts[j],o);v=v["with"](c,false);}}c[N]=A.getContext("/");var C=v["with"](c,true);return C.insertFragment(f,n);});}function a(c,v,C,m){var k=C.name||C.model||undefined;if(m[k]){return;}try{c[k]=v.getContext(C.model+">"+C.path);m[k]=c[k];}catch(e){}}return{resolve:r};});
