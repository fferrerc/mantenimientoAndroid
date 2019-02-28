/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Element","sap/ui/base/ManagedObjectObserver","sap/ui/unified/Menu","sap/ui/unified/MenuItem","sap/m/ResponsivePopover","sap/ui/vbm/Viewport","./adapter3d/ObjectFactory","./adapter3d/VBIJSONParser","./adapter3d/SceneBuilder","./adapter3d/Utilities","sap/m/HBox","sap/m/VBox","sap/m/Link","sap/m/Button","sap/m/Text","sap/m/Image","./adapter3d/thirdparty/three"],function(q,l,E,O,M,c,P,V,d,e,S,U,H,f,L,B,T,I,h){"use strict";var t="sap.ui.vbm.adapter3d.Adapter3D";var j=q.sap.log;var k=U.toBoolean;var n=U.applyColor;var o;var A=E.extend("sap.ui.vbm.Adapter3D",{metadata:{library:"sap.ui.vbm",associations:{viewport:{type:"sap.ui.vbm.Viewport"}},events:{submit:{parameters:{data:{type:"string"}}}}}});var r=A.getMetadata().getParent().getClass().prototype;A.prototype.init=function(){if(r.init){r.init.call(this);}this._viewport=null;this._context={resources:new Map(),dataTypes:[],data:{},windows:[],scenes:[],actions:[],voQueues:{toAdd:new Map(),toUpdate:new Map(),toRemove:new Map()},sceneQueues:{toAdd:[],toUpdate:[],toRemove:[]},windowQueues:{toAdd:[],toUpdate:[],toRemove:[]},setupView:undefined};this._parser=null;this._sceneBuilder=null;this._lastHoverInstance=null;this._hoverTimeOutId=null;this._clickTimerId=null;this._mouseDown=false;this._lastXY={x:0,y:0};this._viewportObserver=new O(this._observeChanges.bind(this));this._detail={popover:undefined,anchor:undefined,pending:undefined};};A.prototype.exit=function(){if(this._clickTimerId){q.sap.clearDelayedCall(this._clickTimerId);this._clickTimerId=null;}if(this._hoverTimeOutId){clearTimeout(this._hoverTimeOutId);this._hoverTimeOutId=null;}this._disconnectViewport();this._viewportObserver.disconnect();this._viewportObserver=null;if(this._sceneBuilder){this._sceneBuilder.destroy();this._sceneBuilder=null;}if(this._parser){this._parser.destroy();this._parser=null;}this._context=null;if(r.exit){r.exit.call(this);}};A.prototype._getSceneRoot=function(){return this._viewport.getRoot();};A.prototype.setViewport=function(v){this.setAssociation("viewport",v,true);this._configureViewport();return this;};A.prototype._configureViewport=function(){var a=sap.ui.getCore().byId(this.getViewport())||null;if(a!==this._viewport){this._disconnectViewport();this._viewport=a;this._connectViewport();}return this;};A.prototype._connectViewport=function(){if(this._viewport){this._viewportObserver.observe(this._viewport,{destroy:true});this._viewport.addEventDelegate(o,this);}return this;};A.prototype._disconnectViewport=function(){if(this._viewport){this._viewport.removeEventDelegate(o);o.onBeforeRendering.call(this);this._viewportObserver.unobserve(this._viewport,{destroy:true});this._viewport=null;}return this;};A.prototype._observeChanges=function(a){if(a.type==='destroy'&&a.object===this._viewport){this._disconnectViewport();}};A.prototype.load=function(a){var b=this;b._configureViewport();if(!b._viewport){return Promise.reject();}var p=null;var g=b._getSceneRoot();if(!b._parser){b._parser=new e(b._context);}if(!b._sceneBuilder){b._sceneBuilder=new S(b._context,g,b._viewport);}if(typeof a==="string"){try{p=JSON.parse(a);}catch(i){j.error("sap.ui.vbm.Adapter: attempt to load invalid JSON string.");return Promise.resolve();}}else if(typeof a==="object"){p=a;}if(!(p&&p.SAPVB)){j.error("sap.ui.vbm.Adapter3D: attempt to load null.");return Promise.resolve();}b._parser.loadVBIJSON(p);return b._sceneBuilder.synchronize().then(function(){b._processAutomation(p);b._processDetailWindow();b._context.voQueues.toAdd.clear();b._context.voQueues.toUpdate.clear();b._context.voQueues.toRemove.clear();b._context.sceneQueues.toAdd.splice(0);b._context.sceneQueues.toUpdate.splice(0);b._context.sceneQueues.toRemove.splice(0);b._context.windowQueues.toAdd.splice(0);b._context.windowQueues.toUpdate.splice(0);b._context.windowQueues.toRemove.splice(0);});};A.prototype._processDetailWindow=function(p){var w=sap.ui.vbm.findInArray(this._context.windowQueues.toAdd,function(w){return w.type==="callout";});var a=w&&sap.ui.vbm.findInArray(this._context.scenes,function(a){return a.id===w.refScene;});if(w&&a){this._closeDetailWindow();var b=this._createDetailWindow(w);this._fillDetailWindow(b,a);this._openDetailWindow(b,w);}};A.prototype._closeDetailWindow=function(){if(this._detail.popover){this._detail.popover.close();this._detail.popover.destroy();this._detail.popover=undefined;}if(this._detail.anchor){this._detail.anchor.style.visibility="hidden";}};A.prototype._createDetailWindow=function(w){var a;if(w.caption!==""){var b=new sap.m.Text({width:"100%",textAlign:sap.ui.core.TextAlign.Center,text:w.caption,tooltip:w.caption});a=new sap.m.Bar({contentLeft:[b]});}var p=new sap.m.ResponsivePopover({placement:sap.m.PlacementType.Auto,showCloseButton:true,verticalScrolling:true,contentWidth:w.width+"px"});p.addStyleClass("sapUiVbmDetailWindow");if(a){p.setCustomHeader(a);}return p;};A.prototype._getAnchor=function(x,y){if(!this._detail.anchor){var a=document.createElement("div");a.classList.add("sapUiVbmDetailWindowAnchor");this._viewport.getDomRef().appendChild(a);this._detail.anchor=a;}this._detail.anchor.style.left=x+"px";this._detail.anchor.style.top=y+"px";return this._detail.anchor;};A.prototype._openDetailWindow=function(p,a){var b=a.pos.split(";");var w=new h.Vector3(parseFloat(b[0]),parseFloat(b[1]),parseFloat(b[2]));if(!this._viewport.getDomRef()){if(this._detail.pending){this._detail.pending.popover.destroy();}this._detail.pending={world:w,popover:p};}else{var g=this._viewport.getDomRef().getBoundingClientRect();var i=this._viewport.worldToScreen(U.vbToThreeJs(w));i.x=U.clamp(i.x,5,g.width-5);i.y=U.clamp(i.y,5,g.height-5);p.openBy(this._getAnchor(i.x,i.y));p.attachAfterClose(function(){this._closeDetailWindow();}.bind(this));this._detail.popover=p;}};A.prototype._openDetailPending=function(){if(this._detail.pending&&this._viewport.getDomRef()){var a=this._viewport.worldToScreen(U.vbToThreeJs(this._detail.pending.world));this._detail.pending.popover.openBy(this._getAnchor(a.x,a.y));this._detail.popover=this._detail.pending.popover;this._detail.pending=undefined;}};A.prototype._fillDetailWindow=function(p,m){var u=function(a){var b;switch(a){case"1":b=sap.m.FlexJustifyContent.Start;break;case"2":b=sap.m.FlexJustifyContent.Center;break;case"4":b=sap.m.FlexJustifyContent.End;break;default:b=sap.m.FlexJustifyContent.Inherit;break;}return b;};var w=function(i){var a;switch(i.type){case"{00100000-2013-1000-1100-50059A6A47FA}":a=new T({text:i.vo.text,tooltip:i.vo.tooltip});a.addStyleClass("sapUiVbmDetailWindowBase sapUiVbmDetailWindowCaption");if(i.vo.level==="3"){a.addStyleClass("sapUiVbmDetailWindowCaption3");}break;case"{00100000-2013-1000-3700-AD84DDBBB31B}":a=new T({text:i.vo.text,tooltip:i.vo.tooltip});a.addStyleClass("sapUiVbmDetailwindowBase");break;case"{00100000-2013-1000-2400-D305F7942B98}":a=new L({text:i.vo.text,tooltip:i.vo.tooltip,href:i.vo.autoexecute?i.vo.reference:""});a.addStyleClass("sapUiVbmDetailWindowBase");break;case"{00100000-2013-1000-1200-855B919BB0E9}":a=new B({text:i.vo.text,tooltip:i.vo.tooltip});break;case"{00100000-2013-1000-2200-6B060A330B2C}":if(i.vo.image&&i.vo.image!==""){a=new I({src:this._context.resources.get(i.vo.image),tooltip:i.vo.tooltip});}break;default:j.error("sap.ui.vbm.Adapter3D: attempt to create unknown element of detail window: "+i.type);}return a;};var x=m.voGroups.map(function(a){return a.vos.map(function(v){return{type:a.type,vo:v};});}).reduce(function(a,b){return a.concat(b);}).sort(function(a,b){return parseInt(a.vo.top,10)-parseInt(b.vo.top,10);}).reduce(function(g,a){var b=a.vo.top?a.vo.top:"0";g[b]=g[b]||[];g[b].push(a);return g;},{});var y=new f();for(var z in x){if(x.hasOwnProperty(z)){var C=new H({width:Math.max.apply(null,x[z].map(function(i){return parseInt(i.vo.right,10);}))+"px"});var D=0;x[z].sort(function(a,b){return parseInt(a.vo.left,10)-parseInt(b.vo.left,10);}).map(function(i){var a=[];if((parseInt(i.vo.left,10)-D)>1){a.push(new H({width:(parseInt(i.vo.left,10)-D)+"px"}));}var b=new H({width:(parseInt(i.vo.right,10)-parseInt(i.vo.left,10))+"px",justifyContent:u(i.vo.align)});D=parseInt(i.vo.right,10);b.addItem(w.bind(this)(i));a.push(b);return a;},this).reduce(function(a,b){return a.concat(b);}).forEach(C.addItem,C);y.addItem(C);}}p.addContent(y);};A.prototype._processAutomation=function(a){var b=this;var g=function(m,p,C,D,w){var F=new c({text:p.text,enabled:p.disabled==="X"?false:true,startsSection:w,select:b._menuItemSelectionHandler.bind(b,p.id,C.instance,D,C.object)});if(p.MenuItem){var G=new M();w=false;[].concat(p.MenuItem).forEach(function(J){if(J.hasOwnProperty("Separator")){w=true;}else{g(G,J,C,D,w);w=false;}});F.setSubmenu(G);}m.addItem(F);};if(a&&a.SAPVB&&a.SAPVB.Automation&&a.SAPVB.Automation.Call&&a.SAPVB.Automation.Call){if(a.SAPVB.Automation.Call.handler&&a.SAPVB.Automation.Call.handler==="CONTEXTMENUHANDLER"){var x=[].concat(a.SAPVB.Automation.Call.Param).filter(function(p){return p.name==="x";});var y=[].concat(a.SAPVB.Automation.Call.Param).filter(function(p){return p.name==="y";});var i;if(x.length>0&&y.length>0){i=x[0]["#"]+" "+y[0]["#"];}if(a.SAPVB&&a.SAPVB.Menus&&a.SAPVB.Menus.Set){var u=[].concat(a.SAPVB.Menus.Set).filter(function(m){return m.Menu.id===a.SAPVB.Automation.Call.refID;});if(u.length>0){var v=new M();var w=false;[].concat(u[0].Menu.MenuItem).forEach(function(m){if(m.hasOwnProperty("Separator")){w=true;}else{g(v,m,a.SAPVB.Automation.Call,u[0].Menu.action,w);w=false;}});var z=sap.ui.core.Popup.Dock;v.open(false,this._viewport,z.BeginTop,z.BeginTop,this._viewport,i);}}}}return this;};A.prototype._menuItemSelectionHandler=function(i,a,b,v){var p={version:"2.0","xmlns:VB":"VB",Action:{id:i,instance:a,name:b,object:v}};this.fireSubmit({data:JSON.stringify(p)});};A.prototype._genericEventHandler=function(a,b){var i=b.instance;var g=i?i.voGroup.id:b.voGroupId;var m=sap.ui.vbm.findInArray(this._context.actions,function(w){return w.refVO===g&&w.refEvent===a;});if(m){var p=[];var u={version:"2.0","xmlns:VB":"VB",Action:{id:m.id,name:m.name,object:m.refVO,instance:i&&i.id?i.voGroup.datasource+"."+i.id:"",Params:{Param:p}}};if(m.name==="KEY_PRESS"){if(b.key=="Shift"||b.code==16||b.key=="Control"||b.code==17||b.key=="Alt"||b.code==18||b.key=="Meta"||b.code==91){return this;}else{p.push({"name":"code","#":b.keyCode},{"name":"shift","#":b.shiftKey},{"name":"ctrl","#":b.ctrlKey},{"name":"alt","#":b.altKey},{"name":"meta","#":b.metaKey});}}else if(b&&b.cursor){p.push({name:"x","#":b.cursor.x},{name:"y","#":b.cursor.y});}if(m.AddActionProperty){var v=[];[].concat(m.AddActionProperty).forEach(function(w){switch(w.name){case"pos":if(b.hitPoint){var x=U.threeJsToVb(b.hitPoint);v.push({name:w.name,"#":x.x+";"+x.y+";"+x.z});}break;default:break;}},this);if(v.length>0){u.Action.AddActionProperties={AddActionProperty:v};}}if(i&&a==="Click"&&b.selectionChanges){u.Data={Merge:{N:[{name:i.voGroup.datasource,E:b.selectionChanges.selected.map(function(i){return{K:i?i.id:"","VB:s":"true"};}).concat(b.selectionChanges.deselected.map(function(i){return{K:i?i.id:"","VB:s":"false"};}))}]}};}this.fireSubmit({data:JSON.stringify(u)});}};A.prototype._propagateClick=function(a){this._genericEventHandler("Click",a);};A.prototype._propagateDoubleClick=function(a){this._genericEventHandler("DoubleClick",a);};A.prototype._propagateContextMenu=function(a){this._genericEventHandler("ContextMenu",a);};A.prototype._propagateKeyPress=function(a){this._genericEventHandler("KeyPress",a);};A.prototype._propogateHoverChange=function(a){this._genericEventHandler("HoverChange",a);};A.prototype._handleClick=function(a){var i=a.instance;j.info("click","x: "+a.cursor.x+", y: "+a.cursor.y+", instance: "+(i?i.id:"")+", tooltip: "+(i?i.tooltip:""),t);this._extendEventWithSelection(a);if(a.selectionChanges){this._applySelectionChangesToScene3D(a.selectionChanges.selected,a.selectionChanges.deselected);}this._propagateClick(a);};A.prototype._handleDoubleClick=function(a){var i=a.instance;j.info("double click","x: "+a.cursor.x+", y: "+a.cursor.y+", instance: "+(i?i.id:"")+", tooltip: "+(i?i.tooltip:""),t);this._propagateDoubleClick(a);};A.prototype._handleContextMenu=function(a){var i=a.instance;if(!i){a.voGroupId="Scene";}j.info("context menu","x: "+a.cursor.x+", y: "+a.cursor.y+", instance: "+(i?i.id:"")+", tooltip: "+(i?i.tooltip:""),t);this._propagateContextMenu(a);};A.prototype._handleHover=function(a){var b;var i=a.instance;j.trace("hover","x: "+a.cursor.x+", y: "+a.cursor.y+", instance: "+(i?i.id:"")+", tooltip: "+(i?i.tooltip:""),t);if(i){b=i.tooltip;if(!b){b=i.text;}}var g=this._viewport.getDomRef();if(g){if(b){g.setAttribute("title",b);}else{g.removeAttribute("title");}}if(this._lastHoverInstance!==a.instance){clearTimeout(this._hoverTimeOutId);var m=function(){this._propogateHoverChange(a);this._hoverTimeOutId=undefined;}.bind(this);this._hoverTimeOutId=setTimeout(m,500);}this._applyHoverChangesToScene3D(i);};A.prototype._handleKeyPress=function(a){j.info("keypress",a.key,t);this._propagateKeyPress(a);};A.prototype._getXY=function(a){var b=this._viewport.getDomRef().getBoundingClientRect();return{x:(a.pageX||a.originalEvent.pageX)-window.pageXOffset-b.left,y:(a.pageY||a.originalEvent.pageY)-window.pageYOffset-b.top};};A.prototype._hitTest=function(a){var b=this._viewport.getScene();var g=this._viewport.getCamera();var p=a.cursor||this._getXY(a);var i=this._viewport.getDomRef().getBoundingClientRect();var m=new h.Vector2(p.x/i.width*2-1,-p.y/i.height*2+1);var u=new h.Raycaster();u.linePrecision=0;u.setFromCamera(m,g);var v=u.intersectObjects(b.children,true);if(v&&v.length>0){var w=v[0];return{instance:w.object&&w.object._sapInstance,point:w.point};}else{return undefined;}};A.prototype._extendEventWithInstanceAndCursor=function(a){a.cursor=this._getXY(a);var b=this._hitTest(a);if(b){a.instance=b.instance;a.hitPoint=b.point;}return this;};o={onkeydown:function(a){if(!a.originalEvent.repeat){this._handleKeyPress(a);}},oncontextmenu:function(a){this._extendEventWithInstanceAndCursor(a);if(a.button===0||Math.abs(a.cursor.x-this._lastXY.x)<5&&Math.abs(a.cursor.y-this._lastXY.y)<5){this._handleContextMenu(a);}},onmousedown:function(a){if(this._hoverTimeOutId){clearTimeout(this._hoverTimeOutId);this._hoverTimeOutId=null;}this._mouseDown=true;this._extendEventWithInstanceAndCursor(a);j.info("mousedown","x: "+a.cursor.x+", y: "+a.cursor.y,t);this._lastXY.x=a.cursor.x;this._lastXY.y=a.cursor.y;},onmouseup:function(a){this._mouseDown=false;},onhover:function(a){this._extendEventWithInstanceAndCursor(a);j.trace("hover","x: "+a.cursor.x+", y: "+a.cursor.y,t);if(this._mouseDown){if(this._lastXY.x!==a.cursor.x||this._lastXY.y!==a.cursor.y){this._skipClick=true;}return;}this._handleHover(a);},onmouseout:function(a){this._extendEventWithInstanceAndCursor(a);delete a.instance;this._handleHover(a);},onBeforeRendering:function(a){if(this._onhoverProxy){this._viewport.$().off(sap.ui.Device.browser.msie||sap.ui.Device.browser.edge?"pointermove":"mousemove",this._onhoverProxy);}if(this._onpointerdownProxy){this._viewport.$().off("pointerdown",this._onpointerdownProxy);}if(this._onpointeronProxy){this._viewport.$().off("pointerup",this._onpointerupProxy);}},onAfterRendering:function(a){if(!this._onhoverProxy){this._onhoverProxy=o.onhover.bind(this);}this._viewport.$().on(sap.ui.Device.browser.msie||sap.ui.Device.browser.edge?"pointermove":"mousemove",this._onhoverProxy);if(sap.ui.Device.browser.msie||sap.ui.Device.browser.edge){if(!this._onpointerdownProxy){this._onpointerdownProxy=o.onmousedown.bind(this);}this._viewport.$().on("pointerdown",this._onpointerdownProxy);if(!this._onpointerupProxy){this._onpointerupProxy=o.onmouseup.bind(this);}this._viewport.$().on("pointerup",this._onpointerupProxy);}if(this._detail.anchor){this._viewport.getDomRef().appendChild(this._detail.anchor);}this._openDetailPending();}};o[sap.ui.Device.browser.msie||sap.ui.Device.browser.edge?"onclick":"ontap"]=function(a){j.info("onclick","",t);this._extendEventWithInstanceAndCursor(a);if(this._skipClick){this._skipClick=false;this._handleHover(a);return;}if(this._clickTimerId){q.sap.clearDelayedCall(this._clickTimerId);this._clickTimerId=null;this._handleDoubleClick(a);}else{this._clickTimerId=q.sap.delayedCall(200,this,function(){this._clickTimerId=null;this._handleClick(a);});}};var s=sap.ui.Device.os.macintosh?"metaKey":"ctrlKey";A.prototype._extendEventWithSelection=function(a){var i=a.instance;if(i){if(a.originalEvent.type==="click"){if(!(a[s]&&a.shiftKey)){var b;var g;if(a[s]){b="toggle";g=false;}else if(a.shiftKey){b="select";g=false;}else{b="select";g=true;}a.selectionChanges=this._changeSelection(i,b,g);}}else{a.selectionChanges=this._changeSelection(i,"toggle",false);}}return this;};A.prototype._changeSelection=function(i,a,b){var g=[];var m=[];var p=i.voGroup;var w=k(i["VB:s"]);var u;if(a==="select"){if(p.maxSel!=="0"){if(w){if(b){u=p.selected.indexOf(i);m=p.selected.splice(u+1).concat(p.selected.splice(0,u));}}else{if(b||p.maxSel==="1"){m=p.selected.splice(0);}p.selected.push(i);g=[i];}}}else if(a==="toggle"){if(w){if(p.minSel==="0"||p.selected.length>1){u=p.selected.indexOf(i);m=p.selected.splice(u,1);}}else if(p.maxSel!=="0"){if(p.maxSel==="1"){m=p.selected.splice(0);}p.selected.push(i);g=[i];}}g.forEach(function(i){i["VB:s"]="true";});m.forEach(function(i){i["VB:s"]="false";});return{selected:g,deselected:m};};A.prototype._applySelectionChangesToScene3D=function(a,b){b.forEach(function(i){n(i,i.color);});a.forEach(function(i){n(i,i.selectColor);});return this;};A.prototype._applyHoverChangesToScene3D=function(i){if(this._lastHoverInstance!==i){if(this._lastHoverInstance){n(this._lastHoverInstance,this._lastHoverInstance[k(this._lastHoverInstance["VB:s"])?"selectColor":"color"]);}this._lastHoverInstance=i;if(this._lastHoverInstance){n(this._lastHoverInstance,this._lastHoverInstance.hotDeltaColor);}}return this;};return A;});
