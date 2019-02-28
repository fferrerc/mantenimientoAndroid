/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./library","./Tool","./RectSelectToolHandler","sap/ui/vk/Loco"],function(q,a,T,R,L){"use strict";var b=T.extend("sap.ui.vk.tools.RectSelectTool",{metadata:{properties:{subtractMode:{type:"boolean",defaultValue:false}}},constructor:function(i,s){if(b._instance){return b._instance;}T.apply(this,arguments);this._viewport=null;this._handler=new R(this);this._loco=null;b._instance=this;}});b.prototype.init=function(){if(T.prototype.init){T.prototype.init.call(this);}this.setFootprint(["sap.ui.vk.dvl.Viewport","sap.ui.vk.threejs.Viewport"]);};b.prototype.setActive=function(v,d,g){if(d&&d.getImplementation){d=d.getImplementation();}if(T.prototype.setActive){T.prototype.setActive.call(this,v,d,g);}if(v){this._activateTool(d);}else{this._deactivateTool();}if(d){d.setShouldRenderFrame();}return this;};b.prototype._activateTool=function(d){this._viewport=d;if(this._prepare()){this._handler.activate(d);}};b.prototype._deactivateTool=function(){this._handler.deactivate();};b.prototype._prepare=function(){if(this.isViewportType("sap.ui.vk.dvl.Viewport")&&this._viewport._dvl){return true;}else if(this.isViewportType("sap.ui.vk.threejs.Viewport")&&this._viewport._scene&&this._viewport._scene.getSceneRef()){return true;}else{return false;}};b.prototype.queueCommand=function(d){if(this._prepare()){if(this.isViewportType("sap.ui.vk.threejs.Viewport")){d();}}return this;};function c(d,e,v){var m=d.elements;var i=m[15]===1;var r=2/m[0];var t=2/m[5];var f,g;if(i){f=-m[12]*r;g=-m[13]*t;}else{f=m[8]*r;g=m[9]*t;}var h=(r+f)*0.5;var l=f-h;var j=(t+g)*0.5;var k=g-j;var n=THREE.Math.lerp(l,h,Math.min(e.x1,e.x2)/v.width);var o=THREE.Math.lerp(l,h,Math.max(e.x1,e.x2)/v.width);var p=THREE.Math.lerp(j,k,Math.min(e.y1,e.y2)/v.height);var s=THREE.Math.lerp(j,k,Math.max(e.y1,e.y2)/v.height);m[0]=2/(o-n);m[5]=2/(p-s);if(i){m[12]=-(o+n)/(o-n);m[13]=-(p+s)/(p-s);}else{m[8]=(o+n)/(o-n);m[9]=(p+s)/(p-s);}}b.prototype.select=function(x,y,d,e,s,f){var n=[];if(!this._prepare()){return n;}if(this.isViewportType("sap.ui.vk.dvl.Viewport")){n=this._viewport.rectSelect(x,y,d,e);if(n.length>0){var p={picked:n};this._viewport.fireNodesPicked(p);if(this.getSubtractMode()){this._viewport._viewStateManager.setSelectionStates([],n);}else{this._viewport._viewStateManager.setSelectionStates(n,[]);}}return n;}var g=s?s.getSceneRef():undefined;var h=f?f.getCameraRef():undefined;var v=this._viewport._getViewStateManagerThreeJS();if(!h||!g||!v||x===d||y===e){return n;}var r={x1:x,y1:y,x2:d,y2:e};var m=h.projectionMatrix.clone();c(m,r,this._viewport._renderer.getSize());var j=new THREE.Matrix4().multiplyMatrices(m,h.matrixWorldInverse);var k=new THREE.Frustum().setFromMatrix(j);var o=new THREE.Vector3();function t(z){var A=z.geometry;if(A!==undefined&&k.intersectsObject(z)){var i,l=0;if(A.isGeometry){var B=A.vertices;for(i=0,l=B.length;i<l;i++){o.copy(B[i]).applyMatrix4(z.matrixWorld);if(!k.containsPoint(o)){break;}}}else if(A.isBufferGeometry){var C=A.attributes.position;if(C!==undefined){for(i=0,l=C.count;i<l;i++){o.fromBufferAttribute(C,i).applyMatrix4(z.matrixWorld);if(!k.containsPoint(o)){break;}}}}return l>0&&i===l;}return false;}function u(l){if(l.visible===false){return;}var z=0,A=0;if(l.geometry!==undefined){z++;if(t(l)){A++;}}var B=l.children;if(B.length>0){for(var i=0;i<B.length;i++){var C=B[i];if(C.geometry!==undefined&&!C.name&&C.children.length===0){if(C.visible===true){z++;if(t(C)){A++;}}}else{u(C);}}}if(A>0&&z===A){n.push(l);}}u(g);if(n.length>0){var w={picked:n};this._viewport.fireNodesPicked(w);if(this.getSubtractMode()){v.setSelectionStates([],n);}else{v.setSelectionStates(n,[]);}}return n;};b.prototype.destroy=function(){T.prototype.destroy.call(this);this._viewport=null;this._handler=null;};return b;});
