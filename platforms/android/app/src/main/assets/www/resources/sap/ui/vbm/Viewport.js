/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["sap/ui/core/Control","jquery.sap.global","sap/ui/core/ResizeHandler","./adapter3d/thirdparty/three","./adapter3d/thirdparty/OrbitControls","./adapter3d/Utilities","./library"],function(C,q,R,T,O,U,l){"use strict";var t="sap.ui.vbm.Viewport";var a=q.sap.log;var V=C.extend("sap.ui.vbm.Viewport",{metadata:{library:"sap.ui.vbm",properties:{width:{type:"sap.ui.core.CSSSize",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",defaultValue:"100%"},cameraHistoryLength:{type:"int",defaultValue:0},cameraHistoryPos:{type:"int"}},events:{cameraChange:{parameters:{historyPos:{type:"int"},historyLength:{type:"int"}}}}}});var E=0.000001;var F=0.6;var b=V.getMetadata().getParent().getClass().prototype;V.prototype.init=function(){if(b.init){b.init.call(this);}this._resizeListenerId=null;this._renderLoopRequestId=0;this._renderLoopFunction=this._renderLoop.bind(this);this._renderer=new T.WebGLRenderer({antialias:true});this._renderer.setPixelRatio(window.devicePixelRatio);this._renderer.shadowMap.enabled=true;this._renderer.domElement.tabIndex=-1;this._renderer.domElement.id=this.getId()+"-canvas";this._scene=new T.Scene();this._root=new T.Group();this._root.scale.set(-1,1,1);this._root.rotateX(T.Math.degToRad(90));this._scene.add(this._root);this._scene.background=new T.Color('white');var c=new T.AmbientLight(0x202020,1);this._scene.add(c);var d=new T.DirectionalLight(0x333333,1);d.position.set(0,0,-1);this._scene.add(d);var g=new T.DirectionalLight(0x51515b,1);g.position.set(-2,-1.1,2.5);this._scene.add(g);var h=new T.DirectionalLight(0x5b5b5b,2);h.position.set(2,1.5,0.5);this._scene.add(h);this._light=new T.DirectionalLight(0xEEEEEE,1);this._lightPos=new T.Vector3(0,0,0);this._scene.add(this._light);this._camera=new T.PerspectiveCamera(30,window.innerWidth/window.innerHeight,0.1,2000);this._scene.add(this._camera);this._camera.position.set(0,30,30);this._camera.lookAt(new T.Vector3(0,0,0));this._cameraHome;this._flyToRequestId;this._resetTimerId;this._cameraHistory=[];this._cameraChangeEvent={};this._cameraController=new O(this._camera,this._renderer.domElement);this._cameraController.addEventListener("end",this._cameraEnd.bind(this));this._cameraController.addEventListener("change",this._cameraUpdate.bind(this));this._cameraController.update();};V.prototype.exit=function(){if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}this._stopRenderLoop();this._scene=null;this._camera=null;this._renderer=null;if(b.exit){b.exit.call(this);}};V.prototype.getRoot=function(){return this._root;};V.prototype.getScene=function(){return this._scene;};V.prototype.getCamera=function(){return this._camera;};V.prototype.getCameraHistoryLength=function(){return this._cameraHistory.length;};V.prototype.setCameraHistoryLength=function(){a.error("cameraHistoryLength is read only property",t);return this;};V.prototype.setCameraHistoryPos=function(p){if(this._cameraHistory.length>0&&p>=0&&p<this._cameraHistory.length){if(p!==this.getCameraHistoryPos()){this.setProperty("cameraHistoryPos",p,true);delete this._cameraHistory[p].tag;this._fireCameraChange();this._flyTo(this._cameraController.saveState(),this._cameraHistory[p],F);}}return this;};V.prototype.applyCameraHome=function(c){if(this._cameraHome){this._applyCamera(this._cameraHome,c);}};V.prototype.worldToScreen=function(p){var c=this.getDomRef();if(!c){return undefined;}var d=c.getBoundingClientRect();var g=this.getCamera();var m=new T.Matrix4().multiplyMatrices(g.projectionMatrix,new T.Matrix4().getInverse(g.matrixWorld));var s=p.clone().applyMatrix4(m);var x=Math.floor((+s.x*0.5+0.5)*d.width+0.5);var y=Math.floor((-s.y*0.5+0.5)*d.height+0.5);return new T.Vector2(x,y);};V.prototype.onBeforeRendering=function(){if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}this._stopRenderLoop();};V.prototype.onAfterRendering=function(){var d=this.getDomRef();d.appendChild(this._renderer.domElement);this._resizeListenerId=R.register(this,this._handleResize.bind(this));this._handleResize({size:{width:d.clientWidth,height:d.clientHeight}});this._startRenderLoop();};V.prototype._handleResize=function(c){if(!this._camera||!this._renderer){return false;}var w=c.size.width;var h=c.size.height;if(this._camera){this._camera.aspect=w/h;this._camera.updateProjectionMatrix();}this._renderer.setSize(w,h,false);};V.prototype._startRenderLoop=function(){if(!this._renderLoopRequestId){this._renderLoopRequestId=window.requestAnimationFrame(this._renderLoopFunction);}return this;};V.prototype._stopRenderLoop=function(){if(this._renderLoopRequestId){window.cancelAnimationFrame(this._renderLoopRequestId);this._renderLoopRequestId=0;}return this;};V.prototype._renderLoop=function(){this._cameraController.update();this._camera.getWorldDirection(this._lightPos);this._lightPos.negate();this._light.position.copy(this._lightPos);this._renderer.render(this._scene,this._camera);this._renderLoopRequestId=window.requestAnimationFrame(this._renderLoopFunction);};function e(c,s,d,g){return s+d*((c=c/g-1)*c*c+1);}function f(c){var d=Math.min((Date.now()-c.when)/1000,c.length);var g=c.tempTarget;g.x=e(d,c.from.target.x,c.to.target.x-c.from.target.x,c.length);g.y=e(d,c.from.target.y,c.to.target.y-c.from.target.y,c.length);g.z=e(d,c.from.target.z,c.to.target.z-c.from.target.z,c.length);var h=e(d,c.distanceFrom,c.distanceTo-c.distanceFrom,c.length);var i=e(d,0,c.angle,c.length);var p=c.tempPos.copy(c.dir).applyAxisAngle(c.axis,i).multiplyScalar(h).add(g);this._cameraController.reset({position:p,target:g,zoom:1.0});if(d<c.length){this._flyToRequestId=window.requestAnimationFrame(f.bind(this,c));}else{this._flyToRequestId=undefined;}}V.prototype._flyTo=function(c,d,g){var h=d.position.clone().sub(d.target);var i=c.position.clone().sub(c.target);var j=h.length();var k=i.length();var m=Math.acos(U.clamp(i.dot(h)/(j*k),-1,1));var n={to:d,from:c,when:Date.now(),length:g,angle:m,axis:i.clone().cross(h).normalize(),distanceTo:j,distanceFrom:k,dir:i.normalize(),tempPos:new T.Vector3(),tempTarget:new T.Vector3()};if(this._flyToRequestId){window.cancelAnimationFrame(this._flyToRequestId);}this._flyToRequestId=window.requestAnimationFrame(f.bind(this,n));};V.prototype._cameraEnd=function(c){var s=this._cameraController.saveState();var p=this.getCameraHistoryPos();var d=p>=0?this._cameraHistory[p]:undefined;if(d==undefined||s.target.distanceToSquared(d.target)>E||s.position.distanceToSquared(d.position)>E){this._pushCameraChange(s);}};function r(){if(this._cameraHistory.length>0){delete this._cameraHistory[this._cameraHistory.length-1].tag;}this._resetTimerId=undefined;}V.prototype._cameraUpdate=function(c){if(c.tag){if(this._resetTimerId){window.clearTimeout(this._resetTimerId);}this._resetTimerId=window.setTimeout(r.bind(this),500);var s=this._cameraController.saveState();var p=this.getCameraHistoryPos();s.tag=c.tag;var d=p>=0?this._cameraHistory[p]:{};if(s.tag&&s.tag===d.tag){this._cameraHistory[p]=s;}else{this._pushCameraChange(s);}}};V.prototype._fireCameraChange=function(){this._cameraChangeEvent.historyPos=this.getCameraHistoryPos();this._cameraChangeEvent.historyLength=this._cameraHistory.length;this.fireCameraChange(this._cameraChangeEvent);};V.prototype._pushCameraChange=function(s){var p=this.getCameraHistoryPos();this._cameraHistory.splice(p>=0?p+1:0,this._cameraHistory.length);this._cameraHistory.push(s);this.setProperty("cameraHistoryPos",this._cameraHistory.length-1,true);this._fireCameraChange();};V.prototype._setCameraHome=function(s){this._cameraHome=s;};V.prototype._applyCamera=function(s,c){var d=this._cameraController.saveState();if(s.target.distanceToSquared(d.target)>E||s.position.distanceToSquared(d.position)>E){this._pushCameraChange(s);if(c){this._flyTo(this._cameraController.saveState(),s,F);}else{this._cameraController.reset(s);}}};return V;});