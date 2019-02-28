sap.ui.define(["jquery.sap.global","./TotaraUtils","./GeometryFactory","./MaterialHandler","./SceneStateContext"],function(q,T,G,M,S){"use strict";var a=function(){};a.setMesh=function(s,c,b){if(T.checkError(c)){return c;}var r={updatedContexts:[],materialIdSet:new Set(),geometryIdMap:new Map()};var m=c.meshes;var d=s.materialIdsToRequest;var e;var v=s.contextMap.values();var f=v.next();while(!f.done){f.value.isUpdatedBySetMesh=false;f=v.next();}for(var i=0;i<m.length;i++){var g=m[i];var h=g.id;for(var j=0;j<g.submeshes.length;j++){var l=g.submeshes[j];var o=s.sceneBuilder.setSubmesh(h,l);if(o.needUpdataMaterial){r.materialIdSet.add(l.materialId);d.add(l.materialId);}if(o.geometryIdToRequest){r.geometryIdMap.set(o.geometryIdToRequest,o.geometryPriority);s.geometryIdMaterialIdMap.set(o.geometryIdToRequest,l.materialId);}}v=s.contextMap.values();f=v.next();while(!f.done){e=f.value;f=v.next();var p=e.meshGroupListMap.get(h);if(p){e.isUpdatedBySetMesh=true;var t=function(C){var D=[];C.forEach(function(E){D.push(E);});return D;};for(var k=0;k<p.length;k++){var u=p[k];var w=s.sceneBuilder.attachSubMeshesToNode(u,e.sceneId);s.sceneBuilder.applyNodeMaterialToSubmeshes(u,e.sceneId);var x=s.sceneBuilder.applyNodeOpacityToSubmeshes(u,e.sceneId);if(x.materialIds.length){for(var y=0;y<x.materialIds.length;y++){var z=e.materialIdNodeListMapForOpacityUpdate.getOrCreate(x.materialIds[y]);z.push(u);}}var A=t(w.idOfGeometriesToUpdate);for(var n=0;n<A.length;n++){var B=e.boundingBoxNodeIdsListMap.getOrCreate(A[n]);B.push(u);}}e.meshGroupListMap.delete(h);e.progressCount.mesh.count++;}}}v=s.contextMap.values();f=v.next();while(!f.done){e=f.value;f=v.next();if(e.isUpdatedBySetMesh){r.updatedContexts.push(e);delete e.isUpdatedBySetMesh;}}return r;};a.setGeometry=function(s,g,b){if(T.checkError(g)){return g;}var r={updatedContexts:[]};var c=g.id;if(!b||b.length===0){r.error="missing geometry "+c;return r;}var d=G.getGeometryInfo(g,b);s.sceneBuilder.setGeometry(d);var v=s.contextMap.values();var e=v.next();while(!e.done){var f=e.value;e=v.next();var n=f.boundingBoxNodeIdsListMap.get(c);if(n){r.updatedContexts.push(f);for(var i=0;i<n.length;i++){s.sceneBuilder.updateGeometryInNode(n[i],c,f.sceneId);}f.boundingBoxNodeIdsListMap.delete(c);}if(f.boundingBoxNodeIdsListMap.size===0){f.phase=S.Phase.FinishedGeometry;}f.progressCount.geometry.count++;}if(g&&g.flags){var h=(g.flags&2)>0;if(!h){var m=s.geometryIdMaterialIdMap.get(c);if(m){s.sceneBuilder.updateMaterialForGeometryWithoutNormal(m);}}}return r;};return a;});