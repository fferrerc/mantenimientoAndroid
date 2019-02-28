/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","../library","./thirdparty/three","sap/ui/base/ManagedObject","./Billboard","../ve/thirdparty/html2canvas"],function(q,l,t,B,a,h){"use strict";var C=a.extend("sap.ui.vk.threejs.Callout",{metadata:{properties:{anchorNode:{type:"any",defaultValue:null},depthTest:{type:"boolean",defaultValue:true}}},constructor:function(i,s,S){a.apply(this,arguments);this._billboard.material.depthTest=this.getDepthTest();var f=this._billboard.geometry.boundingBox;f.min.setScalar(0);f.max.setScalar(0);this._lines=[];}});C.prototype.setRenderOrder=function(v){a.prototype.setRenderOrder.call(this,v);if(this._lines){this._lines.forEach(function(f){f.renderOrder=v;});}return this;};C.prototype.setDepthTest=function(v){this.setProperty("depthTest",v,true);if(this._billboard){this._billboard.material.depthTest=v;this._lines.forEach(function(f){f.material.depthTest=v;});}return this;};var b=new THREE.Vector4(),m=new THREE.Matrix4(),d=new THREE.Vector2(),c=new THREE.Vector3(),e=new THREE.Vector3();C.prototype._update=function(r,f){this._node.matrix.getInverse(this._node.parent.matrixWorld);this._node.matrix.decompose(this._node.position,this._node.rotation,this._node.scale);this._node.matrixWorld.identity();var v=r.getSize(),s=this.getPosition(),g=this._billboard.position;if(s){g.copy(s);}else{g.setScalar(0);}var i=this.getAnchorNode();if(i){g.applyMatrix4(i.matrixWorld);}this._billboard.rotation.copy(f.rotation);b.copy(g).applyMatrix4(f.matrixWorldInverse).applyMatrix4(f.projectionMatrix);var j=(b.x/b.w)*v.width,k=(b.y/b.w)*v.height;var n=b.w*2/(v.width*f.projectionMatrix.elements[0]);this._billboard.scale.set(n*this._width,n*this._height,1);c.setFromMatrixColumn(f.matrixWorld,0).multiplyScalar(n*(Math.round(j*0.5)-j*0.5));e.setFromMatrixColumn(f.matrixWorld,1).multiplyScalar(n*(Math.round(k*0.5)-k*0.5));g.add(c).add(e);this._billboard.updateMatrixWorld();c.setFromMatrixColumn(this._billboard.matrixWorld,0);e.setFromMatrixColumn(this._billboard.matrixWorld,1);var o=this.getStyle()===sap.ui.vk.BillboardStyle.CircularShape;function u(p,w,x){if(p<w){return p-w;}else if(p>x){return p-x;}return 0;}this._lines.forEach(function(p){if(p.userData.targetNode){p.matrix.copy(p.userData.targetNode.matrixWorld);p.matrixWorld.copy(p.matrix);}var w=p.geometry.vertices,x=w[w.length-2],y=w[w.length-1],z=false;b.copy(x).applyMatrix4(p.matrixWorld).applyMatrix4(f.matrixWorldInverse).applyMatrix4(f.projectionMatrix);var A=(b.x/b.w)*v.width,D=(b.y/b.w)*v.height;if(o){var E=d.set(A-j,D-k).length();z=E<this._width;d.multiplyScalar(0.5/E);y.copy(c.multiplyScalar(d.x)).add(e.multiplyScalar(d.y));}else{var F=u(A,j-this._width,j+this._width),G=u(D,k-this._height,k+this._height);z=(F===0&&G===0);if(Math.abs(F)>Math.abs(G)){y.copy(c).multiplyScalar(Math.sign(F)*0.5);}else{y.copy(e).multiplyScalar(Math.sign(G)*0.5);}}if(z){y.copy(x);}else{y.add(g).applyMatrix4(m.getInverse(p.matrixWorld));}p.geometry.verticesNeedUpdate=true;}.bind(this));};C.prototype.addLeaderLine=function(v,f,g,s,i){var j=new THREE.Geometry();j.vertices=v;var k=new THREE.Line(j,g.clone());k.userData.targetNode=f;k.matrixAutoUpdate=false;k.matrixWorldNeedsUpdate=false;k.renderOrder=this.getRenderOrder();k.material.transparent=true;k.material.depthTest=this.getDepthTest();this._node.add(k);this._lines.push(k);return k;};return C;});