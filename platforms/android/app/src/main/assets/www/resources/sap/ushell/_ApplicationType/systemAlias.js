// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/URI","sap/ushell/utils"],function(U,u){"use strict";var S="";var O={apply:"apply",applied:"applied"};function i(o){return(o.protocol()||"").length>0;}function r(k,l,E){var m=typeof l==="string";var n=[k];if(m){n.unshift(l);}var K=u.generateLocalStorageKey("sap-system-data",n);var L=u.getLocalStorage();var o=L.getItem(K);var p={};if(o){try{p=JSON.parse(o);}catch(q){return new jQuery.Deferred().reject("Cannot parse system data from local storage at key '"+K+"'. Data: "+o);}return new jQuery.Deferred().resolve(p).promise();}else if(m){return new jQuery.Deferred().reject("Cannot find data for system '"+k+"' in local storage using key '"+K+"'");}if(!E){return new jQuery.Deferred().reject("fallback: the adapter does not implement resolveSystemAlias").promise();}return E(k);}function a(k,l,o,m,E){var n=o,D=new jQuery.Deferred();r(k,l,E).fail(function(p){D.reject(p);}).done(function(R){var V=v(R);if(!V.isValid){g(V);D.reject("Invalid system alias definition");return D;}var p=f(R,new U(window.location.toString()).protocol()),q=R[p],Q,L,t;if(k===S&&q.host===""&&(q.port===0||q.port==="")){p="";}n.protocol(p);n.hostname(q.host);n.port(q.port);j(n,m,q.pathPrefix,E).fail(function(w){D.reject(w);}).done(function(n){Q=n.query();if(typeof R.client==="string"&&R.client!==""){Q=Q+(Q.length>0?"&":"")+"sap-client="+R.client;}if(typeof R.language==="string"&&R.language!==""){L=R.language;}else{t=sap.ushell.Container.getUser();if(!t){jQuery.sap.log.error("Cannot retieve the User object via sap.ushell.Container while determining sap-language","will default to 'en' language","sap.ushell.services.ClientSideTargetResolution");L="en";}else{L=t.getLanguage();}}Q=Q+(Q.length>0?"&":"")+"sap-language="+L;n.query(Q);if(R.hasOwnProperty("rfc")&&m==="NATIVEWEBGUI"){var w=c(R.rfc,q.host,n);var P=n.path()+";"+w;n.path(P);o._parts.path=P;}D.resolve(n);});});return D.promise();}function s(o,k,l,m,n,p,E){var D=new jQuery.Deferred();if(p!==O.apply&&p!==O.applied){throw new Error("Invalid system alias semantic was provided: '"+p+"'");}if(p===O.applied&&((typeof l==="undefined"||k===l))){return D.resolve(o).promise();}if(p===O.apply&&typeof k==="undefined"&&typeof l==="undefined"){return D.resolve(o).promise();}if(n==="URL"&&p==O.applied){return b(o,k,l,m,E);}(new Promise(function(R){if(p===O.apply){R({targetUri:o,alias:l?l:k,sapSystemSrc:l?m:undefined});return;}d(o,k,undefined,n,E).fail(function(q){D.reject(q);}).done(function(q){R({targetUri:q,alias:l});});})).then(function(A){a(A.alias,A.sapSystemSrc,A.targetUri,n,E).fail(function(q){D.reject(q);}).done(function(I){D.resolve(I);});});return D.promise();}function b(o,k,l,m,E){var D=new jQuery.Deferred();if(k===S||typeof k==="undefined"){if(i(o)){return D.resolve(o);}a(l,m,o,"URL",E).fail(function(n){D.reject(n);}).done(function(n){D.resolve(n);});return D.promise();}r(k,m,E).fail(function(n){D.reject(n);}).done(function(R){var n=f(R,new U(window.location.toString()).protocol()),p=R[n],q;if((o.protocol()||"").toLowerCase()===n&&(o.hostname()||"")===p.host&&(o.path().indexOf(p.pathPrefix)===0)){o.protocol("");o.hostname("");q=o.path().replace(p.pathPrefix,"");o.path(q);h(o,["sap-language","sap-client"]);a(l,m,o,"URL",E).fail(function(t){D.reject(t);}).done(function(t){D.resolve(t);});}else{D.resolve(o);}});return D.promise();}function c(k,l){var R,m,I,t,n;I=!!k.systemId;if(I){t=[k.systemId&&("~sysid="+k.systemId),k.loginGroup&&("~loginGroup="+k.loginGroup),k.sncNameR3&&("~messageServer="+encodeURIComponent(k.sncNameR3)),k.sncNameR3&&("~sncNameR3="+encodeURIComponent(k.sncNameR3)),k.sncQoPR3&&("~sncQoPR3="+k.sncQoPR3)].filter(function(o){return(typeof o==="string")&&(o!=="");});}else{n=(k.host||"");m=n.toLowerCase()===l.toLowerCase();R=/^[/][HGMR][/].*/.test(n);if(n.length>0&&!m&&!R){jQuery.sap.log.error("Invalid connect string provided in 'host' field of system alias","Data for rfc destination provided are: "+JSON.stringify(k,null,3),"sap.ushell.services.ClientSideTargetResolution");}t=[n&&!R&&!m&&("~rfcHostName="+n),R&&("~connectString="+encodeURIComponent(n)),k.service&&("~service="+k.service),k.sncNameR3&&("~sncNameR3="+encodeURIComponent(k.sncNameR3)),k.sncQoPR3&&("~sncQoPR3="+k.sncQoPR3)].filter(function(o){return(typeof o==="string")&&(o!=="");});}return t.join(";").replace(/(%[A-F0-9]{2})/g,function(E){return E.toLowerCase();});}function d(o,k,l,m,E){var D=new jQuery.Deferred();if(typeof k==="undefined"){e(o,k,m,undefined,E).fail(function(n){D.reject(n);}).done(function(n){D.resolve(n);});return D.promise();}r(k,l,E).fail(function(n){D.reject(n);}).done(function(R){e(o,k,m,R,E).fail(function(n){D.reject(n);}).done(function(n){D.resolve(n);});});return D.promise();}function e(o,k,l,R,E){var m,n,t,p,D=new jQuery.Deferred(),P=new jQuery.Deferred();o.protocol("");o.hostname("");o.port("");h(o,["sap-client","sap-language"]);if(!jQuery.isPlainObject(R)||typeof k!=="string"){return D.resolve(o).promise();}n=f(R,new U(window.location.toString()).protocol());m=R[n];p=(typeof m.pathPrefix==="string")&&m.pathPrefix;if(p!==""){P.resolve(p);}else{r("",undefined,E).fail(function(q){D.reject(q);}).done(function(q){var w=q[n];P.resolve(w.pathPrefix);});}P.fail(function(q){D.reject(q);}).done(function(p){if(p&&p.length>0){t=o.path();t=t.replace(p,"");if(t.indexOf("/")!==0){t="/"+t;}o.path(t);}if(l==="NATIVEWEBGUI"&&R.hasOwnProperty("rfc")){t=o.path();t=t.split(";").filter(function(q){return q.indexOf("~sysid=")!==0&&q.indexOf("~service=")!==0&&q.indexOf("~loginGroup=")!==0&&q.indexOf("~messageServer=")!==0&&q.indexOf("~sncNameR3=")!==0&&q.indexOf("~sncQoPR3=")!==0;}).join(";");o.path(t);}D.resolve(o);});return D.promise();}function f(o,B){if(o.hasOwnProperty("https")){return"https";}if(o.hasOwnProperty("http")){return"http";}jQuery.sap.log.error("Cannot select which system alias to pick between http/https","make sure they are provided in the given system alias collection","sap.ushell.services.ClientSideTargetResolution");return undefined;}function g(V){jQuery.sap.log.error("Invalid system alias definition: "+V.debug,"ERRORS:"+V.errors.map(function(E){return"\n - "+E;}).join(""),"sap.ushell.ApplicationType");}function v(R){function k(F){var E=[];if(typeof F.host!=="string"){E.push("host field must be a string");}if(typeof F.port!=="number"&&typeof F.port!=="string"){E.push("port field must be a number or a string");}if(typeof F.pathPrefix!=="string"){E.push("pathPrefix field must be a string");}return E;}var E=[],H=R.hasOwnProperty("https"),l=R.hasOwnProperty("http");if(!l&&!H){E.push("at least one of 'http' or 'https' fields must be defined");}if(H){k(R.https).forEach(function(m){E.push("https>"+m);});}if(l){k(R.http).forEach(function(m){E.push("http>"+m);});}if(E.length>0){return{isValid:false,errors:E,debug:JSON.stringify(R,null,3)};}return{isValid:true};}function h(o,p){var B={},t;p.forEach(function(P){B[P]=true;});t=o.query();t=t.split("&").filter(function(P){var k=(P.split("=")[0]||"").toLowerCase();return!B.hasOwnProperty(k);}).join("&");o.query(t);}function j(o,k,p,E){var D=new jQuery.Deferred(),t;if(k==="URL"&&p.length===0){return D.resolve(o).promise();}function l(P){var R=P+o.path();o.path(R.replace(/\/+/g,"/"));D.resolve(o);}r("",undefined,E).fail(function(m){D.reject(m);}).done(function(R){var m=f(R,new U(window.location.toString()).protocol());var L=R[m].pathPrefix;var P=p===L;if(p.length>0&&!P){if((k==="WDA"||k==="WEBGUI")&&o.path().indexOf("~canvas")>=0){t=o.path();t="/~canvas"+t.split("~canvas")[1];o.path(t);}}if(p.length===0){l(L);}else{l(p);}});return D.promise();}return{LOCAL_SYSTEM_ALIAS:S,SYSTEM_ALIAS_SEMANTICS:O,spliceSapSystemIntoURI:s,isAbsoluteURI:i,stripURI:d,selectSystemAliasDataName:f,constructNativeWebguiParameters:c};},false);