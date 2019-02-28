// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/utils','sap/ushell/System','sap/ushell/Ui5ServiceFactory','sap/ui/base/EventProvider','sap/ui/core/service/ServiceFactoryRegistry','sap/ui/core/Control','jquery.sap.global','jquery.sap.mobile'],function(u,S,U,E,a,C,q){"use strict";var b="sap.ushell.services.Container",c="sap.ushell.Container.dirtyState.",o,p,f;function d(){close();}function r(){document.location="about:blank";}function g(P){if(p&&p[P]){return p[P];}return"sap.ushell.adapters."+P;}function h(s){return(o.services&&o.services[s])||{};}function j(n,s,P,A){var e=h(n).adapter||{},i=e.module||g(s.getPlatform())+"."+n+"Adapter";function m(){return new(q.sap.getObject(i))(s,P,{config:e.config||{}});}if(A){return new Promise(function(t,v){var M=i.replace(/\./g,'/');sap.ui.require([M],function(){try{t(m());}catch(w){v(w);}});});}else{q.sap.require(i);return m();}}function k(A){var m=new E(),n=false,R=[],s={},t="sap.ushell.Container."+A.getSystem().getPlatform()+".remoteSystem.",v={},G,w,L=u.getLocalStorage(),x=new u.Map(),y="sap.ushell.Container."+A.getSystem().getPlatform()+".sessionTermination",z=this;this.cancelLogon=function(){if(this.oFrameLogonManager){this.oFrameLogonManager.cancelXHRLogon();}};this.createRenderer=function(e,i){var F,H,I;q.sap.measure.start("FLP:Container.InitLoading","Initial Loading","FLP");u.setPerformanceMark("FLP - renderer created");e=e||o.defaultRenderer;if(!e){throw new Error("Missing renderer name");}I=(o.renderers&&o.renderers[e])||{};H=I.module||(e.indexOf(".")<0?"sap.ushell.renderers."+e+".Renderer":e);if(I.componentData&&I.componentData.config){F={config:I.componentData.config};}function J(){var K=new(q.sap.getObject(H))({componentData:F});var M=K instanceof sap.ui.core.UIComponent?new sap.ui.core.ComponentContainer({component:K,height:"100%",width:"100%"}):K;if(!(M instanceof C)){throw new Error("Unsupported renderer type for name "+e);}M.placeAt=function(N,P){var O=N,Q="canvas",T=document.body;if(N===T.id){O=document.createElement("div");O.setAttribute("id",Q);O.classList.add("sapUShellFullHeight");switch(P){case"first":if(T.firstChild){T.insertBefore(O,T.firstChild);break;}case"only":T.innerHTML='';default:T.appendChild(O);}N=Q;P='';}C.prototype.placeAt.call(this,N,P);};s[e]=K;m.fireEvent("rendererCreated",{renderer:K});return M;}if(i){return new Promise(function(K,M){var N=H.replace(/\./g,'/');sap.ui.require([N],function(){try{K(J());}catch(O){M(O);}});});}else{q.sap.require(H);return J();}};this.getRenderer=function(e){var i,F;e=e||o.defaultRenderer;if(e){i=s[e];}else{F=Object.keys(s);if(F.length===1){i=s[F[0]];}else{q.sap.log.warning("getRenderer() - cannot determine renderer, because no default renderer is configured and multiple instances exist.",undefined,b);}}if(i instanceof sap.ui.core.ComponentContainer){return i.getComponentInstance();}return i;};this.DirtyState={CLEAN:"CLEAN",DIRTY:"DIRTY",MAYBE_DIRTY:"MAYBE_DIRTY",PENDING:"PENDING",INITIAL:"INITIAL"};this.getGlobalDirty=function(){var i,F=new q.Deferred(),H=q.sap.uid(),I,P=0,J=this.DirtyState.CLEAN;function K(){if(P===0||J===z.DirtyState.DIRTY){F.resolve(J);q.sap.log.debug("getGlobalDirty() Resolving: "+J,null,"sap.ushell.Container");}}function M(N){if(N.key.indexOf(c)===0&&N.newValue!==z.DirtyState.INITIAL&&N.newValue!==z.DirtyState.PENDING){q.sap.log.debug("getGlobalDirty() Receiving event key: "+N.key+" value: "+N.newValue,null,"sap.ushell.Container");if(N.newValue===z.DirtyState.DIRTY||N.newValue===z.DirtyState.MAYBE_DIRTY){J=N.newValue;}P-=1;K();}}try{L.setItem(H,"CHECK");L.removeItem(H);}catch(e){q.sap.log.warning("Error calling localStorage.setItem(): "+e,null,"sap.ushell.Container");return F.resolve(this.DirtyState.MAYBE_DIRTY).promise();}if(G){throw new Error("getGlobalDirty already called!");}G=F;window.addEventListener('storage',M);F.always(function(){window.removeEventListener('storage',M);G=undefined;});for(i=L.length-1;i>=0;i-=1){I=L.key(i);if(I.indexOf(c)===0){if(L.getItem(I)==='PENDING'){L.removeItem(I);q.sap.log.debug("getGlobalDirty() Cleanup of unresolved 'PENDINGS':"+I,null,"sap.ushell.Container");}else{P+=1;u.localStorageSetItem(I,this.DirtyState.PENDING,true);q.sap.log.debug("getGlobalDirty() Requesting status for: "+I,null,"sap.ushell.Container");}}}K();setTimeout(function(){if(F.state()!=="resolved"){F.resolve('MAYBE_DIRTY');q.sap.log.debug("getGlobalDirty() Timeout reached, - resolved 'MAYBE_DIRTY'",null,"sap.ushell.Container");}},P*2000);return F.promise();};this.getLogonSystem=function(){return A.getSystem();};this.getUser=function(){return A.getUser();};this.getDirtyFlag=function(){for(var i=0;i<R.length;i++){n=n||R[i].call();}return n;};this.setDirtyFlag=function(i){n=i;};this.sessionKeepAlive=function(){if(A.sessionKeepAlive){A.sessionKeepAlive();}};this.registerDirtyStateProvider=function(e){if(typeof e!=="function"){throw new Error("fnDirty must be a function");}R.push(e);};this.getService=function(e,P,i){var F={},M,K,H,I,J,N;function O(V){var W=new q.Deferred();if(!V){throw new Error("Missing system");}W.resolve(j(e,V,P));sap.ushell.Container.addRemoteSystem(V);return W.promise();}if(!e){throw new Error("Missing service name");}if(e.indexOf(".")>=0){throw new Error("Unsupported service name");}J=h(e);M=J.module||"sap.ushell.services."+e;K=M+"/"+(P||"");N={config:J.config||{}};function Q(V,I){F.createAdapter=O;return new V(I,F,P,N);}function T(H,i){var V;if(H.hasNoAdapter){V=new H(F,P,N);}else{I=j(e,A.getSystem(),P,i);if(i){return I.then(function(W){var V=Q(H,W);x.put(K,V);return V;});}else{V=Q(H,I);}}x.put(K,V);return i?Promise.resolve(V):V;}if(!x.containsKey(K)){if(i){return new Promise(function(V){sap.ui.require([M.replace(/[.]/g,"/")],function(W){V(T(W,true));});});}else{H=sap.ui.requireSync(M.replace(/[.]/g,"/"));return T(H);}}if(i){return Promise.resolve(x.get(K));}else{return x.get(K);}};this.getServiceAsync=function(e,P){return Promise.resolve(this.getService(e,P,true));};function B(){var F,H,i,K;for(i=L.length-1;i>=0;i-=1){K=L.key(i);if(K.indexOf(t)===0){try{F=K.substring(t.length);H=JSON.parse(L.getItem(K));v[F]=new S(H);}catch(e){L.removeItem(K);}}}return v;}function D(){if(typeof OData==='undefined'){return;}function e(i,F,H){q.sap.log.warning(i,null,"sap.ushell.Container");if(H){setTimeout(H.bind(null,i),5000);}return{abort:function(){return;}};}OData.read=function(i,F,H){return e("OData.read('"+(i&&i.Uri?i.requestUri:i)+"') disabled during logout processing",F,H);};OData.request=function(i,F,H){return e("OData.request('"+(i?i.requestUri:"")+"') disabled during logout processing",F,H);};}this.addRemoteSystem=function(e){var i=e.getAlias(),O=v[i];if(O){if(O.toString()===e.toString()){return;}q.sap.log.warning("Replacing "+O+" by "+e,null,"sap.ushell.Container");}else{q.sap.log.debug("Added "+e,null,"sap.ushell.Container");}v[i]=e;u.localStorageSetItem(t+i,e);};this.addRemoteSystemForServiceUrl=function(e){var M,i={baseUrl:";o="};if(!e||e.charAt(0)!=='/'||e.indexOf('//')===0){return;}M=/^[^?]*;o=([^\/;?]*)/.exec(e);if(M&&M.length>=2){i.alias=M[1];}e=e.replace(/;[^\/?]*/g,"");if(/^\/sap\/(bi|hana|hba)\//.test(e)){i.platform="hana";i.alias=i.alias||"hana";}else if(/^\/sap\/opu\//.test(e)){i.platform="abap";}if(i.alias&&i.platform){this.addRemoteSystem(new S(i));}};this.attachLogoutEvent=function(F){m.attachEvent("Logout",F);};this.detachLogoutEvent=function(F){m.detachEvent("Logout",F);};this.attachRendererCreatedEvent=function(F){m.attachEvent("rendererCreated",F);};this.detachRendererCreatedEvent=function(F){m.detachEvent("rendererCreated",F);};this.logout=function(){var i=new q.Deferred();function F(){A.logout(true).always(function(){L.removeItem(y);i.resolve();});}function H(){if(m.fireEvent("Logout",true)){F();}else{setTimeout(F,1000);}}function I(){var v,J=[];if(w){window.removeEventListener('storage',w);}u.localStorageSetItem(y,"pending");z._suppressOData();v=z._getRemoteSystems();Object.keys(v).forEach(function(K){try{J.push(j("Container",v[K]).logout(false));}catch(e){q.sap.log.warning("Could not create adapter for "+K,e.toString(),"sap.ushell.Container");}L.removeItem(t+K);});q.when.apply(q,J).done(H);}if(typeof A.addFurtherRemoteSystems==='function'){A.addFurtherRemoteSystems().always(I);}else{I();}return i.promise();};this.setLogonFrameProvider=function(e){if(this.oFrameLogonManager){this.oFrameLogonManager.setLogonFrameProvider(e);}};this.setXhrLogonTimeout=function(P,T){if(this.oFrameLogonManager){this.oFrameLogonManager.setTimeout(P,T);}};this.getFLPUrl=function(){var e=u.getLocationHref(),H=e.indexOf(this.getService("URLParsing").getShellHash(e));if(H===-1){return e;}return e.substr(0,H-1);};this._closeWindow=d;this._redirectWindow=r;this._getRemoteSystems=B;this._suppressOData=D;sap.ui.getCore().getEventBus().subscribe("sap.ushell.Container","addRemoteSystemForServiceUrl",function(e,i,F){z.addRemoteSystemForServiceUrl(F);});if(typeof A.logoutRedirect==='function'){w=function(e){function i(){z._closeWindow();z._redirectWindow();}if(sap.ushell.Container!==z){return;}if(e.key.indexOf(t)===0&&e.newValue&&e.newValue!==L.getItem(e.key)){u.localStorageSetItem(e.key,e.newValue);}if(e.key===y){if(e.newValue==="pending"){z._suppressOData();if(m.fireEvent("Logout",true)){i();}else{setTimeout(i,1000);}}}};window.addEventListener('storage',w);}this._getFunctionsForUnitTest=function(){return{createAdapter:j};};}function l(s){s.forEach(function(e){var i=U.createServiceFactory(e);a.register("sap.ushell.ui5service."+e,i);});}sap.ushell.bootstrap=function(P,A){var e,D=new q.Deferred();q.sap.initMobile();if(sap.ushell.Container!==undefined){e=new Error("Unified shell container is already initialized - cannot initialize twice.\nStacktrace of first initialization:"+f);q.sap.log.error(e,e.stack,b);throw e;}f=(new Error()).stack;o=q.extend({},true,window["sap-ushell-config"]||{});p=A;if(typeof window["sap.ushell.bootstrap.callback"]==="function"){setTimeout(window["sap.ushell.bootstrap.callback"]);}if(o.modulePaths){Object.keys(o.modulePaths).forEach(function(m){q.sap.registerModulePath(m,o.modulePaths[m]);});}l(["Personalization","URLParsing","CrossApplicationNavigation"]);var s=new S({alias:"",platform:o.platform||P});j("Container",s,null,true).then(function(i){i.load().then(function(){function _(){var n,t;var v=window["sap-ushell-config"];if(!v||!v.services){return false;}n=v.services.PluginManager;t=n&&n.config;return t&&t.loadPluginsFromSite;}sap.ushell.Container=new k(i);var m=[sap.ushell.Container.getServiceAsync("PluginManager")];if(_()){m.push(sap.ushell.Container.getServiceAsync("CommonDataModel"));}Promise.all(m).then(function(n){var t=n[0],v=n[1];var w=v?v.getPlugins():q.when({});w.then(function(x){var y=q.extend(true,{},o.bootstrapPlugins,x);t.registerPlugins(y);});});D.resolve();});});return D.promise();};});
